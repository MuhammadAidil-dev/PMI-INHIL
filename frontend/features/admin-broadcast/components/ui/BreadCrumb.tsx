import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-2">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight size={12} className="text-gray-400" />}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-rose-600 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-rose-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
