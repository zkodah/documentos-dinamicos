import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Plus, X, ArrowUp, ArrowDown, Gear,
  TextT, TextAlignLeft, Hash, At, Phone, CalendarBlank,
  ToggleLeft, ListBullets, Paperclip, PencilSimple, FloppyDisk,
} from '@phosphor-icons/react'
import { schemasService } from '@/domains/schemas/services/schemas.service'
import type { SchemaField, FieldType } from '@/shared/types'

// ─── Types ─────────────────────────────────────────────────────────────────
interface FieldWithId extends SchemaField { uid: string }

// ─── Field type catalog ─────────────────────────────────────────────────────
const FIELD_TYPES: { tipo: FieldType; label: string; Icon: React.ElementType }[] = [
  { tipo: 'text',      label: 'Texto',      Icon: TextT },
  { tipo: 'textarea',  label: 'Párrafo',    Icon: TextAlignLeft },
  { tipo: 'number',    label: 'Número',     Icon: Hash },
  { tipo: 'email',     label: 'Email',      Icon: At },
  { tipo: 'phone',     label: 'Teléfono',   Icon: Phone },
  { tipo: 'date',      label: 'Fecha',      Icon: CalendarBlank },
  { tipo: 'boolean',   label: 'Si / No',    Icon: ToggleLeft },
  { tipo: 'select',    label: 'Selección',  Icon: ListBullets },
  { tipo: 'file',      label: 'Archivo',    Icon: Paperclip },
  { tipo: 'signature', label: 'Firma',      Icon: PencilSimple },
]

const CATEGORIAS = ['RRHH', 'Legal', 'TI', 'Ventas', 'Administración', 'Educación', 'Otro']

