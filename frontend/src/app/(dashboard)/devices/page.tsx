'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Search, Plus, Battery, Wifi, CheckCircle2, AlertTriangle, XCircle, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

const fallbackDevices = [
  {
    id: 'dev-001',
    deviceName: 'Samsung Galaxy A54 5G',
    userName: 'Ahmad Fadhil',
    groupName: "Kamar As-Syafi'i",
    osType: 'ANDROID',
    osVersion: 'Android 14 (One UI 6.0)',
    isOnline: true,
    batteryLevel: 88,
    ramMb: 8192,
    storageMb: 256000,
    internetType: 'WIFI',
    lastSyncAt: 'Just now',
    monitoringActive: true,
    mdmStatus: 'DEVICE_OWNER',
    deviceHealth: 'GREEN',
  },
  {
    id: 'dev-002',
    deviceName: 'Redmi Note 12 Pro',
    userName: 'Muhammad Rizky',
    groupName: "Kamar As-Syafi'i",
    osType: 'ANDROID',
    osVersion: 'Android 13 (MIUI 14)',
    isOnline: true,
    batteryLevel: 42,
    ramMb: 6144,
    storageMb: 128000,
    internetType: 'WIFI',
    lastSyncAt: '5 min ago',
    monitoringActive: true,
    mdmStatus: 'ACCESSIBILITY_USAGE',
    deviceHealth: 'YELLOW',
  },
  {
    id: 'dev-003',
    deviceName: 'iPhone 13 Mini',
    userName: 'Umar Al-Faruq',
    groupName: 'Kamar Al-Ghazali',
    osType: 'IOS',
    osVersion: 'iOS 17.3',
    isOnline: true,
    batteryLevel: 95,
    ramMb: 4096,
    storageMb: 128000,
    internetType: 'CELLULAR',
    lastSyncAt: '2 min ago',
    monitoringActive: true,
    mdmStatus: 'APPLE_MDM',
    deviceHealth: 'GREEN',
  },
  {
    id: 'dev-004',
    deviceName: 'Oppo Reno 8 T',
    userName: 'Ali Zaineddin',
    groupName: 'Kamar Al-Ghazali',
    osType: 'ANDROID',
    osVersion: 'Android 13 (ColorOS 13)',
    isOnline: false,
    batteryLevel: 12,
    ramMb: 8192,
    storageMb: 256000,
    internetType: 'NONE',
    lastSyncAt: '2 hours ago',
    monitoringActive: false,
    mdmStatus: 'UNMANAGED',
    deviceHealth: 'RED',
  },
  {
    id: 'dev-005',
    deviceName: 'iPhone 12 Standard',
    userName: 'Fatimah Az-Zahra',
    groupName: 'Kamar An-Nisa 1',
    osType: 'IOS',
    osVersion: 'iOS 16.6',
    isOnline: true,
    batteryLevel: 75,
    ramMb: 4096,
    storageMb: 64000,
    internetType: 'WIFI',
    lastSyncAt: '1 min ago',
    monitoringActive: true,
    mdmStatus: 'APPLE_MDM',
    deviceHealth: 'GREEN',
  },
  {
    id: 'dev-006',
    deviceName: 'Vivo Y36 4G',
    userName: 'Siti Khadijah',
    groupName: 'Kamar An-Nisa 1',
    osType: 'ANDROID',
    osVersion: 'Android 13 (Funtouch 13)',
    isOnline: true,
    batteryLevel: 64,
    ramMb: 8192,
    storageMb: 128000,
    internetType: 'WIFI',
    lastSyncAt: '4 min ago',
    monitoringActive: true,
    mdmStatus: 'DEVICE_OWNER',
    deviceHealth: 'GREEN',
  },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState(fallbackDevices);
  const [search, setSearch] = useState('');
  const [osFilter, setOsFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    serialNumber: '',
    userName: 'Ahmad Fadhil',
    osType: 'ANDROID',
    osVersion: 'Android 14',
    mdmStatus: 'DEVICE_OWNER',
  });

  const loadDevices = async () => {
    const res = await fetchApi('/devices');
    if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
      const mappedLive = res.data.map((d: any) => ({
        id: d.id,
        deviceName: d.deviceName,
        userName: d.user?.fullName || 'Santri',
        groupName: d.user?.groupName || 'Pondok',
        osType: d.osType,
        osVersion: d.osVersion,
        isOnline: d.isOnline,
        batteryLevel: d.batteryLevel,
        ramMb: d.ramMb,
        storageMb: d.storageMb,
        internetType: d.internetType,
        lastSyncAt: new Date(d.lastSyncAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        monitoringActive: d.monitoringActive,
        mdmStatus: d.mdmStatus,
        deviceHealth: d.deviceHealth,
      }));
      setDevices(mappedLive);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.deviceName || !newDevice.serialNumber) return;

    const res = await fetchApi('/devices/register', {
      method: 'POST',
      body: JSON.stringify(newDevice),
    });

    if (res?.success) {
      setShowAddModal(false);
      loadDevices();
    } else {
      // Local fallback addition
      const mockDev = {
        id: `dev-${Date.now()}`,
        deviceName: newDevice.deviceName,
        userName: newDevice.userName,
        groupName: "Kamar As-Syafi'i",
        osType: newDevice.osType,
        osVersion: newDevice.osVersion,
        isOnline: true,
        batteryLevel: 100,
        ramMb: 8192,
        storageMb: 128000,
        internetType: 'WIFI',
        lastSyncAt: 'Baru saja',
        monitoringActive: true,
        mdmStatus: newDevice.mdmStatus,
        deviceHealth: 'GREEN',
      };
      setDevices([mockDev, ...devices]);
      setShowAddModal(false);
    }
  };

  const filteredDevices = devices.filter((dev) => {
    const matchSearch =
      dev.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      dev.userName.toLowerCase().includes(search.toLowerCase()) ||
      dev.groupName.toLowerCase().includes(search.toLowerCase());
    const matchOs = osFilter === 'ALL' || dev.osType === osFilter;
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ONLINE' && dev.isOnline) ||
      (statusFilter === 'OFFLINE' && !dev.isOnline);
    return matchSearch && matchOs && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">Daftar Perangkat Santri</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola dan monitor status teknis seluruh HP yang terdaftar di pondok.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors touch-target shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Device Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama santri, perangkat, atau kamar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-accent/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={osFilter}
            onChange={(e) => setOsFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-accent/40 border border-border text-xs font-semibold text-foreground focus:outline-none touch-target"
          >
            <option value="ALL">Semua OS</option>
            <option value="ANDROID">Android</option>
            <option value="IOS">iPhone (iOS)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-accent/40 border border-border text-xs font-semibold text-foreground focus:outline-none touch-target"
          >
            <option value="ALL">Semua Status</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      {/* Devices List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((dev) => (
          <div key={dev.id} className="glass-card p-4 rounded-2xl space-y-3 relative hover:border-emerald-500/40 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-emerald-500 transition-colors">
                    {dev.deviceName}
                  </h3>
                  <p className="text-xs text-muted-foreground">{dev.userName} • {dev.groupName}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  dev.isOnline
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                    : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                }`}
              >
                {dev.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/40">
              <div>
                <span className="text-[10px] text-muted-foreground block">Sistem Operasi</span>
                <span className="font-semibold text-foreground">{dev.osType} ({dev.osVersion.split(' ')[0]})</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Status MDM</span>
                <span className="font-semibold text-emerald-400 truncate block">{dev.mdmStatus}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Baterai</span>
                <div className="flex items-center space-x-1 font-semibold text-foreground">
                  <Battery className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{dev.batteryLevel}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Terakhir Sync</span>
                <span className="font-semibold text-muted-foreground">{dev.lastSyncAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1.5">
                {dev.deviceHealth === 'GREEN' && (
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Normal</span>
                  </span>
                )}
                {dev.deviceHealth === 'YELLOW' && (
                  <span className="flex items-center space-x-1 text-[11px] text-amber-500 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Perlu Perhatian</span>
                  </span>
                )}
                {dev.deviceHealth === 'RED' && (
                  <span className="flex items-center space-x-1 text-[11px] text-rose-500 font-semibold">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Kritis / Offline</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                <Link
                  href={`/devices/${dev.id}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center space-x-1 transition-colors touch-target"
                >
                  <span>Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {dev.osType === 'IOS' && (
                  <a
                    href="http://localhost:4000/devices/1/apple-mdm-profile"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 text-xs font-semibold flex items-center space-x-1 transition-colors touch-target"
                    title="Unduh berkas .mobileconfig untuk dikirim via WhatsApp/Email"
                  >
                    <span>Unduh iOS .mobileconfig</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegisterDevice} className="glass-card p-6 rounded-2xl max-w-md w-full space-y-4 bg-card border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">Pendaftaran Perangkat Baru</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Perangkat HP</label>
                <input
                  type="text"
                  placeholder="Misal: Samsung Galaxy A55"
                  value={newDevice.deviceName}
                  onChange={(e) => setNewDevice({ ...newDevice, deviceName: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomor Seri / Device ID</label>
                <input
                  type="text"
                  placeholder="Misal: SN-SAMSUNG-A55-007"
                  value={newDevice.serialNumber}
                  onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Tipe OS</label>
                  <select
                    value={newDevice.osType}
                    onChange={(e) => setNewDevice({ ...newDevice, osType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  >
                    <option value="ANDROID">Android</option>
                    <option value="IOS">iPhone (iOS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Status MDM</label>
                  <select
                    value={newDevice.mdmStatus}
                    onChange={(e) => setNewDevice({ ...newDevice, mdmStatus: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  >
                    <option value="DEVICE_OWNER">Android Device Owner</option>
                    <option value="ACCESSIBILITY_USAGE">Usage Access</option>
                    <option value="APPLE_MDM">Apple MDM Supervised</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-accent text-foreground text-xs font-semibold">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold">
                Daftarkan HP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
