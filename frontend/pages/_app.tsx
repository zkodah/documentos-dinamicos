import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import { useEffect } from 'react'
import '../styles/globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

const PUBLIC_ROUTES = ['/auth/login']

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(router.pathname)) return
    const token = localStorage.getItem('strapi-token')
    if (!token) router.replace('/auth/login')
  }, [router.pathname])

  return (
    <div className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  )
}
