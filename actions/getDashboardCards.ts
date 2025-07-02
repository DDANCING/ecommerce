"use server";

import { db } from "@/lib/db";
import { startOfMonth, subMonths } from "date-fns";

type DashboardCardProps = {
  titulo: string;
  valor: string;
  percentual: string;
  tendencia: "up" | "down";
  destaque: string;
  subtitulo: string;
};

export async function getDashboardCards(): Promise<DashboardCardProps[]> {
  const now = new Date();

  // Datas de referência
  const inicioMesAtual = startOfMonth(now);
  const inicioMesAnterior = startOfMonth(subMonths(now, 1));
  const inicioDoisMesesAtras = startOfMonth(subMonths(now, 2));

  // --- Consultas em paralelo com Promise.all ---
  const [
    receitaMesAnterior,
    receitaDoisMesesAtras,
    pedidosMesAnterior,
    pedidosDoisMesesAtras,
    novosClientesMesAnterior,
    novosClientesDoisMesesAtras,
    produtosAtivos,
    novosProdutosMesAnterior,
    novosProdutosDoisMesesAtras,
  ] = await Promise.all([
    // Receita mês anterior
    db.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioMesAnterior,
          lt: inicioMesAtual,
        },
      },
      _sum: { totalAmount: true },
    }),

    // Receita dois meses atrás
    db.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioDoisMesesAtras,
          lt: inicioMesAnterior,
        },
      },
      _sum: { totalAmount: true },
    }),

    // Pedidos mês anterior
    db.order.count({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioMesAnterior,
          lt: inicioMesAtual,
        },
      },
    }),

    // Pedidos dois meses atrás
    db.order.count({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioDoisMesesAtras,
          lt: inicioMesAnterior,
        },
      },
    }),

    // Novos clientes mês anterior
    db.buyer.count({
      where: {
        createdAt: {
          gte: inicioMesAnterior,
          lt: inicioMesAtual,
        },
      },
    }),

    // Novos clientes dois meses atrás
    db.buyer.count({
      where: {
        createdAt: {
          gte: inicioDoisMesesAtras,
          lt: inicioMesAnterior,
        },
      },
    }),

    // Produtos ativos (total, sempre válido)
    db.product.count({
      where: {
        isArchived: false,
      },
    }),

    // Novos produtos mês anterior
    db.product.count({
      where: {
        createdAt: {
          gte: inicioMesAnterior,
          lt: inicioMesAtual,
        },
      },
    }),

    // Novos produtos dois meses atrás
    db.product.count({
      where: {
        createdAt: {
          gte: inicioDoisMesesAtras,
          lt: inicioMesAnterior,
        },
      },
    }),
  ]);

  const receitaAnterior = receitaDoisMesesAtras._sum.totalAmount?.toNumber() ?? 0;
  const receitaAtual = receitaMesAnterior._sum.totalAmount?.toNumber() ?? 0;

  const crescimentoReceita =
    receitaAnterior === 0 ? 100 : ((receitaAtual - receitaAnterior) / receitaAnterior) * 100;

  const tendenciaReceita = crescimentoReceita >= 0 ? "up" : "down";

  const cards: DashboardCardProps[] = [];

  // === Card 1: Receita Total ===
  cards.push({
    titulo: "Receita Total",
    valor: `R$ ${receitaAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    percentual: `${crescimentoReceita.toFixed(1)}%`,
    tendencia: tendenciaReceita,
    destaque: crescimentoReceita >= 0 ? "Receita em alta" : "Receita em queda",
    subtitulo: "Comparado ao mês anterior",
  });

  // === Card 2: Novos Clientes ===
  const crescimentoClientes =
    novosClientesDoisMesesAtras === 0
      ? 100
      : ((novosClientesMesAnterior - novosClientesDoisMesesAtras) / novosClientesDoisMesesAtras) * 100;

  const tendenciaClientes = crescimentoClientes >= 0 ? "up" : "down";

  cards.push({
    titulo: "Novos Clientes",
    valor: `${novosClientesMesAnterior}`,
    percentual: `${crescimentoClientes.toFixed(1)}%`,
    tendencia: tendenciaClientes,
    destaque: "Novos registros no mês",
    subtitulo: "Compradores cadastrados",
  });

  // === Card 3: Produtos Ativos ===
  cards.push({
    titulo: "Produtos Ativos",
    valor: `${produtosAtivos}`,
    percentual: "+0%", // valor informativo
    tendencia: "up",
    destaque: "Catálogo disponível",
    subtitulo: "Produtos prontos para venda",
  });

  // === Card 4: Novos Produtos ===
  const crescimentoProdutos =
    novosProdutosDoisMesesAtras === 0
      ? 100
      : ((novosProdutosMesAnterior - novosProdutosDoisMesesAtras) / novosProdutosDoisMesesAtras) * 100;

  const tendenciaProdutos = crescimentoProdutos >= 0 ? "up" : "down";

  cards.push({
    titulo: "Novos Produtos",
    valor: `${novosProdutosMesAnterior}`,
    percentual: `${crescimentoProdutos.toFixed(1)}%`,
    tendencia: tendenciaProdutos,
    destaque: "Expansão do catálogo",
    subtitulo: "Novos produtos adicionados",
  });

  // === Card 5: Ticket Médio ===
  const ticketMedioAtual = pedidosMesAnterior === 0 ? 0 : receitaAtual / pedidosMesAnterior;
  const ticketMedioAnterior = pedidosDoisMesesAtras === 0 ? 0 : receitaAnterior / pedidosDoisMesesAtras;

  const crescimentoTicket =
    ticketMedioAnterior === 0
      ? 100
      : ((ticketMedioAtual - ticketMedioAnterior) / ticketMedioAnterior) * 100;

  const tendenciaTicket = crescimentoTicket >= 0 ? "up" : "down";

  cards.push({
    titulo: "Ticket Médio",
    valor: `R$ ${ticketMedioAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    percentual: `${crescimentoTicket.toFixed(1)}%`,
    tendencia: tendenciaTicket,
    destaque: "Valor médio por pedido",
    subtitulo: "Comparado ao mês anterior",
  });

  return cards;
}
