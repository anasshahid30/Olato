'use client';

import React from 'react';
import { Users, Shield, GraduationCap } from 'lucide-react';

export default function AdminUsersPage() {
  const users = [
    { id: 'usr-1', name: 'Hamza Malik', email: 'hamza@example.com', role: 'USER', student: true, saved: 2 },
    { id: 'usr-2', name: 'Ayesha Khan', email: 'ayesha@example.com', role: 'USER', student: false, saved: 5 },
    { id: 'usr-3', name: 'Olato Merchant Admin', email: 'admin@olato.com', role: 'ADMIN', student: false, saved: 8 },
  ];

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-3xl font-bold text-[#15151A]">User Accounts & Roles</h1>
        <p className="text-sm text-[#6F7078] mt-0.5">
          Overview of registered discovery members, student verifications, and admin credentials
        </p>
      </div>

      <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E7E7EC] text-xs font-bold text-[#6F7078] uppercase tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Student Verification</th>
                <th className="py-3 px-4">Saved Deals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7EC]/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F7F7FA]">
                  <td className="py-4 px-4 font-bold text-[#15151A]">{u.name}</td>
                  <td className="py-4 px-4 text-xs text-[#6F7078]">{u.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-[#EEF0FF] text-[#5B5CE2]' : 'bg-[#F7F7FA] text-[#15151A]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-[#19B87A] font-semibold">
                    {u.student ? '✓ Verified Student' : '-'}
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-[#15151A]">{u.saved} deals</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
