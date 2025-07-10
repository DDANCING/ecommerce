import Billboard from "@/components/billboard";
import { getBillboardData } from "@/actions/getBillboardData";
import { db } from "@/lib/db";
import { registerVisitor } from "@/actions/register-visitor";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { auth } from "@/auth";

export default async function Home() {
  const { billboardData } = await getBillboardData();
  await registerVisitor();

  const user = await auth();


const billboardProductIds = Array.isArray(billboardData)
  ? billboardData.map(b => b.highlightProduct?.id).filter(Boolean)
  : [];

const wishlistItems = await db.wishlist.findMany({
  where: {
    userId: user?.user.id,
    productId: { in: billboardProductIds },
  },
});

const wishlistProductIds = new Set(wishlistItems.map(item => item.productId));

const billboardWithWishlist = billboardData.map((item) => ({
  ...item,
  highlightProduct: item.highlightProduct
    ? {
        ...item.highlightProduct,
        isInWishlist: wishlistProductIds.has(item.highlightProduct.id),
      }
    : null,
}));

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-x-hidden">
      <div className="z-0">
      <Billboard data={billboardWithWishlist} />
     </div>
      {/* Seção de produtos em destaque */}
      <section className="w-full px-6 py-16 mx-20 bg-background rounded-t-4xl z-10">
        <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center md:text-left">
          Contrary to popular belief.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["PRODUTO EXEMPLO 1", "PRODUTO EXEMPLO 2", "PRODUTO EXEMPLO 3"].map((title, i) => (
            <div key={i} className="bg-foreground rounded-2xl shadow-md overflow-hidden">
              <Image
                src={`https://placehold.co/600x400`}
                alt={title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <button className="text-sm font-medium text-foreground bg-background rounded-full px-4 py-2">
                  Descubra Mais
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores de carrossel */}
        <div className="flex justify-center mt-6 gap-2">
          <span className="w-3 h-3 rounded-full bg-background/80"></span>
          <span className="w-3 h-3 rounded-full bg-background/30"></span>
          <span className="w-3 h-3 rounded-full bg-background/30"></span>
        </div>
       </div>
      

      {/* Seção de features */}
     
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto text-center mt-16">
          {[
            {
              title: "Qualidade de Som Superior",
              desc: "TEXTO EXEMPLO: Experimente um áudio cristalino com graves profundos e tons ricos. Perfeito para músicas, podcasts e chamadas.",
            },
            {
              title: "Tecnologia de Ponta",
              desc: "TEXTO EXEMPLO: Apresentando Bluetooth 6.0 para uma audição confiável e ininterrupta com uma conexão estável.",
            },
            {
              title: "Conforto e Ajuste Incomparáveis",
              desc: "TEXTO EXEMPLO: Pontas de ouvido personalizáveis garantem um ajuste perfeito. Leve e ergonômico, ideal para uso o dia todo.",
            },
            {
              title: "Design Elegante e Moderno",
              desc: "TEXTO EXEMPLO: Disponível em várias cores e designs elegantes, combinando estilo com desempenho excepcional.",
            },
          ].map((f, i) => (
            <div key={i}>
              <div className="text-4xl mb-4">🎧</div>
              <h4 className="text-lg font-semibold mb-2">{f.title}</h4>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção garantia 30 dias */}
      <section
        className="w-full relative h-[500px] bg-cover bg-center z-20 rounded-t-4xl -mt-10"
        style={{ backgroundImage: "url('https://placehold.co/1200x500')" }}
      >
        <div className="absolute inset-0 bg-background/50 flex items-center rounded-t-4xl">
          <div className="text-foreground max-w-xl px-6 md:ml-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Garantia de Devolução do Dinheiro em 30 Dias</h2>
            <p className="mb-6">
              TEXTO EXEMPLO: Sua satisfação é nossa principal prioridade. Oferecemos uma garantia de devolução do dinheiro em 30 dias para todos os pedidos. Nossa equipe de suporte ao cliente dedicada está aqui para ajudá-lo com qualquer dúvida ou preocupação.
            </p>
            <button className="bg-foreground text-background font-medium px-5 py-2 rounded-full">
              Descubra Mais
            </button>
          </div>
        </div>
      </section>

      {/* Seção de avaliações */}
      <section className="w-full px-6 py-16 mx-auto z-30 rounded-t-4xl -mt-10 bg-background">
        <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase text-muted-foreground mb-2">Depoimentos</p>
        <h2 className="text-3xl font-semibold mb-10">Avaliações dos Clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Testemunho */}
          <div className="bg-foreground rounded-xl p-6 relative">
            <div className="text-4xl text-muted-foreground mb-4">“</div>
            <p className="text-muted text-base mb-4">
              TEXTO EXEMPLO: Fiquei impressionado com a qualidade do som e a facilidade de uso. Conectar aos meus dispositivos foi super fácil e adoro os controles de toque. Definitivamente vale cada centavo.
            </p>
            <div className="flex items-center gap-4">
              <Image
                src="https://placehold.co/64x64"
                alt="Emma L."
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">Emma L.</span>
            </div>
            {/* Indicadores de controle */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="w-8 h-8 rounded-full bg-background text-foreground">&larr;</button>
              <button className="w-8 h-8 rounded-full bg-background text-foreground">&rarr;</button>
            </div>
          </div>

          {/* Imagem lateral fixa */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="https://placehold.co/600x400?text=CATEGORIAS+EXEMPLO"
              alt="Produto de estilo de vida"
              className="object-cover"
              fill
            />
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}