'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  MapPin, Users, Phone, User, Mail, FileText, Plane, Clock, Star,
  Loader2, ChevronRight, Package, RotateCcw, Check, ArrowLeft, BadgeCheck,
} from 'lucide-react';
import { ServiceType, VehicleType } from '@/types';
import { FLEET } from '@/lib/data';
import { getLoganQuote, vehicleClassOf } from '@/lib/quote';
import { PREFILL_EVENT, type PrefillDetail } from '@/components/ui/FareFinder';
import { trackFormConversion } from '@/lib/gtag';
import { Button } from '@/components/ui/Button';
import { TextInput, Textarea, SelectInput, FieldLabel } from '@/components/ui/Field';
import { AddressAutocomplete, type SavedAddressOption } from '@/components/ui/AddressAutocomplete';
import clsx from 'clsx';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

/* ── Schema ─────────────────────────────────────────────────────────────── */

const schema = z.object({
  serviceType:    z.nativeEnum(ServiceType),
  pickup:         z.string().min(3, 'Required'),
  dropoff:        z.string().min(3, 'Required'),
  date:           z.string().min(1, 'Required'),
  time:           z.string().min(1, 'Required'),
  passengers:     z.number().min(1).max(8),
  luggageCount:   z.number().min(0).max(10),
  flightNumber:   z.string().optional(),
  returnTrip:     z.boolean(),
  returnDatetime: z.string().optional(),
  vehicleId:      z.string().min(1, 'Required'),
  name:           z.string().min(2, 'Required'),
  phone:          z.string().min(7, 'Required'),
  email:          z.string().email('Invalid email').optional().or(z.literal('')),
  notes:          z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STEP1_FIELDS: (keyof FormData)[] = [
  'serviceType', 'pickup', 'dropoff', 'date', 'time', 'passengers', 'luggageCount',
];

/* ── StepperInput ───────────────────────────────────────────────────────── */

function StepperInput({
  value, onChange, min, max, icon,
}: {
  value: number; onChange: (v: number) => void;
  min: number; max: number; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center border border-brand-border rounded-xl bg-white overflow-hidden">
      {icon && <span className="pl-3 text-brand-magenta">{icon}</span>}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-3 py-3 text-brand-magenta font-bold text-base leading-none hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <span className="flex-1 text-center text-sm font-semibold text-gray-800 py-3 min-w-[2rem]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-3 py-3 text-brand-magenta font-bold text-base leading-none hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}

/* ── StepIndicator ──────────────────────────────────────────────────────── */

function StepIndicator({
  step, labels, onBack, onStepClick, maxReachableStep,
}: {
  step: number;
  labels: string[];
  onBack?: () => void;
  onStepClick: (target: number) => void;
  maxReachableStep: number;
}) {
  return (
    <div className={clsx('relative flex items-start justify-center mb-5', onBack && 'px-9')}>
      {/* Back button — left side, aligned to circle row */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-magenta hover:bg-brand-light transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
        </button>
      )}

      {/* Steps */}
      <div className="flex items-start">
        {labels.map((label, i) => {
          const num       = i + 1;
          const active    = num === step;
          const done      = num < step;
          return (
            <div key={num} className="flex items-start">
              <div className="flex flex-col items-center">
                {(() => {
                  const clickable = num !== step && num <= maxReachableStep;
                  return (
                    <button
                      type="button"
                      onClick={() => { if (clickable) onStepClick(num); }}
                      className={clsx(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                        done || active ? 'bg-brand-magenta text-white' : 'bg-gray-100 text-gray-400',
                        clickable ? 'cursor-pointer hover:opacity-75' : 'cursor-default',
                      )}
                    >
                      {done ? <Check size={12} /> : num}
                    </button>
                  );
                })()}
                <span className={clsx(
                  'text-[10px] mt-1 font-medium whitespace-nowrap',
                  active ? 'text-brand-magenta' : 'text-gray-400',
                )}>
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <div className={clsx('w-8 h-px mx-2 mt-3.5 flex-shrink-0', done ? 'bg-brand-magenta' : 'bg-gray-200')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Service type config ────────────────────────────────────────────────── */

const SERVICE_TYPES = [
  { value: ServiceType.AIRPORT, Icon: Plane  },
  { value: ServiceType.CITY,    Icon: MapPin },
  { value: ServiceType.HOURLY,  Icon: Clock  },
  { value: ServiceType.EVENT,   Icon: Star   },
] as const;

/* ── Main form ──────────────────────────────────────────────────────────── */

export function BookingForm({
  defaultServiceType = ServiceType.CITY,
}: {
  /** Pre-selects the service pill — service landing pages open with theirs. */
  defaultServiceType?: ServiceType;
} = {}) {
  const t = useTranslations('booking');

  const [step, setStep]                     = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted]           = useState(false);
  const [reference, setReference]           = useState<string | null>(null);
  const [submitError, setSubmitError]       = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressOption[]>([]);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Offer the signed-in user's saved addresses as quick picks. Returns an empty
  // list for guests, so this is a no-op for them.
  useEffect(() => {
    let active = true;
    fetch('/api/me/addresses')
      .then((r) => (r.ok ? r.json() : { addresses: [] }))
      .then((d) => { if (active) setSavedAddresses(d.addresses ?? []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const {
    register, handleSubmit, control, watch, setValue, trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType:  defaultServiceType,
      passengers:   1,
      luggageCount: 0,
      returnTrip:   false,
      vehicleId:    '',
    },
  });

  // Hero fare finder → pre-fill the trip (airport run at the published rate).
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<PrefillDetail>).detail;
      if (!d?.pickup || !d?.dropoff) return;
      setValue('serviceType', ServiceType.AIRPORT);
      setValue('pickup', d.pickup, { shouldValidate: true });
      setValue('dropoff', d.dropoff, { shouldValidate: true });
      setStep(1);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [setValue]);

  const serviceType  = watch('serviceType');
  const passengers   = watch('passengers');
  const returnTrip   = watch('returnTrip');
  const vehicleId    = watch('vehicleId');
  const pickup       = watch('pickup');
  const dropoff      = watch('dropoff');
  const date         = watch('date');
  const time         = watch('time');

  const step1Ready       = (pickup ?? '').length >= 3 && (dropoff ?? '').length >= 3 && (date ?? '').length > 0 && (time ?? '').length > 0;
  const step2Ready       = (vehicleId ?? '').length > 0;
  const maxReachableStep = step2Ready && step1Ready ? 3 : step1Ready ? 2 : 1;

  const availableVehicles = FLEET.filter(v => v.maxPassengers >= passengers);

  // Live flat-rate quote for corridor-town ↔ Logan trips.
  const quote          = getLoganQuote(pickup ?? '', dropoff ?? '');
  const quotedRate     = quote ? (vehicleClassOf(vehicleId) === 'sedan' ? quote.sedanRate : quote.suvRate) : null;
  const rateForVehicle = (id: string) =>
    quote ? (vehicleClassOf(id) === 'sedan' ? quote.sedanRate : quote.suvRate) : null;

  const handleStep1Continue = async () => {
    const valid = await trigger(STEP1_FIELDS);
    if (valid) setStep(2);
  };

  const handleVehicleSelect = (id: string) => {
    setValue('vehicleId', id);
    setStep(3);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError(false);

    if (honeypotRef.current?.value || !recaptchaToken) {
      setSubmitted(true);
      return;
    }

    const selectedVehicle = FLEET.find(v => v.id === data.vehicleId);
    const vType = selectedVehicle?.type ?? VehicleType.REGULAR;

    try {
      // Single authoritative request: the API verifies reCAPTCHA, persists the
      // booking, and notifies the operator (email + Telegram) server-side.
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          email: data.email || undefined,
          vehicleType: vType,
          quotedRate: quotedRate ?? undefined,
          recaptchaToken,
        }),
      });

      if (!res.ok) throw new Error('Booking request failed');

      // Fire the lead conversion with enhanced data + the booking reference as
      // the dedup key (reference comes back from /api/booking).
      const result = (await res.json().catch(() => null)) as { reference?: string } | null;
      trackFormConversion({
        reference: result?.reference,
        name: data.name,
        phone: data.phone,
      });
      setReference(result?.reference ?? null);
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-brand-dark font-semibold text-base mb-1">{t('successTitle')}</p>
        {reference && (
          <p className="text-sm text-gray-600 mb-3">
            {t('successRef')}{' '}
            <span className="font-mono font-bold text-brand-magenta tracking-wide">{reference}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 mb-4">{t('successNext')}</p>
        <a
          href="tel:+17812345451"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-magenta hover:underline"
        >
          <Phone size={14} /> {t('successCall')}
        </a>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  /* ── Step 1: Trip Details ────────────────────────────────────────────── */

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Service type pills */}
      <div>
        <FieldLabel label={t('serviceType')} />
        <Controller
          name="serviceType"
          control={control}
          render={({ field }) => {
            const SelectedIcon = SERVICE_TYPES.find(s => s.value === field.value)?.Icon ?? MapPin;
            return (
              <>
                {/* Phones: the two-up pills truncate their labels, so use a dropdown */}
                <div className="sm:hidden">
                  <SelectInput
                    value={field.value}
                    onChange={e => field.onChange(e.target.value as ServiceType)}
                    icon={<SelectedIcon size={14} />}
                  >
                    {SERVICE_TYPES.map(({ value }) => (
                      <option key={value} value={value}>{t(`services.${value}`)}</option>
                    ))}
                  </SelectInput>
                </div>

                {/* Larger screens: pill grid */}
                <div className="hidden sm:grid grid-cols-2 gap-2">
                  {SERVICE_TYPES.map(({ value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150',
                        field.value === value
                          ? 'border-brand-magenta bg-brand-light text-brand-magenta'
                          : 'border-brand-border bg-white text-gray-600 hover:border-brand-magenta/50 hover:bg-brand-blush',
                      )}
                    >
                      <Icon size={14} className="flex-shrink-0" />
                      <span className="truncate">{t(`services.${value}`)}</span>
                    </button>
                  ))}
                </div>
              </>
            );
          }}
        />
      </div>

      {/* Pickup */}
      <div>
        <FieldLabel label={t('pickup')} error={errors.pickup ? 'Required' : undefined} />
        <Controller
          name="pickup"
          control={control}
          render={({ field }) => (
            <AddressAutocomplete
              id="pickup"
              placeholder={t('pickupPlaceholder')}
              value={field.value ?? ''}
              hasError={!!errors.pickup}
              onChange={field.onChange}
              savedAddresses={savedAddresses}
            />
          )}
        />
      </div>

      {/* Dropoff */}
      <div>
        <FieldLabel label={t('dropoff')} error={errors.dropoff ? 'Required' : undefined} />
        <Controller
          name="dropoff"
          control={control}
          render={({ field }) => (
            <AddressAutocomplete
              id="dropoff"
              placeholder={t('dropoffPlaceholder')}
              value={field.value ?? ''}
              hasError={!!errors.dropoff}
              onChange={field.onChange}
              savedAddresses={savedAddresses}
            />
          )}
        />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel label={t('date')} error={errors.date ? 'Required' : undefined} />
          <TextInput type="date" {...register('date')} min={today} error={!!errors.date} />
        </div>
        <div>
          <FieldLabel label={t('time')} error={errors.time ? 'Required' : undefined} />
          <TextInput type="time" {...register('time')} error={!!errors.time} />
        </div>
      </div>

      {/* Passengers + Luggage */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel label={t('passengers')} error={errors.passengers ? 'Required' : undefined} />
          <Controller
            name="passengers"
            control={control}
            render={({ field }) => (
              <StepperInput
                value={field.value}
                onChange={field.onChange}
                min={1}
                max={8}
                icon={<Users size={14} />}
              />
            )}
          />
        </div>
        <div>
          <FieldLabel label={t('luggageCount')} />
          <Controller
            name="luggageCount"
            control={control}
            render={({ field }) => (
              <StepperInput
                value={field.value}
                onChange={field.onChange}
                min={0}
                max={10}
                icon={<Package size={14} />}
              />
            )}
          />
        </div>
      </div>

      {/* Live flat-rate quote — corridor town ↔ Logan trips only */}
      {quote && (
        <div className="flex items-start gap-2.5 rounded-xl border border-brand-magenta/30 bg-brand-light px-3.5 py-3">
          <BadgeCheck size={16} className="text-brand-magenta flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 leading-snug">
            <span className="font-semibold text-brand-dark">
              {t('quoteBanner', { town: quote.town.name })}
            </span>{' '}
            <span className="font-bold text-brand-magenta">${quote.sedanRate}</span> {t('quoteSedan')}
            {' · '}
            <span className="font-bold text-brand-magenta">${quote.suvRate}</span> {t('quoteSuv')}
            <span className="block text-xs text-gray-500 mt-0.5">{t('quoteNote')}</span>
          </p>
        </div>
      )}

      {/* Flight number (airport only) */}
      {serviceType === ServiceType.AIRPORT && (
        <div>
          <FieldLabel label={t('flightNumber')} optional />
          <TextInput
            {...register('flightNumber')}
            icon={<Plane size={15} />}
            placeholder={t('flightNumberPlaceholder')}
          />
        </div>
      )}

      {/* Return trip toggle */}
      <div className="flex items-center justify-between border border-brand-border rounded-xl px-3 py-3 bg-white">
        <div className="flex items-center gap-2">
          <RotateCcw size={14} className="text-brand-magenta" />
          <span className="text-sm font-medium text-gray-700">{t('returnTrip')}</span>
        </div>
        <Controller
          name="returnTrip"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              role="switch"
              aria-checked={field.value}
              onClick={() => field.onChange(!field.value)}
              className={clsx(
                'relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer',
                field.value ? 'bg-brand-magenta' : 'bg-gray-200',
              )}
            >
              <span className={clsx(
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                field.value ? 'translate-x-5' : 'translate-x-0',
              )} />
            </button>
          )}
        />
      </div>

      {/* Return datetime (conditional) */}
      {returnTrip && (
        <div>
          <FieldLabel label={t('returnDatetime')} optional />
          <TextInput type="datetime-local" {...register('returnDatetime')} min={today} />
        </div>
      )}

      <Button type="button" size="lg" fullWidth onClick={handleStep1Continue}>
        {t('next')} <ChevronRight size={16} />
      </Button>
    </div>
  );

  /* ── Step 2: Select Vehicle ──────────────────────────────────────────── */

  const renderStep2 = () => (
    <div className="space-y-3">
      {availableVehicles.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">{t('noVehicles')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {availableVehicles.map(vehicle => {
            const isSelected = vehicleId === vehicle.id;

            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleVehicleSelect(vehicle.id)}
                className={clsx(
                  'relative flex flex-col rounded-xl border overflow-hidden text-left transition-all duration-150 cursor-pointer',
                  isSelected
                    ? 'border-brand-magenta ring-1 ring-brand-magenta'
                    : 'border-brand-border hover:border-brand-magenta/60',
                )}
              >
                {/* Vehicle image */}
                <div className="w-full aspect-video overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>

                {/* Vehicle info */}
                <div className="p-2.5 bg-white flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-800 leading-tight truncate">{vehicle.name}</p>
                  <div className="flex items-center justify-between">
                    {rateForVehicle(vehicle.id) !== null ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-light text-brand-magenta tracking-wide">
                        ${rateForVehicle(vehicle.id)} {t('quoteFlat')}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 tracking-wide">
                        VIP
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Users size={10} />{vehicle.maxPassengers}
                      <Package size={10} className="ml-1" />{vehicle.maxLuggage}
                    </span>
                  </div>
                </div>

                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-magenta flex items-center justify-center shadow">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ── Step 3: Your Info ───────────────────────────────────────────────── */

  const renderStep3 = () => {
    const selectedVehicle = FLEET.find(v => v.id === vehicleId);

    return (
      <div className="space-y-4">
        {/* Trip summary */}
        {selectedVehicle && (
          <div className="bg-brand-blush border border-brand-border rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">{selectedVehicle.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 tracking-wide">VIP</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin size={11} className="text-brand-magenta flex-shrink-0" />
                <span className="truncate">{pickup}</span>
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin size={11} className="text-gray-300 flex-shrink-0" />
                <span className="truncate">{dropoff}</span>
              </p>
              {date && (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Clock size={11} className="text-brand-magenta flex-shrink-0" />
                  <span>{new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {(() => { const [h, m] = time.split(':').map(Number); const hr = h % 12 === 0 ? 12 : h % 12; return `${hr}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; })()}</span>
                </p>
              )}
            </div>
            {quotedRate !== null && (
              <div className="mt-2.5 pt-2.5 border-t border-brand-border flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">{t('quoteYourRate')}</span>
                <span className="text-base font-bold text-brand-magenta">
                  ${quotedRate} <span className="text-[10px] font-semibold uppercase tracking-wide">{t('quoteFlat')}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Name + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel label={t('name')} error={errors.name ? 'Required' : undefined} />
            <TextInput
              {...register('name')}
              icon={<User size={15} />}
              error={!!errors.name}
              placeholder="John Smith"
            />
          </div>
          <div>
            <FieldLabel label={t('phone')} error={errors.phone ? 'Required' : undefined} />
            <TextInput
              {...register('phone')}
              type="tel"
              icon={<Phone size={15} />}
              error={!!errors.phone}
              placeholder={t('phonePlaceholder')}
            />
          </div>
        </div>

        {/* Email — optional; guests who leave it get a written confirmation */}
        <div>
          <FieldLabel label={t('emailShort')} optional error={errors.email ? t('emailInvalid') : undefined} />
          <TextInput
            {...register('email')}
            type="email"
            icon={<Mail size={15} />}
            error={!!errors.email}
            placeholder={t('emailPlaceholder')}
          />
        </div>

        {/* Notes */}
        <div>
          <FieldLabel label={t('notes')} optional />
          <Textarea
            {...register('notes')}
            icon={<FileText size={15} />}
            rows={2}
            placeholder="Special instructions, accessibility needs…"
            className="resize-none"
          />
        </div>

        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={token => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
          />
        </div>

        {submitError && (
          <p className="text-red-500 text-sm text-center">{t('error')}</p>
        )}

        <Button type="submit" size="lg" fullWidth disabled={isSubmitting || !recaptchaToken}>
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" /> {t('submitting')}</>
            : t('submit')
          }
        </Button>
      </div>
    );
  };

  /* ── Render ─────────────────────────────────────────────────────────── */

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        ref={honeypotRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <StepIndicator
        step={step}
        labels={[t('step1Title'), t('step2Title'), t('step3Title')]}
        onBack={step > 1 ? () => setStep((step - 1) as 1 | 2 | 3) : undefined}
        onStepClick={(target) => setStep(target as 1 | 2 | 3)}
        maxReachableStep={maxReachableStep}
      />

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </form>
  );
}
