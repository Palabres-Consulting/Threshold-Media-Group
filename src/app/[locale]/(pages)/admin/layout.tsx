// app/admin/layout.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 text-foreground overflow-hidden">
      {/* Global Admin Navigation */}
      <AdminSidebar />

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}