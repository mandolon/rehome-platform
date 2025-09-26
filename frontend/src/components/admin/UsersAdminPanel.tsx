"use client"

import React, { useMemo, useState } from 'react'
import { FilamentResourceGuard } from '../auth/FilamentResourceGuard'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
}

export function UsersAdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 1, name: 'Alice Admin', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Mark PM', email: 'mark@example.com', role: 'project_manager' },
  ])
  const [selectedId, setSelectedId] = useState<number | null>(1)
  const [form, setForm] = useState<Partial<AdminUser>>({})

  const selected = useMemo(() => users.find(u => u.id === selectedId) || null, [users, selectedId])

  const handleCreate = () => {
    const id = Math.max(0, ...users.map(u => u.id)) + 1
    const newUser: AdminUser = {
      id,
      name: form.name?.toString() || 'New User',
      email: form.email?.toString() || `user${id}@example.com`,
      role: form.role?.toString() || 'team_member',
    }
    setUsers(prev => [...prev, newUser])
    setSelectedId(id)
    setForm({})
  }

  const handleUpdate = () => {
    if (!selected) return
    setUsers(prev => prev.map(u => (u.id === selected.id ? { ...selected, ...form } as AdminUser : u)))
    setForm({})
  }

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <FilamentResourceGuard resourceType="users">
      <div className="grid grid-cols-12 gap-4 p-4">
        <section className="col-span-5 border rounded p-3">
          <h2 className="font-semibold mb-2">Users</h2>
          <ul className="divide-y">
            {users.map(u => (
              <li key={u.id} className="py-2 flex items-center justify-between">
                <button className="text-left" onClick={() => setSelectedId(u.id)}>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email} • {u.role}</div>
                </button>
                <button className="text-red-600 text-sm" onClick={() => handleDelete(u.id)} aria-label={`Delete ${u.name}`}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-7 border rounded p-3">
          <h2 className="font-semibold mb-2">Detail</h2>
          {selected ? (
            <div className="space-y-2" aria-live="polite">
              <div><span className="text-sm text-gray-500">ID:</span> {selected.id}</div>
              <div><span className="text-sm text-gray-500">Name:</span> {selected.name}</div>
              <div><span className="text-sm text-gray-500">Email:</span> {selected.email}</div>
              <div><span className="text-sm text-gray-500">Role:</span> {selected.role}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No user selected</p>
          )}

          <div className="mt-4 border-t pt-3">
            <h3 className="font-medium mb-2">Edit/Create</h3>
            <form className="grid grid-cols-2 gap-2" onSubmit={e => e.preventDefault()}>
              <label className="flex flex-col gap-1">
                <span className="text-sm">Name</span>
                <input className="border rounded p-2" value={form.name?.toString() || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm">Email</span>
                <input className="border rounded p-2" value={form.email?.toString() || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </label>
              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-sm">Role</span>
                <select className="border rounded p-2" value={form.role?.toString() || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="team_member">Team Member</option>
                </select>
              </label>
              <div className="col-span-2 flex gap-2 mt-2">
                <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={handleCreate} aria-label="Create user">Create</button>
                <button className="bg-amber-600 text-white px-3 py-2 rounded" onClick={handleUpdate} disabled={!selected} aria-disabled={!selected} aria-label="Update user">Update</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </FilamentResourceGuard>
  )
}
