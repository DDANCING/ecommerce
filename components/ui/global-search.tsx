"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getGlobalSearchResults, type SearchResults } from "@/actions/search"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command"
import { useDebounce } from "@/hooks/use-debounce" // crie esse hook ou substitua com setTimeout no useEffect
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function GlobalSearch() {
  const router = useRouter()

  const [input, setInput] = React.useState("")
  const debouncedInput = useDebounce(input, 300)
  const [results, setResults] = React.useState<SearchResults>({
    products: [],
    categories: [],
    colors: [],
    sizes: [],
  })

  React.useEffect(() => {
    const fetch = async () => {
      if (debouncedInput.trim() === "") {
        setResults({ products: [], categories: [], colors: [], sizes: [] })
        return
      }

      const res = await getGlobalSearchResults(debouncedInput)
      setResults(res)
    }

    fetch()
  }, [debouncedInput])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      router.push(`/search/${encodeURIComponent(input.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className=" w-full max-w-sm">
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
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          {results.products.length > 0 && (
            <CommandGroup heading="Produtos">
              {results.products.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => router.push(`/product/${product.id}`)}
                >
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.categories.length > 0 && (
            <CommandGroup heading="Categorias">
              {results.categories.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => router.push(`/category/${category.id}`)}
                >
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.colors.length > 0 && (
            <CommandGroup heading="Cores">
              {results.colors.map((color) => (
                <CommandItem
                  key={color.id}
                  onSelect={() => router.push(`/color/${color.id}`)}
                >
                  {color.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.sizes.length > 0 && (
            <CommandGroup heading="Tamanhos">
              {results.sizes.map((size) => (
                <CommandItem
                  key={size.id}
                  onSelect={() => router.push(`/size/${size.id}`)}
                >
                  {size.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </form>
  )
}
