import React from 'react';
import Link from 'next/link';

const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Blood Donation Centers', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-12 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-t border-gray-200">
      <p className="text-xs text-gray-500 font-sans">
        © {new Date().getFullYear()} Palang Merah Indonesia. All Rights
        Reserved.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs text-gray-500 hover:text-rose-600 underline underline-offset-4 opacity-90 hover:opacity-100 transition-all font-sans"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
};
