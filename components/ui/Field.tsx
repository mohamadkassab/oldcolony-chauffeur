import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

/** Shared text-field surface — the single source of truth for input/textarea styling. */
const fieldBase = 'rounded-xl border bg-white text-sm outline-none transition-colors py-3';

/** Border colour: red when invalid, brand otherwise. */
const borderClass = (error?: boolean) =>
  error ? 'border-red-400 focus:border-red-500' : 'border-brand-border focus:border-brand-magenta';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon (rendered magenta, vertically centred). */
  icon?:      ReactNode;
  fullWidth?: boolean;
  error?:     boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ icon, fullWidth = true, error, className, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        className={clsx(fieldBase, borderClass(error), fullWidth && 'w-full', icon ? 'pl-9 pr-3' : 'px-3', className)}
        {...props}
      />
    );
    if (!icon) return input;
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-magenta pointer-events-none">
          {icon}
        </span>
        {input}
      </div>
    );
  },
);
TextInput.displayName = 'TextInput';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?:      ReactNode;
  fullWidth?: boolean;
  error?:     boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ icon, fullWidth = true, error, className, ...props }, ref) => {
    const ta = (
      <textarea
        ref={ref}
        className={clsx(fieldBase, borderClass(error), fullWidth && 'w-full', icon ? 'pl-9 pr-3' : 'px-3', className)}
        {...props}
      />
    );
    if (!icon) return ta;
    return (
      <div className="relative">
        <span className="absolute left-3 top-3.5 text-brand-magenta pointer-events-none">{icon}</span>
        {ta}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?:      ReactNode;
  fullWidth?: boolean;
  error?:     boolean;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ icon, fullWidth = true, error, className, children, ...props }, ref) => (
    <div className={clsx('relative', fullWidth && 'w-full')}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-magenta pointer-events-none">
          {icon}
        </span>
      )}
      <select
        ref={ref}
        className={clsx(
          fieldBase, borderClass(error), fullWidth && 'w-full',
          'appearance-none cursor-pointer', icon ? 'pl-9 pr-9' : 'pl-3 pr-9',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <ChevronDown size={14} />
      </span>
    </div>
  ),
);
SelectInput.displayName = 'SelectInput';

interface FieldLabelProps {
  label:     string;
  error?:    string;
  optional?: boolean;
}

/** Label row above a field: name on the left, terse error on the right. */
export function FieldLabel({ label, error, optional }: FieldLabelProps) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs font-semibold text-gray-600">
        {label}
        {optional && <span className="font-normal text-gray-400 ml-1">(optional)</span>}
      </span>
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
}
