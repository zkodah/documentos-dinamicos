import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const modules = [
  {
    href: '/schemas',
    title: 'Schema Builder',
    description: 'Crea tipos de documentos personalizados sin código',
    icon: '🎨',
  },
  {
    href: '/documentos',
    title: 'Documentos',
    description: 'Gestión de documentos generados por empresa',
    icon: '📄',
  },
  {
    href: '/empleados',
    title: 'Empleados',
    description: 'Gestión de colaboradores por organización',
    icon: '👥',
  },
  {
    href: '/empresas',
    title: 'Empresas',
    description: 'Administración de organizaciones multi-tenant',
    icon: '🏢',
  },
]

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Documentos Dinámicos - Sistema de Gestión Documental</title>
        <meta
          name="description"
          content="Sistema SaaS de gestión documental con Schema Builder visual"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              📋 Documentos Dinámicos
            </h1>
            <p className="text-lg text-gray-500">
              Crea formularios y documentos personalizados para cualquier industria
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {modules.map((m) => (
              <Link key={m.href} href={m.href} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{m.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{m.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
