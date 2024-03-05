"use client"
import { usePathname } from 'next/navigation'
import Template from './component/Template'
import Provider from './component/Provider'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <html lang="id">
      <body>
        <Provider>
          {pathname == "/login" ? <>{children}</> : <Template>{children}</Template>}
          <SpeedInsights />
          <Analytics />
        </Provider>
      </body>
    </html>
  )
}
