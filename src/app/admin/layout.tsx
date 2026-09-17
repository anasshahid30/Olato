import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F7F7FA]">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-x-auto">{children}</div>
    </div>
  );
}
