import React from "react"
import { I18NProvider } from "@/lib/i18n"
import { Lexend } from "next/font/google"
import { AuthProvider } from "@/lib/AuthContext"
import "@/styles/globals.css"

const lexend = Lexend({ subsets: ['latin'], display: 'block' });

export const metadata = {
  title: "Agentic CareGivers",
  description: "AI-powered post-operative patient monitoring",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={lexend.className}>
      <body className="bg-gray-50">
        <AuthProvider>
          <I18NProvider>{children}</I18NProvider>
        </AuthProvider>
      </body>
    </html>
  )
}