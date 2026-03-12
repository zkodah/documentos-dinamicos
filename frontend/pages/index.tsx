import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Stack, FileText, Users, Buildings, ArrowUpRight, SignOut } from '@phosphor-icons/react'

const modules = [
  {
    href: '/schemas',
    title: 'Schema Builder',
    description: 'Crea tipos de documentos personalizados. Define campos, validaciones y layouts sin escribir código.',
    icon: Stack,
    accent: 'bg-brand-500',
    featured: true,
  },
  {
    href: '/documentos',
    title: 'Documentos',
    description: 'Gestión de documentos generados por empresa.',
    icon: FileText,
    accent: 'bg-violet-500',
    featured: false,
  },
  {
    href: '/empleados',
    title: 'Empleados',
    description: 'Gestión de colaboradores por organización.',
    icon: Users,
    accent: 'bg-emerald-500',
    featured: false,
  },
  {
    href: '/empresas',
    title: 'Empresas',
    description: 'Administración multi-tenant de organizaciones.',
    icon: Buildings,
    accent: 'bg-orange-500',
    featured: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
}

const handleLogout = () => {
  localStorage.removeItem('strapi-token')
  window.location.href = '/auth/login'
}

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Documentos Dinámicos</title>
      </Head>
      <main className="min-h-[100dvh] bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <motion.div
            className="flex items-start justify-between mb-12"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                  <Stack size={18} weight="bold" className="text-white" />
                </div>
                <span className="text-sm font-medium text-zinc-500">Documentos Dinámicos</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Panel principal
              </h1>
              <p className="text-zinc-500 mt-1 text-sm">
                Selecciona un módulo para continuar
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-ghost text-zinc-400 hover:text-red-500 hover:bg-red-50 mt-1"
            >
              <SignOut size={16} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </motion.div>

          {/* Bento grid — asymmetric */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Featured: Schema Builder */}
            <motion.div variants={itemVariants} className="md:row-span-2">
              <Link href={modules[0].href} className="group block h-full">
                <motion.div
                  className="h-full bg-white rounded-3xl border border-slate-200 p-7
                             shadow-sm hover:shadow-md transition-shadow duration-300
                             flex flex-col min-h-[260px]"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 ${modules[0].accent} rounded-2xl flex items-center justify-center shadow-sm`}>
                      <Stack size={24} weight="duotone" className="text-white" />
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 2, y: -2 }}
                    >
                      <ArrowUpRight size={18} className="text-zinc-400" />
                    </motion.div>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight mb-2">
                    {modules[0].title}
                  </h2>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {modules[0].description}
                  </p>
                  <div className="mt-auto pt-6">
                    <div className="flex items-center gap-1.5">
                      {['Texto', 'Fecha', 'Firma', 'Selección'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Other modules */}
            {modules.slice(1).map((mod) => (
              <motion.div key={mod.href} variants={itemVariants}>
                <Link href={mod.href} className="group block">
                  <motion.div
                    className="bg-white rounded-3xl border border-slate-200 p-6
                               shadow-sm hover:shadow-md transition-shadow duration-300
                               flex items-start gap-4"
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  >
                    <div className={`w-10 h-10 ${mod.accent} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                      <mod.icon size={20} weight="duotone" className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
                          {mod.title}
                        </h2>
                        <ArrowUpRight
                          size={16}
                          className="text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0 ml-2"
                        />
                      </div>
                      <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>
    </>
  )
}

export default HomePage
