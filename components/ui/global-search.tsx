"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command"
import { getGlobalSearchResults, type SearchResults } from "@/actions/search"
import { useDebounce } from "@/hooks/use-debounce"
import { useMediaQuery } from "@/hooks/use-mobile"
import { highlightMatch } from "@/lib/highlight-match"
import { SearchSkeleton } from "@/components/ui/search-skeleton"
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function GlobalSearch() {
  const router = useRouter()
  const [input, setInput] = React.useState("")
  const [openMobile, setOpenMobile] = React.useState(false)
  const debouncedInput = useDebounce(input, 300)
  const [results, setResults] = React.useState<SearchResults>({
    products: [],
    categories: [],
    colors: [],
    sizes: [],
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const recentKey = "recentSearches"
  const recentSearches = React.useMemo(() => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(recentKey) || "[]") as string[]
  }, [])

  React.useEffect(() => {
    if (!debouncedInput.trim()) {
      setResults({ products: [], categories: [], colors: [], sizes: [] })
      return
    }
    setIsLoading(true)
    getGlobalSearchResults(debouncedInput).then((res) => {
      setResults(res)
      setIsLoading(false)
    })
  }, [debouncedInput])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    saveRecent(input.trim())
    router.push(`/search/${encodeURIComponent(input.trim())}`)
    setOpenMobile(false)
  }

  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 5)
    localStorage.setItem(recentKey, JSON.stringify(updated))
  }

  const renderGroups = () => (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {results.products.length > 0 && (
        <CommandGroup heading="Produtos">
          {results.products.map((product) => (
            <motion.div key={product.id} variants={fadeInUp} {...scaleIn}>
              <CommandItem onSelect={() => router.push(`/product/${product.id}`)}>
                {highlightMatch(product.name, input)}
              </CommandItem>
            </motion.div>
          ))}
        </CommandGroup>
      )}
      {results.categories.length > 0 && (
        <CommandGroup heading="Categorias">
          {results.categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeInUp} {...scaleIn}>
              <CommandItem onSelect={() => router.push(`/category/${cat.id}`)}>
                {highlightMatch(cat.name, input)}
              </CommandItem>
            </motion.div>
          ))}
        </CommandGroup>
      )}
      {results.colors.length > 0 && (
        <CommandGroup heading="Cores">
          {results.colors.map((color) => (
            <motion.div key={color.id} variants={fadeInUp} {...scaleIn}>
              <CommandItem onSelect={() => router.push(`/color/${color.id}`)}>
                {highlightMatch(color.name, input)}
              </CommandItem>
            </motion.div>
          ))}
        </CommandGroup>
      )}
      {results.sizes.length > 0 && (
        <CommandGroup heading="Tamanhos">
          {results.sizes.map((size) => (
            <motion.div key={size.id} variants={fadeInUp} {...scaleIn}>
              <CommandItem onSelect={() => router.push(`/size/${size.id}`)}>
                {highlightMatch(size.name, input)}
              </CommandItem>
            </motion.div>
          ))}
        </CommandGroup>
      )}
    </motion.div>
  )

  return isMobile ? (
    <>
      <button onClick={() => setOpenMobile(true)} className="p-2">
        <SearchIcon className="h-5 w-5" />
      </button>
      {openMobile && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10">
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-background rounded-lg shadow-xl overflow-hidden"
            {...scaleIn}
          >
            <Command>
              <CommandInput
                placeholder="Buscar..."
                value={input}
                onValueChange={setInput}
                autoFocus
              />
              <CommandList>
                {isLoading ? <SearchSkeleton /> : input.trim() ? renderGroups() : (
                  <CommandGroup heading="Buscas Recentes">
                    {recentSearches.map((term) => (
                      <CommandItem
                        key={term}
                        onSelect={() => {
                          setInput(term)
                        }}
                      >
                        {term}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </motion.form>
        </div>
      )}
    </>
  ) : (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Command className="rounded-lg border bg-popover shadow-md">
        <div className="relative">
          <CommandInput
            placeholder="Buscar produtos, categorias..."
            value={input}
            onValueChange={setInput}
            className="pl-8"
          />
        </div>
        <CommandList className={cn(!input && "hidden")}> 
          {isLoading ? <SearchSkeleton /> : input.trim() ? renderGroups() : (
            <CommandGroup heading="Buscas Recentes">
              {recentSearches.map((term) => (
                <CommandItem
                  key={term}
                  onSelect={() => {
                    setInput(term)
                    saveRecent(term)
                    router.push(`/search/${encodeURIComponent(term)}`)
                  }}
                >
                  {term}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </form>
  )
}
