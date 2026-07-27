'use client';

import React, { useState } from 'react';
import { BellRing, Search, Filter, Calendar, User, Smartphone, Clock } from 'lucide-react';

const mockAuditLogs = [
  { date: '26 Juli 2026', time: '23.05 WIB', user: 'System Telemetry', device: 'Oppo Reno 8 T', action: 'Sinkronisasi gagal (Offline)', type: 'WARNING' },
  { date: '26 Juli 2026', time: '22.32 WIB', user: 'System Service', device: 'Samsung Galaxy A54', action: 'Monitoring aktif kembali', type: 'SUCCESS' },
  { date: '26 Juli 2026', time: '22.30 WIB', user: 'Muhammad Rizky', device: 'Redmi Note 12 Pro', action: 'Monitoring terhenti / izin dicabut', type: 'DANGER' },
  { date: '26 Juli 2026', time: '22.10 WIB', user: 'Khairol Anam (Super Admin)', device: 'All Devices', action: 'Policy diperbarui: Jam Tidur Santri', type: 'INFO' },
  { date: '26 Juli 2026', time: '21.00 WIB', user: 'Ust. H. Ridwan', device: 'iPhone 13 Mini', action: 'Perintah Kunci HP dikirim via APNs MDM', type: 'INFO' },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');

  const filteredLogs = mockAuditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.device.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">Audit Log System</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Catatan aktivitas penting administrator, perubahan kebijakan, dan insiden sistem.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari audit log berdasarkan User, Device, Tanggal, atau Jenis Aktivitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-accent/40 border border-border text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] font-semibold">
                <th className="pb-3">Tanggal & Waktu</th>
                <th className="pb-3">Aktor / User</th>
                <th className="pb-3">Perangkat Target</th>
                <th className="pb-3">Aktivitas / Event</th>
                <th className="pb-3 text-right">Status Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 font-semibold text-foreground">
                    <div>{log.date}</div>
                    <span className="text-[10px] text-muted-foreground">{log.time}</span>
                  </td>
                  <td className="py-3 font-bold text-foreground">{log.user}</td>
                  <td className="py-3 text-muted-foreground">{log.device}</td>
                  <td className="py-3 font-semibold text-foreground">{log.action}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        log.type === 'SUCCESS'
                          ? 'bg-emerald-500/15 text-emerald-500'
                          : log.type === 'DANGER'
                          ? 'bg-rose-500/15 text-rose-500'
                          : log.type === 'WARNING'
                          ? 'bg-amber-500/15 text-amber-500'
                          : 'bg-indigo-500/15 text-indigo-400'
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
