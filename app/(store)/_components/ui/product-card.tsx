"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ShoppingCart, Star, Heart } from "lucide-react"

import { StoreProduct } from "@/app/types"
import { useCart } from "@/hooks/use-cart"
import { formatter, cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { containerVariants, contentVariants, favoriteVariants, overlayVariants } from "@/lib/animations"

interface ProductCardProps {
  product: StoreProduct
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const addItem = useCart((state) => state.addItem)

  const handleAddToCart = useCallback(() => {
    setIsAdding(true)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
    setTimeout(() => setIsAdding(false), 1500)
  }, [addItem, product])

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const imageUrl = product.images[0]?.url ?? "/placeholder.svg"
  const price = formatter.format(product.price)

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  }



  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={containerVariants}
      className={cn(
        "relative w-80 rounded-2xl border border-border/50 bg-card text-card-foreground overflow-hidden",
        "shadow-lg shadow-black/5 cursor-pointer group"
      )}
    >
      {/* Imagem e botão de favorito */}
      <div className="relative overflow-hidden">
        <motion.div variants={imageVariants}>
          <Image
            src={imageUrl}
            alt={product.name}
            width={320}
            height={240}
            className="w-full h-56 object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <motion.button
          onClick={handleFavorite}
          variants={favoriteVariants}
          animate={isFavorite ? "favorite" : "rest"}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm border border-white/20",
            isFavorite
              ? "bg-rose-500 text-muted-foreground"
              : "bg-muted/20 text-muted hover:bg-muted/30"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </motion.button>
      </div>

      {/* Conteúdo principal */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold">{product.name}</h3>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">{price}</span>
          {product.originalPrice && (
            <span className="text-lg line-through text-muted-foreground">
              {formatter.format(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating ?? 0)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating ?? 0} ({product.reviewCount ?? 0})
          </span>
        </div>
      </div>

      {/* Overlay com descrição e ações */}
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-background/95 backdrop-blur-xl flex flex-col justify-end text-start"
      >
       
        <div className="p-6"> 
         
          <motion.div variants={contentVariants}>
               <h4 className="font-semibold">Cor</h4>
              <div 
             className="h-6 w-6 rounded-full border" 
            style={{backgroundColor: product.color.value}}
             />
    
             <p className="text-sm text-muted-foreground mb-4">
              {product.color.name}
            </p>
            
            <h4 className="font-semibold ">Detalhes</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {product.description ?? "Sem descrição disponível."}
            </p>
          </motion.div>

          <motion.div variants={contentVariants} className="space-y-3">
            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-12 font-medium",
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
                "shadow-lg shadow-primary/25 disabled:opacity-60"
              )}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAdding ? "Adicionado!" : "Adicionar ao Carrinho"}
            </motion.button>

            <Link
              href={`/product/${product.id}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full h-10 font-medium text-center block"
              )}
            >
              Ver Detalhes
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductCard
