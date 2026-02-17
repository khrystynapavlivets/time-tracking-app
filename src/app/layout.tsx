import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { StoreProvider } from "@/lib/store"
import { AppLayout } from "@/components/layout/app-layout"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Chronos - Time Tracking Dashboard",
  description:
    "Track your time, manage projects, and boost productivity with Chronos.",
}

export const viewport: Viewport = {
  themeColor: "#0f1629",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <StoreProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </StoreProvider>
      </body>
    </html>
  )
}
