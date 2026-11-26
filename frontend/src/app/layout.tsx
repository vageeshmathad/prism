import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'PRISM — Software Engineering Evaluation',
    template: '%s | PRISM',
  },
  description: 'AI-powered software engineering evaluation platform. See beyond the code.',
  keywords: ['evaluation', 'software engineering', 'AI', 'code quality', 'academic'],
  authors: [{ name: 'PRISM Team' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-primary-text font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
              },
              success: {
                iconTheme: { primary: '#16A34A', secondary: '#FFFFFF' },
              },
              error: {
                iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
