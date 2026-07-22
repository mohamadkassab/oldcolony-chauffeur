'use server';

import { revalidatePath } from 'next/cache';
import { requireClient } from '@/lib/auth-dal';
import { updateUserProfile } from '@/lib/repositories/users';
import {
  createAddress,
  setDefaultAddress,
  deleteAddress,
} from '@/lib/repositories/addresses';

export interface ProfileFormState {
  ok: boolean;
}

/** Save the signed-in client's editable profile fields (phone). */
export async function updateProfileAction(
  _prev: ProfileFormState | null,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireClient();

  const phone = String(formData.get('phone') ?? '').trim();
  await updateUserProfile(user.id, { phone: phone || null });

  revalidatePath('/account');
  return { ok: true };
}

/* ── Saved addresses (edit-flow: each mutation fires immediately) ─────────── */

export async function addAddressAction(formData: FormData) {
  const user = await requireClient();
  const address = String(formData.get('address') ?? '').trim();
  const label = String(formData.get('label') ?? '').trim();
  const makeDefault = formData.get('makeDefault') != null;
  if (address.length < 3) return;
  await createAddress(user.id, { address, label, makeDefault });
  revalidatePath('/account');
}

export async function setDefaultAddressAction(formData: FormData) {
  const user = await requireClient();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await setDefaultAddress(user.id, id);
  revalidatePath('/account');
}

export async function deleteAddressAction(formData: FormData) {
  const user = await requireClient();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await deleteAddress(user.id, id);
  revalidatePath('/account');
}