function toNombreTecnico(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

// ─── Field row ──────────────────────────────────────────────────────────────
function FieldRow({
  field, index, total, onChange, onDelete, onMove,
}: {
  field: FieldWithId; index: number; total: number
  onChange: (f: FieldWithId) => void; onDelete: () => void; onMove: (d: 'up' | 'down') => void
}) {
  const [open, setOpen] = useState(false)
  const typeInfo = FIELD_TYPES.find((t) => t.tipo === field.tipo)!

  return (
    <motion.div
      layout
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
          <typeInfo.Icon size={14} className="text-zinc-500" />
        </div>
        <div className="flex-1 min-w-0">
          <input
            className="w-full text-sm font-medium text-zinc-900 bg-transparent border-0 outline-none
                       placeholder:text-zinc-400"
            value={field.etiqueta}
            onChange={(e) => onChange({ ...field, etiqueta: e.target.value })}
            placeholder="Etiqueta del campo"
          />
          <p className="text-[11px] text-zinc-400 font-mono">{typeInfo.label} · {field.nombre}</p>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer shrink-0 select-none">
          <input
            type="checkbox"
            checked={field.requerido}
            onChange={(e) => onChange({ ...field, requerido: e.target.checked })}
            className="w-3 h-3 rounded accent-brand-600"
          />
          Requerido
        </label>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={() => onMove('up')} disabled={index === 0}
            className="p-1.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-20 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowUp size={12} weight="bold" />
          </button>
          <button onClick={() => onMove('down')} disabled={index === total - 1}
            className="p-1.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-20 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowDown size={12} weight="bold" />
          </button>
          <button onClick={() => setOpen(!open)}
            className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${open ? 'text-brand-600 bg-brand-50' : 'text-zinc-300 hover:text-zinc-600'}`}>
            <Gear size={13} />
          </button>
          <button onClick={onDelete}
            className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X size={13} weight="bold" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 border-t border-slate-100 space-y-3 bg-slate-50/50">
              <div>
                <label className="label text-xs">Nombre técnico</label>
                <input className="input text-sm font-mono" value={field.nombre}
                  onChange={(e) => onChange({ ...field, nombre: e.target.value })} />
              </div>
              {field.tipo === 'select' && (
                <div>
                  <label className="label text-xs">Opciones (una por línea)</label>
                  <textarea className="input text-sm" rows={3}
                    value={(field.opciones ?? []).join('\n')}
                    onChange={(e) => onChange({ ...field, opciones: e.target.value.split('\n').filter(Boolean) })}
                    placeholder={'Opción 1\nOpción 2\nOpción 3'} />
                </div>
              )}
              {(field.tipo === 'text' || field.tipo === 'textarea') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Mín. caracteres</label>
                    <input className="input text-sm" type="number"
                      value={field.validaciones?.minLength ?? ''}
                      onChange={(e) => onChange({ ...field, validaciones: { ...field.validaciones, minLength: e.target.value ? Number(e.target.value) : undefined } })} />
                  </div>
                  <div>
                    <label className="label text-xs">Máx. caracteres</label>
                    <input className="input text-sm" type="number"
                      value={field.validaciones?.maxLength ?? ''}
                      onChange={(e) => onChange({ ...field, validaciones: { ...field.validaciones, maxLength: e.target.value ? Number(e.target.value) : undefined } })} />
                  </div>
                </div>
              )}
              {field.tipo === 'number' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Mínimo</label>
                    <input className="input text-sm" type="number"
                      value={field.validaciones?.min ?? ''}
                      onChange={(e) => onChange({ ...field, validaciones: { ...field.validaciones, min: e.target.value ? Number(e.target.value) : undefined } })} />
                  </div>
                  <div>
                    <label className="label text-xs">Máximo</label>
                    <input className="input text-sm" type="number"
                      value={field.validaciones?.max ?? ''}
                      onChange={(e) => onChange({ ...field, validaciones: { ...field.validaciones, max: e.target.value ? Number(e.target.value) : undefined } })} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────
const NuevoSchemaPage: NextPage = () => {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [nombre, setNombre] = useState('')
  const [nombreTecnico, setNombreTecnico] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('RRHH')
  const [layout, setLayout] = useState<'single' | 'two-column'>('single')
  const [fields, setFields] = useState<FieldWithId[]>([])

  const addField = (tipo: FieldType) => {
    const count = fields.filter((f) => f.tipo === tipo).length
    const typeInfo = FIELD_TYPES.find((t) => t.tipo === tipo)!
    setFields((prev) => [...prev, {
      uid: Math.random().toString(36).slice(2),
      nombre: `${tipo}_${count + 1}`,
      tipo,
      etiqueta: `${typeInfo.label} ${count + 1}`,
      requerido: false,
    }])
  }

  const updateField = (uid: string, updated: FieldWithId) =>
    setFields((prev) => prev.map((f) => f.uid === uid ? updated : f))

  const deleteField = (uid: string) =>
    setFields((prev) => prev.filter((f) => f.uid !== uid))

  const moveField = (index: number, dir: 'up' | 'down') => {
    const next = [...fields]
    const target = dir === 'up' ? index - 1 : index + 1
    ;[next[index], next[target]] = [next[target], next[index]]
    setFields(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (fields.length === 0) { setError('Agrega al menos un campo.'); return }
    setSaving(true); setError('')
    try {
      await schemasService.create({
        nombre, nombre_tecnico: nombreTecnico, descripcion, version: '1.0',
        categoria, schema_json: { fields: fields.map(({ uid, ...f }) => f), layout }, activo: true,
      })
      router.push('/schemas')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      setError(msg ?? 'Error al guardar. Verifica que estás autenticado.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Head><title>Nuevo Schema — Documentos Dinámicos</title></Head>
      <main className="min-h-[100dvh] bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div>
              <Link href="/schemas" className="btn-ghost px-0 mb-3 text-zinc-400 hover:text-zinc-600 text-sm">
                <ArrowLeft size={14} />
                Schemas
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Nuevo schema</h1>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.08 }}
            >
              {/* ── Left: metadata ────────────────────────────────────── */}
              <div className="space-y-4">
                <div className="card">
                  <h2 className="text-sm font-semibold text-zinc-700 mb-4">Información</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="label">Nombre *</label>
                      <input className="input" value={nombre}
                        onChange={(e) => { setNombre(e.target.value); setNombreTecnico(toNombreTecnico(e.target.value)) }}
                        placeholder="Ej: Contrato de Trabajo" required />
                    </div>
                    <div>
                      <label className="label">Nombre técnico</label>
                      <input className="input font-mono text-sm" value={nombreTecnico}
                        onChange={(e) => setNombreTecnico(e.target.value)}
                        placeholder="contrato_de_trabajo" required />
                    </div>
                    <div>
                      <label className="label">Categoría *</label>
                      <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Descripción</label>
                      <textarea className="input" rows={3} value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Para qué sirve este schema..." />
                    </div>
                    <div>
                      <label className="label">Layout de formulario</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {(['single', 'two-column'] as const).map((l) => (
                          <button key={l} type="button" onClick={() => setLayout(l)}
                            className={`py-2 text-xs rounded-xl border transition-all ${
                              layout === l
                                ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                                : 'border-slate-200 text-zinc-500 hover:border-slate-300'
                            }`}>
                            {l === 'single' ? '1 columna' : '2 columnas'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex gap-2">
                  <Link href="/schemas" className="btn-secondary flex-1 justify-center">
                    Cancelar
                  </Link>
                  <button type="submit" className="btn-primary flex-1 justify-center" disabled={saving}>
                    {saving ? (
                      <motion.div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    ) : <FloppyDisk size={15} />}
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>

              {/* ── Right: builder ─────────────────────────────────────── */}
              <div className="space-y-4">
                {/* Field palette */}
                <div className="card">
                  <h2 className="text-sm font-semibold text-zinc-700 mb-3">
                    Tipos de campo
                    <span className="ml-2 text-xs text-zinc-400 font-normal">Haz clic para agregar</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {FIELD_TYPES.map(({ tipo, label, Icon }) => (
                      <motion.button
                        key={tipo}
                        type="button"
                        onClick={() => addField(tipo)}
                        className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-slate-200
                                   text-zinc-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700
                                   transition-colors font-medium"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: -1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Icon size={13} />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Fields list */}
                <div className="card min-h-[220px]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-zinc-700">
                      Campos del schema
                    </h2>
                    <span className="text-xs text-zinc-400 font-mono">
                      {fields.length} campo{fields.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center
                                    border-2 border-dashed border-slate-200 rounded-xl">
                      <Plus size={24} className="text-slate-300 mb-2" />
                      <p className="text-sm text-zinc-400">
                        Haz clic en un tipo de campo para agregarlo
                      </p>
                    </div>
                  ) : (
                    <motion.div className="space-y-2" layout>
                      <AnimatePresence initial={false}>
                        {fields.map((field, i) => (
                          <motion.div
                            key={field.uid}
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          >
                            <FieldRow
                              field={field}
                              index={i}
                              total={fields.length}
                              onChange={(updated) => updateField(field.uid, updated)}
                              onDelete={() => deleteField(field.uid)}
                              onMove={(dir) => moveField(i, dir)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </form>
        </div>
      </main>
    </>
  )
}

export default NuevoSchemaPage
