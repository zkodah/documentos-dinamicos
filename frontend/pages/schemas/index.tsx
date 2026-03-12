import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stack, Plus, PencilSimple, Trash, ArrowLeft,
  FileText, SquaresFour, WarningCircle,
} from '@phosphor-icons/react'
import { schemasService, type SchemaAttributes } from '@/domains/schemas/services/schemas.service'

interface SchemaItem { id: number; attributes: SchemaAttributes }

const CATEGORY_STYLES: Record<string, { dot: string; badge: string }> = {
  RRHH:          { dot: 'bg-sky-500',    badge: 'bg-sky-50 text-sky-700 border-sky-100' },
  Legal:         { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700 border-violet-100' },
  TI:            { dot: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  Ventas:        { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-100' },
  Administración:{ dot: 'bg-slate-500',  badge: 'bg-slate-50 text-slate-700 border-slate-200' },
  Educación:     { dot: 'bg-amber-500',  badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  Otro:          { dot: 'bg-rose-500',   badge: 'bg-rose-50 text-rose-700 border-rose-100' },
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-14 h-5 rounded-full" />
      </div>
      <div className="skeleton w-3/4 h-4 rounded mb-2" />
      <div className="skeleton w-1/2 h-3 rounded mb-4" />
      <div className="flex gap-2">
        <div className="skeleton w-16 h-5 rounded" />
        <div className="skeleton w-10 h-5 rounded" />
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}

const SchemasPage: NextPage = () => {
  const [schemas, setSchemas] = useState<SchemaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await schemasService.list()
      setSchemas(res.data)
    } catch {
      setError('No se pudieron cargar los schemas. Verifica tu sesión.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    setDeleting(id)
    try {
      await schemasService.remove(id)
      setSchemas((prev) => prev.filter((s) => s.id !== id))
    } catch {
      alert('Error al eliminar.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <Head><title>Schemas — Documentos Dinámicos</title></Head>
      <main className="min-h-[100dvh] bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <motion.div
            className="flex items-start justify-between mb-10"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div>
              <Link href="/" className="btn-ghost px-0 mb-3 text-zinc-400 hover:text-zinc-600 text-sm">
                <ArrowLeft size={14} />
                Inicio
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                  <Stack size={18} weight="bold" className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Schema Builder</h1>
                  {!loading && !error && (
                    <p className="text-sm text-zinc-500">
                      {schemas.length} schema{schemas.length !== 1 ? 's' : ''} definido{schemas.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Link href="/schemas/nuevo" className="btn-primary">
              <Plus size={15} weight="bold" />
              Nuevo schema
            </Link>
          </motion.div>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-red-100 p-8 text-center"
            >
              <WarningCircle size={36} className="text-red-400 mx-auto mb-3" weight="duotone" />
              <p className="text-red-600 text-sm font-medium mb-4">{error}</p>
              <Link href="/auth/login" className="btn-primary">
                Iniciar sesión
              </Link>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && !error && schemas.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <SquaresFour size={32} weight="duotone" className="text-slate-400" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-800 mb-2">Sin schemas todavía</h2>
              <p className="text-sm text-zinc-500 max-w-[30ch] mx-auto mb-7 leading-relaxed">
                Crea tu primer schema para definir la estructura de tus documentos
              </p>
              <Link href="/schemas/nuevo" className="btn-primary">
                <Plus size={15} weight="bold" />
                Crear primer schema
              </Link>
            </motion.div>
          )}

          {/* Schema grid */}
          {!loading && !error && schemas.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {schemas.map((s) => {
                  const fields = s.attributes.schema_json?.fields ?? []
                  const catStyle = CATEGORY_STYLES[s.attributes.categoria] ?? CATEGORY_STYLES['Otro']
                  return (
                    <motion.div
                      key={s.id}
                      variants={cardVariants}
                      exit="exit"
                      layout
                    >
                      <motion.div
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm
                                   hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      >
                        {/* Card header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                            <FileText size={20} weight="duotone" className="text-slate-500" />
                          </div>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${catStyle.badge}`}>
                            {s.attributes.categoria}
                          </span>
                        </div>

                        {/* Content */}
                        <h3 className="font-semibold text-zinc-900 text-sm tracking-tight mb-1">
                          {s.attributes.nombre}
                        </h3>
                        {s.attributes.descripcion && (
                          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-3">
                            {s.attributes.descripcion}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-3 mt-auto mb-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                            <span className="text-xs text-zinc-400">
                              {fields.length} campo{fields.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-300">·</span>
                          <span className="text-xs text-zinc-400 font-mono">v{s.attributes.version}</span>
                          {!s.attributes.activo && (
                            <span className="text-xs text-orange-500 font-medium">Inactivo</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                          <Link
                            href={`/schemas/${s.id}`}
                            className="btn-secondary flex-1 justify-center text-xs py-1.5"
                          >
                            <PencilSimple size={13} />
                            Editar
                          </Link>
                          <motion.button
                            onClick={() => handleDelete(s.id, s.attributes.nombre)}
                            disabled={deleting === s.id}
                            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-red-500
                                       hover:bg-red-50 rounded-xl border border-slate-200
                                       transition-colors disabled:opacity-40 flex items-center gap-1"
                            whileTap={{ scale: 0.96 }}
                          >
                            <Trash size={13} />
                            {deleting === s.id ? '...' : ''}
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </main>
    </>
  )
}

export default SchemasPage
