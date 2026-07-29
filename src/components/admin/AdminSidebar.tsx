// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Mail, Shield } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Analytics",
      href: "/admin",
      icon: BarChart3,
      exact: true,
    },
    {
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      exact: false,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col shrink-0 select-none">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="font-semibold text-base text-gray-900 dark:text-zinc-100">
          Admin Console
        </h2>
      </div>

      {/* Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}