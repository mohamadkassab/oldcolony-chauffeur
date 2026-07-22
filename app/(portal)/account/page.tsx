import { getCurrentUser } from '@/lib/auth-dal';
import { getUserById } from '@/lib/repositories/users';
import { listAddresses } from '@/lib/repositories/addresses';
import { PageHeading } from '@/components/ui/PageHeading';
import { Card } from '@/components/ui/Card';
import { ProfileForm } from './_components/ProfileForm';
import { AddressManager } from './_components/AddressManager';

export default async function AccountHomePage() {
  const sessionUser = await getCurrentUser();
  const user = sessionUser ? await getUserById(sessionUser.id) : null;
  const addresses = sessionUser ? await listAddresses(sessionUser.id) : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PageHeading eyebrow="My Account" title={`Hi, ${user?.name?.split(' ')[0] ?? 'there'}`} />

      {/* Profile card */}
      <Card padding="md" className="mt-8">
        <h2 className="type-subheading text-brand-dark">Profile</h2>

        {/* Identity — sourced from Google, read-only */}
        <dl className="mt-4 space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="type-body-sm text-gray-500">Name</dt>
            <dd className="type-body-sm font-medium text-brand-dark">{user?.name ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="type-body-sm text-gray-500">
              Email <span className="text-gray-400">(from Google)</span>
            </dt>
            <dd className="type-body-sm font-medium text-brand-dark">{user?.email}</dd>
          </div>
        </dl>

        {/* Editable contact details */}
        <div className="mt-6 border-t border-brand-border pt-6">
          <h3 className="type-body-sm font-semibold text-brand-dark">Contact details</h3>
          <p className="type-caption mt-1 text-gray-500">
            We use these to reach you about your rides and to speed up booking.
          </p>
          <ProfileForm phone={user?.phone ?? ''} />
        </div>
      </Card>

      {/* Saved addresses */}
      <Card padding="md" className="mt-6">
        <h2 className="type-subheading text-brand-dark">Saved addresses</h2>
        <p className="type-caption mt-1 text-gray-500">
          Save the places you travel to often. Your default appears first when you book a ride.
        </p>
        <div className="mt-4">
          <AddressManager
            addresses={addresses.map((a) => ({
              id: a.id,
              label: a.label,
              address: a.address,
              isDefault: a.isDefault,
            }))}
          />
        </div>
      </Card>
    </main>
  );
}
