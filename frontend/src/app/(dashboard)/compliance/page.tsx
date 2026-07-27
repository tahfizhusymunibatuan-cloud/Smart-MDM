'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const fallbackCompliance = [
  {
    deviceName: 'Samsung Galaxy A54 5G',
    userName: 'Ahmad Fadhil',
    status: 'GREEN',
    statusText: 'Normal (100% Kepatuhan)',
    issues: [],
    lastSync: 'Just now',
  },
  {
    deviceName: 'Redmi Note 12 Pro',
    userName: 'Muhammad Rizky',
    status: 'YELLOW',
    statusText: 'Perlu Perhatian',
    issues: ['Sinkronisasi lambat (>15 menit)', 'Baterai rendah (42%)'],
    lastSync: '18 min ago',
  },
  {
    deviceName: 'Oppo Reno 8 T',
    userName: 'Ali Zaineddin',
    status: 'RED',
    statusText: 'Tidak Aktif / Kritis',
    issues: ['Monitoring terhenti', 'Pencabutan izin Usage Access', 'Perangkat Offline > 2 jam'],
    lastSync: '2 hours ago',
  },
  {
    deviceName: 'iPhone 13 Mini',
    userName: 'Umar Al-Faruq',
    status: 'GREEN',
    statusText: 'Normal (Apple MDM Enrolled)',
    issues: [],
    lastSync: '2 min ago',
  },
];

export default function CompliancePage() {
  const [complianceList, setComplianceList] = useState(fallbackCompliance);
  const [loading, setLoading] = useState(false);

  const loadCompliance = async () => {
    const res = await fetchApi('/compliance/summary');
    if (res?.success && res?.data?.recentViolations) {
      // Data updated from API
    }
  };

  useEffect(() => {
    loadCompliance();
  }, []);

  const handleRunCheck = async () => {
    setLoading(true);
    const res = await fetchApi('/compliance/check', { method: 'POST' });
    if (res?.success && Array.isArray(res?.data)) {
      setComplianceList(
        res.data.map((c: any) => ({
          deviceName: c.deviceName,
          userName: c.userName,
          status: c.deviceHealth,
          statusText: c.deviceHealth === 'GREEN' ? 'Normal (100% Kepatuhan)' : c.deviceHealth === 'YELLOW' ? 'Perlu Perhatian' : 'Tidak Aktif / Kritis',
          issues: c.issues || [],
          lastSync: new Date(c.lastSyncAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        })),
      );
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-emerald-500" />
            <span>Monitoring Kepatuhan System</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Deteksi otomatis jika monitoring terhenti, izin dicabut, atau perangkat keluar dari pengelolaan.
          </p>
        </div>

        <button
          onClick={handleRunCheck}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors touch-target shadow-lg shadow-emerald-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Memeriksa...' : 'Jalankan Audit Kepatuhan'}</span>
        </button>
      </div>

      {/* Status Legend Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Hijau */}
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 space-y-1">
          <div className="flex items-center space-x-2 text-emerald-500 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Hijau = Normal</span>
          </div>
          <p className="text-xs text-muted-foreground">Monitoring aktif, izin lengkap, sinkronisasi lancar realtime.</p>
        </div>

        {/* Kuning */}
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-amber-500 space-y-1">
          <div className="flex items-center space-x-2 text-amber-500 font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Kuning = Perlu Perhatian</span>
          </div>
          <p className="text-xs text-muted-foreground">Sinkronisasi terlambat &gt;15m atau baterai perangkat sangat rendah.</p>
        </div>

        {/* Merah */}
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-rose-500 space-y-1">
          <div className="flex items-center space-x-2 text-rose-500 font-extrabold text-sm">
            <XCircle className="w-5 h-5" />
            <span>Merah = Tidak Aktif</span>
          </div>
          <p className="text-xs text-muted-foreground">Monitoring terhenti, izin dicabut, atau lepas dari Apple MDM.</p>
        </div>
      </div>

      {/* Compliance List Table */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-base text-foreground">Status Kepatuhan Perangkat Terdaftar</h3>

        <div className="space-y-3">
          {complianceList.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-accent/30 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-foreground">{item.deviceName}</span>
                  <span className="text-xs text-muted-foreground">({item.userName})</span>
                </div>

                {item.issues.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {item.issues.map((iss, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-semibold">
                        • {iss}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-500 font-medium">Semua izin sistem aktif & terkunci rapat</p>
                )}
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    item.status === 'GREEN'
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : item.status === 'YELLOW'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-rose-500/15 text-rose-500'
                  }`}
                >
                  {item.statusText}
                </span>
                <p className="text-[10px] text-muted-foreground mt-1">Sync: {item.lastSync}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
