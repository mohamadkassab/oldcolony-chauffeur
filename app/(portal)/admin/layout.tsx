import { requireAdmin } from '@/lib/auth-dal';
import { Navbar } from '@/components/layout/Navbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* Offset for the fixed navbar */}
      <div className="flex-grow pt-16">{children}</div>
    </div>
  );
}
