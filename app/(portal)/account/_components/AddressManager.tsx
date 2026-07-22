'use client';

import { useState } from 'react';
import { Star, MapPin, Plus } from 'lucide-react';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { TextInput, FieldLabel } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { ConfirmSubmit } from '../../_components/ConfirmSubmit';
import {
  addAddressAction,
  setDefaultAddressAction,
  deleteAddressAction,
} from '../actions';

export interface SavedAddressItem {
  id: string;
  label: string | null;
  address: string;
  isDefault: boolean;
}

const DELETE_BTN = buttonVariants({
  variant: 'ghost',
  size: 'sm',
  className: 'text-red-500 hover:bg-red-50',
});

/** Manage saved addresses: list, set default, delete, add. Edit-flow — every
 *  mutation fires an immediate server action (no batching). */
export function AddressManager({ addresses }: { addresses: SavedAddressItem[] }) {
  const [address, setAddress] = useState('');
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-3">
      {addresses.length > 0 && (
        <ul className="space-y-2">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-white px-3 py-2.5"
            >
              {a.isDefault ? (
                <Star size={15} className="flex-shrink-0 fill-brand-magenta text-brand-magenta" />
              ) : (
                <MapPin size={15} className="flex-shrink-0 text-gray-300" />
              )}
              <div className="min-w-0 flex-1">
                {a.label && <p className="type-body-sm font-medium text-brand-dark">{a.label}</p>}
                <p className="truncate type-body-sm text-gray-600">{a.address}</p>
              </div>
              {a.isDefault ? (
                <span className="flex-shrink-0 rounded-full bg-brand-light px-2.5 py-0.5 type-badge font-semibold text-brand-magenta">
                  Default
                </span>
              ) : (
                <form action={setDefaultAddressAction} className="flex-shrink-0">
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    type="submit"
                    className="type-caption font-medium text-gray-400 transition-colors hover:text-brand-magenta cursor-pointer"
                  >
                    Set default
                  </button>
                </form>
              )}
              <ConfirmSubmit
                action={deleteAddressAction}
                id={a.id}
                title="Delete this address?"
                message={`"${a.address}" will be removed from your saved addresses.`}
                confirmLabel="Delete"
                triggerClassName={DELETE_BTN}
              >
                Remove
              </ConfirmSubmit>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form
          action={async (fd) => {
            await addAddressAction(fd);
            setAddress('');
            setAdding(false);
          }}
          className="space-y-3 rounded-xl border border-brand-border bg-brand-blush p-3"
        >
          <div>
            <FieldLabel label="Address" />
            <AddressAutocomplete
              name="address"
              placeholder="Start typing an address…"
              value={address}
              onChange={setAddress}
            />
          </div>
          <div>
            <FieldLabel label="Label" optional />
            <TextInput name="label" placeholder="Home, Office…" />
          </div>
          <label className="flex items-center gap-2 type-body-sm text-gray-600">
            <input type="checkbox" name="makeDefault" className="accent-brand-magenta" />
            Set as default
          </label>
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={address.trim().length < 3}>
              Save address
            </Button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setAddress('');
              }}
              className="type-caption font-medium text-gray-400 transition-colors hover:text-gray-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <Plus size={14} /> Add address
        </button>
      )}
    </div>
  );
}
