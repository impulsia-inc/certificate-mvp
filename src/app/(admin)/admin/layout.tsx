import { redirect } from 'next/navigation';
import { getSessionAction } from '@/lib/auth/actions';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionAction();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row">
      <AdminSidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader user={session} />
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
