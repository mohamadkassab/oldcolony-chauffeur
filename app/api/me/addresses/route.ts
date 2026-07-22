import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-dal';
import { listAddresses } from '@/lib/repositories/addresses';

// The booking form (public) calls this to offer the signed-in user's saved
// addresses. Guests get an empty list.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ addresses: [] });

  const addresses = await listAddresses(user.id);
  return NextResponse.json({
    addresses: addresses.map((a) => ({
      label: a.label,
      address: a.address,
      isDefault: a.isDefault,
    })),
  });
}
