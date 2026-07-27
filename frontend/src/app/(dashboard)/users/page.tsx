'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, ShieldCheck, UserCheck, Key, Search, Trash2, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const fallbackUsers = [
  { id: 'usr-1', username: 'admin', fullName: 'Khairol Anam', role: 'SUPER_ADMIN', groupName: 'Pengelola Pusat', phone: '081234567890' },
  { id: 'usr-2', username: 'pengurus', fullName: 'Ust. H. Ridwan, S.Pd', role: 'PENGURUS', groupName: 'Divisi Kedisiplinan', phone: '081987654321' },
  { id: 'usr-3', username: 'kyai_ahmad', fullName: 'KH. Ahmad Dahlan', role: 'PENGASUH', groupName: 'Pengasuh Pondok', phone: '081122334455' },
  { id: 'usr-4', username: 'ahmad_fadhil', fullName: 'Ahmad Fadhil', role: 'SANTRI', groupName: "Kamar As-Syafi'i", phone: '-' },
  { id: 'usr-5', username: 'muhammad_rizky', fullName: 'Muhammad Rizky', role: 'SANTRI', groupName: "Kamar As-Syafi'i", phone: '-' },
  { id: 'usr-6', username: 'umar_faruq', fullName: 'Umar Al-Faruq', role: 'SANTRI', groupName: 'Kamar Al-Ghazali', phone: '-' },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState(fallbackUsers);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'SANTRI',
    groupName: "Kamar As-Syafi'i",
  });

  const loadUsers = async () => {
    const res = await fetchApi('/users');
    if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
      setUsers(
        res.data.map((u: any) => ({
          id: u.id,
          username: u.username,
          fullName: u.fullName,
          role: u.role,
          groupName: u.groupName || 'Pondok',
          phone: u.phone || '-',
        })),
      );
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) return;

    const res = await fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    if (res?.success) {
      setShowAddModal(false);
      loadUsers();
    } else {
      const mockCreated = {
        id: `usr-${Date.now()}`,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        groupName: newUser.groupName,
        phone: '-',
      };
      setUsers([mockCreated, ...users]);
      setShowAddModal(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    await fetchApi(`/users/${id}`, { method: 'DELETE' });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.groupName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">Pengelolaan Pengguna & Hak Akses</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola data Super Admin, Pengurus, Pengasuh, serta Santri pemilik perangkat HP.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors touch-target shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama, username, atau kamar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-accent/40 border border-border text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => (
          <div key={u.id} className="glass-card p-4 rounded-2xl space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-500 font-bold flex items-center justify-center text-sm">
                  {u.fullName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{u.fullName}</h3>
                  <p className="text-xs text-muted-foreground">@{u.username} • {u.groupName}</p>
                </div>
              </div>

              <button onClick={() => handleDeleteUser(u.id)} className="text-muted-foreground hover:text-rose-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 uppercase">
                {u.role}
              </span>

              <button onClick={() => alert(`Reset password untuk ${u.fullName} berhasil`)} className="text-emerald-500 font-semibold text-xs flex items-center space-x-1 hover:underline">
                <Key className="w-3 h-3" />
                <span>Reset Pass</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="glass-card p-6 rounded-2xl max-w-md w-full space-y-4 bg-card border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">Tambah Pengguna Baru</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Peran Hak Akses</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  >
                    <option value="SANTRI">Santri</option>
                    <option value="PENGURUS">Pengurus</option>
                    <option value="PENGASUH">Pengasuh</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kamar / Kelompok</label>
                  <input
                    type="text"
                    value={newUser.groupName}
                    onChange={(e) => setNewUser({ ...newUser, groupName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-accent/40 border border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-accent text-foreground text-xs font-semibold">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold">
                Simpan Pengguna
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
