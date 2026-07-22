import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Role } from '@prisma/client';
import { listUsersPaginated } from '@/lib/repositories/users';
import { PageHeading } from '@/components/ui/PageHeading';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

const PAGE_SIZE = 10;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { users, total } = await listUsersPaginated({ page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeading
        eyebrow="Admin"
        title="Users"
        sub="Everyone who has signed in. Click a name to view their profile and rides."
      />

      {users.length === 0 ? (
        <EmptyState className="mt-8" message="No users yet." />
      ) : (
        <Card padding="none" className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-border bg-brand-light/50">
                  <th className="px-4 py-3 type-caption font-semibold text-gray-500">Name</th>
                  <th className="px-4 py-3 type-caption font-semibold text-gray-500">Email</th>
                  <th className="px-4 py-3 type-caption font-semibold text-gray-500">Phone</th>
                  <th className="px-4 py-3 type-caption font-semibold text-gray-500">Default address</th>
                  <th className="px-4 py-3 type-caption font-semibold text-gray-500">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-brand-border last:border-0 hover:bg-brand-light/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="type-body-sm font-medium text-brand-magenta hover:underline"
                      >
                        {u.name ?? '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-3 type-body-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 type-body-sm text-gray-600">{u.phone ?? '—'}</td>
                    <td className="px-4 py-3 type-body-sm text-gray-600">
                      <span className="block max-w-[16rem] truncate">{u.defaultAddress ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 type-badge font-semibold ${
                          u.role === Role.ADMIN
                            ? 'bg-brand-magenta/10 text-brand-magenta'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="type-body-sm text-gray-500">
            Showing {from}–{to} of {total}
          </p>
          <div className="flex items-center gap-2">
            <PageLink page={page - 1} disabled={page <= 1} label="Previous">
              <ChevronLeft size={16} />
            </PageLink>
            <span className="type-body-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <PageLink page={page + 1} disabled={page >= totalPages} label="Next">
              <ChevronRight size={16} />
            </PageLink>
          </div>
        </div>
      )}
    </main>
  );
}

function PageLink({
  page,
  disabled,
  label,
  children,
}: {
  page: number;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-gray-300"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={`/admin/users?page=${page}`}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-gray-600 transition-colors hover:border-brand-magenta hover:text-brand-magenta"
    >
      {children}
    </Link>
  );
}
