import SideNavBar from '@/components/navigation/Sidenavbar';
import TopNavBar from '@/components/navigation/TopNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopNavBar />
      <div className="flex">
        <SideNavBar />
        {children}
      </div>
    </div>
  );
}
