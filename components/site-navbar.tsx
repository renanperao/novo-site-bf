"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "PORTAS", href: "#portas" },
  { label: "PROCESSO", href: "#processo" },
  { label: "CONTATO", href: "#contato" },
]

export function SiteNavbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Brasil Forte"
        >
          <Image
            src="/images/logo-preto-bf.png"
            alt="Brasil Forte"
            width={296}
            height={48}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Button
          asChild
          size="sm"
          className="h-8 rounded-none bg-foreground px-4 text-[11px] font-medium uppercase tracking-[0.22em] text-background hover:bg-foreground/90"
        >
          <Link href="#contato">Orçamento</Link>
        </Button>
      </nav>
    </motion.header>
  )
}
