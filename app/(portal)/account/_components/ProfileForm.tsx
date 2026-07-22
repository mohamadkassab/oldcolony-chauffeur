'use client';

import { useActionState } from 'react';
import { Phone, Check } from 'lucide-react';
import { updateProfileAction } from '../actions';
import { TextInput, FieldLabel } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

/** Editable client profile fields. Identity (name/email) stays read-only above;
 *  saved addresses are managed separately in <AddressManager>. */
export function ProfileForm({ phone }: { phone: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, null);

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <FieldLabel label="Phone number" optional />
        <TextInput
          name="phone"
          type="tel"
          defaultValue={phone}
          icon={<Phone size={15} />}
          placeholder="(781) 234-5451"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" size="sm" loading={pending}>
          Save changes
        </Button>
        {state?.ok && !pending && (
          <span className="flex items-center gap-1 type-body-sm font-medium text-green-600">
            <Check size={14} /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
