"use client"

import { Button } from "@/components/ui/button"
import { useI18N, type Locale } from "@/lib/i18n"

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18N()

  const switchLanguage = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  return (
    <div className="flex space-x-2">
      <Button variant={locale === "fr" ? "default" : "outline"} onClick={() => switchLanguage("fr")}>
        FR
      </Button>
      <Button variant={locale === "en" ? "default" : "outline"} onClick={() => switchLanguage("en")}>
        EN
      </Button>
    </div>
  )
}

