'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Building, Clock, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function SystemSettingsPage() {
  const [formData, setFormData] = useState({
    pondokName: 'Pondok Pesantren Tahfizh Quran Al-Usymuni',
    bedtimeStart: '22:00',
    bedtimeEnd: '04:00',
    studyStart: '08:00',
    studyEnd: '11:30',
    ngajiStart: '18:00',
    ngajiEnd: '20:00',
    syncThresholdMinutes: 15,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const res = await fetchApi('/settings');
      if (res?.success && res?.data) {
        setFormData({
          pondokName: res.data.pondokName || 'Pondok Pesantren Tahfizh Quran Al-Usymuni',
          bedtimeStart: res.data.bedtimeStart || '22:00',
          bedtimeEnd: res.data.bedtimeEnd || '04:00',
          studyStart: res.data.studyStart || '08:00',
          studyEnd: res.data.studyEnd || '11:30',
          ngajiStart: res.data.ngajiStart || '18:00',
          ngajiEnd: res.data.ngajiEnd || '20:00',
          syncThresholdMinutes: res.data.syncThresholdMinutes || 15,
        });
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await fetchApi('/settings', {
      method: 'PUT',
      body: JSON.stringify(formData),
    });

    if (res?.success) {
      setMessage('Konfigurasi preset sistem berhasil diperbarui!');
    } else {
      setMessage('Preset tersimpan di tampilan lokal.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center space-x-2">
            <Settings className="w-6 h-6 text-emerald-500" />
            <span>Pengaturan Preset System</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Konfigurasi nama pondok pesantren, jadwal preset otomatis, dan ambang batas monitoring kepatuhan.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-6 rounded-2xl space-y-6">
        {/* Identitas Pondok */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center space-x-2 border-b border-border/50 pb-2">
            <Building className="w-4 h-4 text-emerald-500" />
            <span>Identitas Instansi / Pondok Pesantren</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold mb-1 text-foreground">Nama Pondok Pesantren</label>
            <input
              type="text"
              value={formData.pondokName}
              onChange={(e) => setFormData({ ...formData, pondokName: e.target.value })}
              required
              className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Preset Jadwal Otomatis */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center space-x-2 border-b border-border/50 pb-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Preset Jadwal Otomatis (Jam WIB)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Jam Tidur */}
            <div className="p-4 rounded-xl bg-accent/30 border border-border/40 space-y-2">
              <span className="text-xs font-bold text-emerald-500 uppercase block">Jam Tidur Santri</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground">Jam Mulai</label>
                  <input
                    type="text"
                    value={formData.bedtimeStart}
                    onChange={(e) => setFormData({ ...formData, bedtimeStart: e.target.value })}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Jam Selesai</label>
                  <input
                    type="text"
                    value={formData.bedtimeEnd}
                    onChange={(e) => setFormData({ ...formData, bedtimeEnd: e.target.value })}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Jam Belajar */}
            <div className="p-4 rounded-xl bg-accent/30 border border-border/40 space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase block">Jam Belajar Formal</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground">Jam Mulai</label>
                  <input
                    type="text"
                    value={formData.studyStart}
                    onChange={(e) => setFormData({ ...formData, studyStart: e.target.value })}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Jam Selesai</label>
                  <input
                    type="text"
                    value={formData.studyEnd}
                    onChange={(e) => setFormData({ ...formData, studyEnd: e.target.value })}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Jam Mengaji */}
            <div className="p-4 rounded-xl bg-accent/30 border border-border/40 space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase block">Jam Mengaji & Dzikir</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground">Jam Mulai</label>
                  <input
                    type="text"
                    value={formData.ngajiStart}
                    onChange={(e) => setFormData({ ...formData, ngajiStart: e.target.value })}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Jam Selesai</label>
                  <input
                    type="text"
                    value={formData.ngajiEnd}
                    onChange={(e) => setFormData({ ...formData, ngajiEnd: e.target.value })}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambang Batas Kepatuhan */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center space-x-2 border-b border-border/50 pb-2">
            <RefreshCw className="w-4 h-4 text-emerald-500" />
            <span>Ambang Batas Toleransi Sinkronisasi (Menit)</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold mb-1 text-foreground">
              Batas Maksimal Tanpa Heartbeat (Status berubah Kuning/Merah)
            </label>
            <input
              type="number"
              value={formData.syncThresholdMinutes}
              onChange={(e) => setFormData({ ...formData, syncThresholdMinutes: Number(e.target.value) })}
              className="w-full sm:w-48 p-2.5 rounded-xl bg-accent/40 border border-border text-xs sm:text-sm text-foreground"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Perangkat yang tidak mengirim data selama &gt;{formData.syncThresholdMinutes} menit akan ditandai sebagai Tidak Sinkron.
            </p>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition-colors touch-target shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Preset'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
