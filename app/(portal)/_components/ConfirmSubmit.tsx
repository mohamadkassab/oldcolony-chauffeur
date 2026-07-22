'use client';
import { useState } from 'react';

interface ConfirmSubmitProps {
  /** The server action to run on confirm. */
  action: (formData: FormData) => void | Promise<void>;
  /** Booking/post id passed through to the action. */
  id: string;
  /** Trigger button label/content. */
  children: React.ReactNode;
  triggerClassName: string;
  title: string;
  message: string;
  confirmLabel: string;
}

export function ConfirmSubmit({
  action,
  id,
  children,
  triggerClassName,
  title,
  message,
  confirmLabel,
}: ConfirmSubmitProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-white p-6 shadow-xl">
            <h2 className="type-subheading font-semibold text-brand-dark">{title}</h2>
            <p className="type-body-sm mt-2 text-gray-500">{message}</p>

            {/* Close the modal *after* the action resolves — never in the submit
                button's onClick. Closing on click unmounts this <form> before React
                dispatches the server action, which aborts it ("form is not connected")
                and the delete/cancel silently never runs. */}
            <form
              action={async (formData) => {
                await action(formData);
                setOpen(false);
              }}
              className="mt-6 flex justify-end gap-2"
            >
              <input type="hidden" name="id" value={id} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-brand-border px-4 py-2 type-cta font-semibold text-gray-600 transition-colors hover:bg-brand-light cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-red-500 px-4 py-2 type-cta font-semibold text-white transition-colors hover:bg-red-600 cursor-pointer"
              >
                {confirmLabel}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
