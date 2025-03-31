import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import "@/app/globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Airbnb Clone</title>
        <meta name="description" content="Airbnb clone created with Next.js" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
      </body>
    </html>
  )
}

