"use client"

import React, { useMemo, useState } from 'react'
import { FilamentResourceGuard } from '../auth/FilamentResourceGuard'

export interface AdminWorkspace {
  id: number
  name: string
  owner: string
  members: number
}

export function WorkspacesAdminPanel() {
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([
    { id: 1, name: 'Alpha Workspace', owner: 'Alice Admin', members: 5 },
    { id: 2, name: 'Beta Workspace', owner: 'Mark PM', members: 12 },
  ])
  const [selectedId, setSelectedId] = useState<number | null>(1)
  const [form, setForm] = useState<Partial<AdminWorkspace>>({})

  const selected = useMemo(() => workspaces.find(w => w.id === selectedId) || null, [workspaces, selectedId])

  const handleCreate = () => {
    const id = Math.max(0, ...workspaces.map(w => w.id)) + 1
    const newWs: AdminWorkspace = {
      id,
      name: form.name?.toString() || `Workspace ${id}`,
      owner: form.owner?.toString() || 'Unknown',
      members: Number(form.members ?? 0),
    }
    setWorkspaces(prev => [...prev, newWs])
    setSelectedId(id)
    setForm({})
  }

  const handleUpdate = () => {
    if (!selected) return
    setWorkspaces(prev => prev.map(w => (w.id === selected.id ? { ...selected, ...form, members: Number((form.members ?? selected.members)) } as AdminWorkspace : w)))
    setForm({})
  }

  const handleDelete = (id: number) => {
    setWorkspaces(prev => prev.filter(w => w.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <FilamentResourceGuard resourceType="workspaces">
      <div className="grid grid-cols-12 gap-4 p-4">
        <section className="col-span-5 border rounded p-3">
          <h2 className="font-semibold mb-2">Workspaces</h2>
          <ul className="divide-y">
            {workspaces.map(w => (
              <li key={w.id} className="py-2 flex items-center justify-between">
                <button className="text-left" onClick={() => setSelectedId(w.id)}>
                  <div className="font-medium">{w.name}</div>
                  <div className="text-xs text-gray-500">Owner: {w.owner} • Members: {w.members}</div>
                </button>
                <button className="text-red-600 text-sm" onClick={() => handleDelete(w.id)} aria-label={`Delete ${w.name}`}>
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
              <div><span className="text-sm text-gray-500">Owner:</span> {selected.owner}</div>
              <div><span className="text-sm text-gray-500">Members:</span> {selected.members}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No workspace selected</p>
          )}

          <div className="mt-4 border-t pt-3">
            <h3 className="font-medium mb-2">Edit/Create</h3>
            <form className="grid grid-cols-2 gap-2" onSubmit={e => e.preventDefault()}>
              <label className="flex flex-col gap-1">
                <span className="text-sm">Name</span>
                <input className="border rounded p-2" value={form.name?.toString() || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm">Owner</span>
                <input className="border rounded p-2" value={form.owner?.toString() || ''} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
              </label>
              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-sm">Members</span>
                <input type="number" className="border rounded p-2" value={(form.members as any) ?? ''} onChange={e => setForm(f => ({ ...f, members: Number(e.target.value) }))} />
              </label>
              <div className="col-span-2 flex gap-2 mt-2">
                <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={handleCreate} aria-label="Create workspace">Create</button>
                <button className="bg-amber-600 text-white px-3 py-2 rounded" onClick={handleUpdate} disabled={!selected} aria-disabled={!selected} aria-label="Update workspace">Update</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </FilamentResourceGuard>
  )
}
