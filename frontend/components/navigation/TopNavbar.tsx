'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Settings } from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/donors', label: 'Donors' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/news', label: 'News' },
];

export default function TopNavBar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 py-3 w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tight text-rose-600">
          PMI Resource Manager
        </span>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors pb-2 ${
                  isActive
                    ? 'text-rose-600 border-b-2 border-rose-600'
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-rose-100 text-rose-700 px-4 py-2 rounded font-semibold text-sm hover:opacity-90 active:opacity-80 transition-all">
          Emergency Alert
        </button>
        <div className="flex items-center gap-1 text-gray-600">
          <button className="hover:bg-gray-50 p-2 rounded-full transition-colors">
            <Bell size={20} />
          </button>
          <button className="hover:bg-gray-50 p-2 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 rounded-full border border-gray-200 bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm ml-1">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
