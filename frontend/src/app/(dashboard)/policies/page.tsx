'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Clock, Users, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const initialPolicies = [
  {
    id: 'pol-001',
    title: 'Jam Tidur Santri',
    policyType: 'BEDTIME',
    startTime: '22:00',
    endTime: '04:00',
    targetType: 'Semua Santri (All)',
    restrictedApps: ['TikTok', 'Instagram', 'YouTube', 'Mobile Legends'],
    isEnabled: true,
  },
  {
    id: 'pol-002',
    title: 'Jam Belajar Formal Sekolah',
    policyType: 'STUDY',
    startTime: '08:00',
    endTime: '11:30',
    targetType: 'Semua Santri (All)',
    restrictedApps: ['Mobile Legends', 'TikTok', 'Free Fire'],
    isEnabled: true,
  },
  {
    id: 'pol-003',
    title: 'Jam Mengaji & Dzikir Malam',
    policyType: 'NGAJI',
    startTime: '18:00',
    endTime: '20:00',
    targetType: 'Semua Santri (All)',
    restrictedApps: ['Semua Aplikasi Hiburan'],
    isEnabled: true,
  },
];

export default function PolicyEnginePage() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    policyType: 'CUSTOM',
    startTime: '12:00',
    endTime: '13:30',
    targetType: 'Semua Santri (All)',
    apps: 'TikTok, Instagram, Game',
  });

  const loadPolicies = async () => {
    const res = await fetchApi('/policies');
    if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
      setPolicies(
        res.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          policyType: p.policyType,
          startTime: p.startTime,
          endTime: p.endTime,
          targetType: p.targetType === 'ALL' ? 'Semua Santri (All)' : p.targetType,
          restrictedApps: p.restrictions?.map((r: any) => r.appName) || ['App Restrict'],
          isEnabled: p.isEnabled,
        })),
      );
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const togglePolicy = async (id: string) => {
    const current = policies.find((p) => p.id === id);
    if (!current) return;

    const newStatus = !current.isEnabled;
    setPolicies(policies.map((p) => (p.id === id ? { ...p, isEnabled: newStatus } : p)));

    await fetchApi(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isEnabled: newStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    setPolicies(policies.filter((p) => p.id !== id));
    await fetchApi(`/policies/${id}`, { method: 'DELETE' });
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const appsList = formData.apps.split(',').map((a) => a.trim()).filter(Boolean);

    const payload = {
      title: formData.title,
      policyType: formData.policyType,
      startTime: formData.startTime,
      endTime: formData.endTime,
      targetType: 'ALL',
      restrictions: appsList.map((app) => ({ appName: app, packageName: `com.app.${app.toLowerCase()}` })),
    };

    const res = await fetchApi('/policies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res?.success) {
      setShowModal(false);
      loadPolicies();
    } else {
      const mockNew = {
        id: `pol-${Date.now()}`,
        title: formData.title,
        policyType: formData.policyType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        targetType: formData.targetType,
        restrictedApps: appsList,
        isEnabled: true,
      };
      setPolicies([mockNew, ...policies]);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Policy Engine & Pembatasan Aplikasi</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Atur aturan jam tidur, jam belajar, jam mengaji, dan pembatasan aplikasi secara resmi via Android Enterprise & Apple MDM.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors touch-target shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Policy Baru</span>
        </button>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {policies.map((pol) => (
          <div key={pol.id} className="glass-card p-5 rounded-2xl space-y-4 relative border-l-4 border-l-emerald-500">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 uppercase">
                  {pol.policyType}
                </span>
                <h3 className="font-bold text-base text-foreground mt-1">{pol.title}</h3>
              </div>

              <div className="flex items-center space-x-1">
                <button onClick={() => togglePolicy(pol.id)} className="text-emerald-500 touch-target">
                  {pol.isEnabled ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
                </button>
                <button onClick={() => handleDelete(pol.id)} className="text-muted-foreground hover:text-rose-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Waktu Aktif: <strong className="text-foreground">{pol.startTime} - {pol.endTime} WIB</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Target: <strong className="text-foreground">{pol.targetType}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground block">Aplikasi Dibatasi:</span>
              <div className="flex flex-wrap gap-1.5">
                {pol.restrictedApps.map((app, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-lg bg-accent border border-border text-foreground font-medium">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat Policy */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreatePolicy} className="glass-card p-6 rounded-2xl max-w-md w-full space-y-4 bg-card border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">Buat Kebijakan Policy Baru</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Kebijakan (Policy)</label>
                <input
                  type="text"
                  placeholder="Misal: Jam Khusus Istirahat Siang"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Jam Mulai (WIB)</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jam Selesai (WIB)</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Aplikasi Yang Dibatasi (Pisahkan Koma)</label>
                <input
                  type="text"
                  value={formData.apps}
                  onChange={(e) => setFormData({ ...formData, apps: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-accent text-foreground text-xs font-semibold">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold">
                Simpan Policy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
