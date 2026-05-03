'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Droplets,
  Users,
  Megaphone,
  Plus,
  HelpCircle,
  History,
  type LucideIcon,
} from 'lucide-react';

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const navItems: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Stock Summary' },
  { href: '/inventory', icon: Droplets, label: 'Blood Inventory' },
  { href: '/donors', icon: Users, label: 'Donor Database' },
  { href: '/broadcast', icon: Megaphone, label: 'Broadcast CMS' },
];

export default function SideNavBar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full flex-col pt-16 bg-gray-50 border-r border-gray-200 w-64 hidden lg:flex z-40">
      {/* Logo */}
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-600 flex items-center justify-center rounded">
          <Droplets size={20} className="text-white" />
        </div>
        <div>
          <div className="text-lg font-black text-rose-600 uppercase">
            Admin Panel
          </div>
          <div className="text-xs text-gray-500">Regional HQ</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 grow px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 transition-all text-sm ${
                isActive
                  ? 'bg-rose-50 text-rose-600 font-semibold border-r-4 border-rose-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:pl-4'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* New Donation CTA */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/donations/new">
          <button className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-rose-700 active:scale-95 transition-all">
            <Plus size={18} />
            New Donation
          </button>
        </Link>
      </div>

      {/* Footer links */}
      <footer className="p-4 space-y-2 mb-4">
        <Link
          href="/support"
          className="flex items-center gap-3 px-3 py-1.5 text-gray-500 hover:text-rose-600 text-xs"
        >
          <HelpCircle size={14} />
          Support
        </Link>
        <Link
          href="/logs"
          className="flex items-center gap-3 px-3 py-1.5 text-gray-500 hover:text-rose-600 text-xs"
        >
          <History size={14} />
          Logs
        </Link>
      </footer>
    </aside>
  );
}
