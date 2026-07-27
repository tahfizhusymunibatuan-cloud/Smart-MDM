'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  User,
  Battery,
  Wifi,
  HardDrive,
  Cpu,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Lock,
  RefreshCcw,
} from 'lucide-react';
import Link from 'next/link';

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPS' | 'HISTORY'>('OVERVIEW');

  // Device Detail Data
  const device = {
    id: params.id || 'dev-001',
    deviceName: 'Samsung Galaxy A54 5G',
    userName: 'Ahmad Fadhil',
    userGroup: "Kamar As-Syafi'i",
    userRole: 'SANTRI',
    osType: 'ANDROID',
    osVersion: 'Android 14 (One UI 6.0)',
    serialNumber: 'SN-SAMSUNG-A54-001',
    isOnline: true,
    batteryLevel: 88,
    ramMb: 8192,
    ramUsedMb: 4200,
    storageMb: 256000,
    storageUsedMb: 94000,
    internetType: 'Wi-Fi (Pondok_DarulUlum_5G)',
    lastSyncAt: '26 Juli 2026, 22.10 WIB',
    monitoringActive: true,
    mdmStatus: 'DEVICE_OWNER (Android Enterprise)',
    deviceHealth: 'GREEN',
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center space-x-3">
        <Link
          href="/devices"
          className="p-2 rounded-xl bg-accent/40 text-foreground hover:bg-accent transition-colors touch-target flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">{device.deviceName}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pengguna: <strong className="text-foreground">{device.userName}</strong> ({device.userGroup})
          </p>
        </div>
      </div>

      {/* Primary Card: Quick Info Banner */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-emerald-500">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold text-xl">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-foreground">{device.deviceName}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold uppercase">
                {device.osType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">No. Seri: {device.serialNumber}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-emerald-500 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Monitoring Aktif</span>
              </span>
              <span className="text-xs text-muted-foreground">• Mode: {device.mdmStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 hover:bg-emerald-600 transition-colors touch-target">
            <RefreshCcw className="w-4 h-4" />
            <span>Sync Sekarang</span>
          </button>
          <button className="px-3 py-2 rounded-xl bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border border-rose-500/20 font-semibold text-xs flex items-center space-x-1.5 transition-colors touch-target">
            <Lock className="w-4 h-4" />
            <span>Kunci HP</span>
          </button>
        </div>
      </div>

      {/* Grid Specifications */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Status Online */}
        <div className="glass-card p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Status Online</span>
          <p className="text-sm font-extrabold text-emerald-500 flex items-center space-x-1">
            <Wifi className="w-4 h-4" />
            <span>Online</span>
          </p>
        </div>

        {/* Battery */}
        <div className="glass-card p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Baterai</span>
          <p className="text-sm font-extrabold text-foreground flex items-center space-x-1">
            <Battery className="w-4 h-4 text-emerald-500" />
            <span>{device.batteryLevel}%</span>
          </p>
        </div>

        {/* Internet */}
        <div className="glass-card p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Jaringan Internet</span>
          <p className="text-xs font-bold text-foreground truncate">{device.internetType}</p>
        </div>

        {/* Storage */}
        <div className="glass-card p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Penyimpanan</span>
          <p className="text-xs font-bold text-foreground flex items-center space-x-1">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>94 GB / 256 GB</span>
          </p>
        </div>

        {/* RAM */}
        <div className="glass-card p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">RAM</span>
          <p className="text-xs font-bold text-foreground flex items-center space-x-1">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>4.2 GB / 8 GB</span>
          </p>
        </div>

        {/* Last Sync */}
        <div className="glass-card p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Terakhir Sync</span>
          <p className="text-xs font-bold text-muted-foreground flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>22.10 WIB</span>
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border space-x-4">
        {(['OVERVIEW', 'APPS', 'HISTORY'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 touch-target ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'OVERVIEW' && 'Ringkasan Telemetri'}
            {tab === 'APPS' && 'Aplikasi Terinstall (Usage)'}
            {tab === 'HISTORY' && 'Riwayat Pelanggaran'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span>Profil Santri & Pemilik</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Nama Lengkap</span>
                <span className="font-semibold text-foreground">{device.userName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Kamar / Kelompok</span>
                <span className="font-semibold text-foreground">{device.userGroup}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Peran Hak Akses</span>
                <span className="font-semibold text-emerald-400">{device.userRole}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Status Lisensi & Kebijakan MDM</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Status Kebijakan MDM</span>
                <span className="font-semibold text-emerald-400">{device.mdmStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Penguncian Jam Tidur</span>
                <span className="font-semibold text-emerald-500">AKTIF (22.00 - 04.00)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Pencegahan Cabut Izin</span>
                <span className="font-semibold text-emerald-500">DIPROTEKSI (Device Owner)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'APPS' && (
        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h3 className="font-bold text-sm text-foreground">Aplikasi Dipakai Hari Ini</h3>
          <div className="space-y-2">
            {[
              { app: 'YouTube', duration: '2j 45m', status: 'Dibatasi (Jam Tidur)' },
              { app: 'TikTok', duration: '1j 30m', status: 'Dibatasi (Jam Tidur)' },
              { app: 'WhatsApp', duration: '1j 15m', status: 'Diizinkan' },
              { app: 'Google Chrome', duration: '45m', status: 'Diizinkan' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-accent/30 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground">{item.app}</p>
                  <p className="text-[10px] text-muted-foreground">Durasi: {item.duration}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-semibold text-[10px]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="glass-card p-4 rounded-2xl space-y-3">
          <h3 className="font-bold text-sm text-foreground">Log Insiden & Pelanggaran Perangkat</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-foreground">Deteksi Penggunaan Malam Hari (Begadang)</p>
                <p className="text-muted-foreground text-[11px]">25 Juli 2026, 00.42 WIB - Perangkat aktif membuka YouTube saat Jam Tidur.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
