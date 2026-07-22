/* Google Ads conversion tracking + enhanced conversions (+ optional GA4).
   All IDs come from env — if they're missing, every call is a silent no-op,
   so the site works fine before the Google Ads account is wired up. */

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? '';
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';

const LABEL_FORM  = process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_FORM  ?? '';
const LABEL_PHONE = process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE ?? '';
const LABEL_EMAIL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_EMAIL ?? '';

// Proxy $ value of a lead, used for value-based bidding (Max Conversion Value /
// tROAS). 0 = don't send a value. Tune via NEXT_PUBLIC_LEAD_VALUE.
const LEAD_VALUE = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? '0') || 0;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Identifiers passed with a lead so Google can match the conversion to an ad
 *  click (enhanced conversions). All optional — we send whatever we have. */
export interface LeadData {
  reference?: string;
  name?: string;
  phone?: string;
  email?: string;
}

/** Best-effort E.164 for US numbers — Google's enhanced conversions want +1…. */
function toE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const hadPlus = phone.trim().startsWith('+');
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  if (hadPlus) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

/** Feed user-provided identifiers for enhanced conversions. The Google tag
 *  normalizes & hashes (SHA-256) these before sending, so we pass plain values.
 *  Requires "Enhanced conversions for leads" enabled in the Google Ads UI. */
function setUserData(data: LeadData) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const userData: Record<string, unknown> = {};
  const email = data.email?.trim().toLowerCase();
  const phone_number = toE164(data.phone);
  if (email) userData.email = email;
  if (phone_number) userData.phone_number = phone_number;
  if (data.name?.trim()) {
    const [first, ...rest] = data.name.trim().split(/\s+/);
    userData.address = { first_name: first, last_name: rest.join(' ') || undefined };
  }
  if (Object.keys(userData).length === 0) return;
  window.gtag('set', 'user_data', userData);
}

function trackConversion(label: string, lead?: LeadData) {
  if (!GOOGLE_ADS_ID || !label) return;
  if (typeof window === 'undefined' || !window.gtag) return;

  if (lead) setUserData(lead);

  const params: Record<string, unknown> = { send_to: `${GOOGLE_ADS_ID}/${label}` };
  if (LEAD_VALUE > 0) {
    params.value = LEAD_VALUE;
    params.currency = 'USD';
  }
  // Dedup key — stops a page reload from double-counting the same booking.
  if (lead?.reference) params.transaction_id = lead.reference;

  window.gtag('event', 'conversion', params);
}

/** Booking form successfully submitted — primary conversion, with enhanced
 *  data + the booking reference as the dedup key. */
export const trackFormConversion  = (lead?: LeadData) => trackConversion(LABEL_FORM, lead);

/** A tel: link was clicked. */
export const trackPhoneConversion = () => trackConversion(LABEL_PHONE);

/** A mailto: link was clicked. */
export const trackEmailConversion = () => trackConversion(LABEL_EMAIL);
