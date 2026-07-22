'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Star } from 'lucide-react';
import clsx from 'clsx';

export interface SavedAddressOption {
  label?: string | null;
  address: string;
  isDefault?: boolean;
}

interface NominatimResult {
  display_name: string;
}

interface AddressAutocompleteProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  /** Saved addresses offered as quick picks before the user starts typing. */
  savedAddresses?: SavedAddressOption[];
}

/**
 * Address field with two suggestion sources: the user's saved addresses
 * (shown first, before typing) and live OpenStreetMap (Nominatim) results once
 * they type. Users can always type a brand-new manual address.
 */
export function AddressAutocomplete({
  id,
  name,
  placeholder,
  value,
  onChange,
  hasError,
  savedAddresses = [],
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typing = value.trim().length >= 3;
  const showSaved = !typing && savedAddresses.length > 0;

  const handleChange = (text: string) => {
    onChange(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    if (text.trim().length < 3) {
      setSuggestions([]);
      setOpen(savedAddresses.length > 0);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      abortRef.current = new AbortController();
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5&countrycodes=us`,
          { headers: { 'Accept-Language': 'en' }, signal: abortRef.current.signal },
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          /* silently skip */
        }
      }
    }, 300);
  };

  const select = (text: string) => {
    onChange(text);
    setSuggestions([]);
    setOpen(false);
  };

  const dropdownOpen = open && (showSaved || (typing && suggestions.length > 0));

  return (
    <div ref={containerRef} className="relative">
      <MapPin
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-brand-magenta"
      />
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (showSaved || suggestions.length > 0) setOpen(true);
        }}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        className={clsx(
          'w-full rounded-xl border bg-white py-3 pl-9 pr-3 text-sm outline-none transition-colors',
          hasError
            ? 'border-red-400 focus:border-red-500'
            : 'border-brand-border focus:border-brand-magenta',
        )}
      />
      {dropdownOpen && (
        <ul className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-brand-border bg-white shadow-lg">
          {showSaved ? (
            <>
              <li className="px-3 pb-1 pt-2 type-badge font-semibold text-gray-400">
                Your saved addresses
              </li>
              {savedAddresses.map((s, i) => (
                <li
                  key={`saved-${i}`}
                  onMouseDown={() => select(s.address)}
                  className="cursor-pointer border-b border-brand-border/50 px-3 py-2.5 text-sm last:border-0 hover:bg-brand-light"
                >
                  <div className="flex items-center gap-2">
                    {s.isDefault ? (
                      <Star size={12} className="flex-shrink-0 fill-brand-magenta text-brand-magenta" />
                    ) : (
                      <MapPin size={12} className="flex-shrink-0 text-gray-300" />
                    )}
                    <span className="min-w-0 truncate">
                      {s.label && <span className="font-medium text-brand-dark">{s.label} · </span>}
                      <span className="text-gray-600">{s.address}</span>
                    </span>
                  </div>
                </li>
              ))}
            </>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={`nom-${i}`}
                onMouseDown={() => select(s.display_name)}
                className="cursor-pointer truncate border-b border-brand-border/50 px-3 py-2.5 text-sm text-gray-700 last:border-0 hover:bg-brand-light"
              >
                {s.display_name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
