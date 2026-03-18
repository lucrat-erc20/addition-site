// app/components/ui/SideCard.tsx

'use client';

interface Link {
  label: string;
  href: string;
}

interface SideCardProps {
  title: string;
  links: Link[];
}

export default function SideCard({ title, links }: SideCardProps) {
  return (
    <div
      className="rounded-2xl border border-gray-700 bg-gray-900/60 backdrop-blur-sm p-5"
      style={{ width: '220px' }}
    >
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        {title}
      </h2>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="block bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-3 py-3 text-sm text-gray-300 hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
