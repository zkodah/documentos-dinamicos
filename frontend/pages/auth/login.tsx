import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeSimple, LockSimple, Eye, EyeSlash, Stack, ArrowRight } from '@phosphor-icons/react'
import { strapiClient } from '@/shared/services/strapi'

// ─── Animated schema preview cards ────────────────────────────────────────
const previewCards = [
  {
    title: 'Contrato de Trabajo',
    category: 'RRHH',
    fields: ['Nombre completo', 'RUT', 'Cargo', 'Fecha inicio'],
    offset: { x: 0, y: 0, rotate: -2 },
    floatY: [-8, 8],
  },
  {
    title: 'Ficha Técnica',
    category: 'TI',
    fields: ['Equipo', 'Serial', 'Asignado a'],
    offset: { x: 40, y: 120, rotate: 3 },
    floatY: [6, -6],
  },
  {
    title: 'Solicitud Legal',
    category: 'Legal',
    fields: ['Solicitante', 'Motivo', 'Adjunto'],
    offset: { x: -20, y: 240, rotate: -1 },
    floatY: [-5, 10],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  RRHH: 'bg-sky-100 text-sky-700',
  TI: 'bg-emerald-100 text-emerald-700',
  Legal: 'bg-violet-100 text-violet-700',
}

function PreviewCard({
  title, category, fields, floatY, delay,
}: {
  title: string; category: string; fields: string[]
  floatY: number[]; delay: number
}) {
  return (
    <motion.div
      className="absolute bg-white/10 backdrop-blur-sm border border-white/10
                 rounded-2xl p-4 w-52 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      animate={{ y: floatY }}
      transition={{ duration: 3 + delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/90 text-xs font-semibold truncate">{title}</span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[category]}`}>
          {category}
        </span>
      </div>
      <div className="space-y-1.5">
        {fields.map((f) => (
          <div key={f} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
            <span className="text-white/50 text-[11px]">{f}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────
const LoginPage: NextPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await strapiClient.post<{ jwt: string }>('/auth/local', form)
      localStorage.setItem('strapi-token', res.data.jwt)
      router.push('/')
    } catch {
      setError('Credenciales inválidas. Verifica tu usuario y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Iniciar sesión — Documentos Dinámicos</title></Head>
      <main className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-[55%_45%]">

        {/* ── Left dark panel ─────────────────────────────────────────── */}
        <motion.div
          className="hidden md:flex flex-col justify-between bg-slate-900 p-12 overflow-hidden relative"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2.5 text-white z-10">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Stack size={18} weight="bold" className="text-white" />
            </div>
            <span className="font-semibold tracking-tight">Documentos Dinámicos</span>
          </div>

          {/* Floating preview cards */}
          <div className="relative h-72 z-10">
            {previewCards.map((card, i) => (
              <div
                key={card.title}
                style={{ left: card.offset.x, top: card.offset.y, rotate: `${card.offset.rotate}deg` }}
                className="absolute"
              >
                <PreviewCard
                  title={card.title}
                  category={card.category}
                  fields={card.fields}
                  floatY={card.floatY}
                  delay={i * 0.5}
                />
              </div>
            ))}
          </div>

          {/* Footer quote */}
          <div className="z-10">
            <p className="text-slate-400 text-sm leading-relaxed max-w-[38ch]">
              Crea formularios y documentos dinámicos para cualquier industria.
              Sin código, sin fricción.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand-500" />
              <span className="text-slate-400 text-xs">Plataforma SaaS multi-tenant</span>
            </div>
          </div>

          {/* Background grid decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        </motion.div>

        {/* ── Right form panel ────────────────────────────────────────── */}
        <motion.div
          className="flex items-center justify-center p-8 bg-white min-h-[100dvh] md:min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="w-full max-w-[360px]">
            {/* Mobile brand */}
            <div className="flex md:hidden items-center gap-2 mb-8">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <Stack size={15} weight="bold" className="text-white" />
              </div>
              <span className="font-semibold text-sm text-zinc-900">Documentos Dinámicos</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">
                Bienvenido de vuelta
              </h1>
              <p className="text-sm text-zinc-500 mb-8">
                Ingresa tus credenciales para continuar
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.28 }}
            >
              <div>
                <label className="label">Email o usuario</label>
                <div className="relative">
                  <EnvelopeSimple
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                  />
                  <input
                    className="input pl-9"
                    type="text"
                    value={form.identifier}
                    onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Contraseña</label>
                <div className="relative">
                  <LockSimple
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                  />
                  <input
                    className="input pl-9 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword
                      ? <EyeSlash size={16} />
                      : <Eye size={16} />
                    }
                  </button>
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Iniciando sesión...
                  </span>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight size={15} weight="bold" />
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </motion.div>

      </main>
    </>
  )
}

export default LoginPage
