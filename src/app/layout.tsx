import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import Layout from '@/components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'George Diab - Engineering Leader & Technology Enthusiast',
    template: '%s | George Diab'
  },
  description: 'Engineering leader and technology enthusiast exploring the intersection of AI, software development, and team leadership. Read insights on engineering management, productivity, and modern web development.',
  keywords: ['engineering leadership', 'AI', 'software development', 'technology', 'productivity', 'team management', 'web development'],
  authors: [{ name: 'George Diab' }],
  creator: 'George Diab',
  publisher: 'George Diab',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://georgediab.com',
    siteName: 'George Diab',
    title: 'George Diab - Engineering Leader & Technology Enthusiast',
    description: 'Engineering leader and technology enthusiast exploring the intersection of AI, software development, and team leadership.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'George Diab - Engineering Leader & Technology Enthusiast',
    description: 'Engineering leader and technology enthusiast exploring the intersection of AI, software development, and team leadership.',
    creator: '@georgediab',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth dark" style={{ background: '#111827', colorScheme: 'dark' }}>
      <body 
        className={`${inter.className} antialiased bg-gray-900 text-gray-100 min-h-screen`}
        style={{ background: '#111827', color: '#f3f4f6' }}
      >
        <SessionProvider>
          <Layout>
            {children}
          </Layout>
        </SessionProvider>
      </body>
    </html>
  )
}