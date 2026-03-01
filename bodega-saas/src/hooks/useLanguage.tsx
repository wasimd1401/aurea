import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Language } from '@/lib/types'
import { t as translate } from '@/lib/constants'

interface LanguageContextValue {
  lang: Language
  setLang: (l: Language) => void
  t: (key: string, replacements?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('bodega-lang')
    return (stored === 'en' ? 'en' : 'es') as Language
  })

  function handleSetLang(l: Language) {
    setLang(l)
    localStorage.setItem('bodega-lang', l)
  }

  function t(key: string, replacements?: Record<string, string | number>) {
    return translate(key, lang, replacements)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider')
  return ctx
}
