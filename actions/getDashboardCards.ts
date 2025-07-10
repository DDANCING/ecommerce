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

  // Datas de referência até o mesmo dia
  const inicioMesAtual = startOfMonth(now);
  const fimMesAtual = now;

  const inicioMesAnterior = startOfMonth(subMonths(now, 1));
  const fimMesAnterior = subMonths(now, 1);

  const inicioDoisMesesAtras = startOfMonth(subMonths(now, 2));
  const fimDoisMesesAtras = subMonths(now, 2);

  // --- Consultas paralelas ---
  const [
    receitaAtual,
    receitaMesAnterior,
    receitaDoisMesesAtras,
    pedidosAtual,
    pedidosMesAnterior,
    pedidosDoisMesesAtras,
    novosClientesAtual,
    novosClientesMesAnterior,
    novosClientesDoisMesesAtras,
    produtosAtivos,
    novosProdutosAtual,
    novosProdutosMesAnterior,
    novosProdutosDoisMesesAtras,
  ] = await Promise.all([
    // Receita mês atual
    db.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioMesAtual,
          lte: fimMesAtual,
        },
      },
      _sum: { totalAmount: true },
    }),

    // Receita mês anterior até o mesmo dia
    db.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior,
        },
      },
      _sum: { totalAmount: true },
    }),

    // Receita dois meses atrás até o mesmo dia
    db.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioDoisMesesAtras,
          lte: fimDoisMesesAtras,
        },
      },
      _sum: { totalAmount: true },
    }),

    // Pedidos mês atual
    db.order.count({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioMesAtual,
          lte: fimMesAtual,
        },
      },
    }),

    db.order.count({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior,
        },
      },
    }),

    db.order.count({
      where: {
        isPaid: true,
        createdAt: {
          gte: inicioDoisMesesAtras,
          lte: fimDoisMesesAtras,
        },
      },
    }),

    // Clientes atuais
    db.buyer.count({
      where: {
        createdAt: {
          gte: inicioMesAtual,
          lte: fimMesAtual,
        },
      },
    }),

    db.buyer.count({
      where: {
        createdAt: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior,
        },
      },
    }),

    db.buyer.count({
      where: {
        createdAt: {
          gte: inicioDoisMesesAtras,
          lte: fimDoisMesesAtras,
        },
      },
    }),

    // Produtos ativos
    db.product.count({
      where: {
        isArchived: false,
      },
    }),

    db.product.count({
      where: {
        createdAt: {
          gte: inicioMesAtual,
          lte: fimMesAtual,
        },
      },
    }),

    db.product.count({
      where: {
        createdAt: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior,
        },
      },
    }),

    db.product.count({
      where: {
        createdAt: {
          gte: inicioDoisMesesAtras,
          lte: fimDoisMesesAtras,
        },
      },
    }),
  ]);

  const cards: DashboardCardProps[] = [];

  // === Receita Total ===
  const mediaReceitaAnterior = ((receitaMesAnterior._sum.totalAmount?.toNumber() ?? 0) +
    (receitaDoisMesesAtras._sum.totalAmount?.toNumber() ?? 0)) / 2;

  const valorReceitaAtual = receitaAtual._sum.totalAmount?.toNumber() ?? 0;
  const crescimentoReceita = mediaReceitaAnterior === 0 ? 100 : ((valorReceitaAtual - mediaReceitaAnterior) / mediaReceitaAnterior) * 100;
  const tendenciaReceita = crescimentoReceita >= 0 ? "up" : "down";

  cards.push({
    titulo: "Receita Total",
    valor: `R$ ${valorReceitaAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    percentual: `${crescimentoReceita.toFixed(1)}%`,
    tendencia: tendenciaReceita,
    destaque: crescimentoReceita >= 0 ? "Receita em alta" : "Receita em queda",
    subtitulo: "Comparado à média dos 2 meses anteriores",
  });

  // === Novos Clientes ===
  const mediaClientesAnterior = (novosClientesMesAnterior + novosClientesDoisMesesAtras) / 2;
  const crescimentoClientes = mediaClientesAnterior === 0 ? 100 : ((novosClientesAtual - mediaClientesAnterior) / mediaClientesAnterior) * 100;
  const tendenciaClientes = crescimentoClientes >= 0 ? "up" : "down";

  cards.push({
    titulo: "Novos Clientes",
    valor: `${novosClientesAtual}`,
    percentual: `${crescimentoClientes.toFixed(1)}%`,
    tendencia: tendenciaClientes,
    destaque: "Novos registros no mês",
    subtitulo: "Comparado à média anterior",
  });

  // === Produtos Ativos ===
  cards.push({
    titulo: "Produtos Ativos",
    valor: `${produtosAtivos}`,
    percentual: "",
    tendencia: "up",
    destaque: "Catálogo disponível",
    subtitulo: "Produtos prontos para venda",
  });

  // === Novos Produtos ===
  const mediaProdutosAnterior = (novosProdutosMesAnterior + novosProdutosDoisMesesAtras) / 2;
  const crescimentoProdutos = mediaProdutosAnterior === 0 ? 100 : ((novosProdutosAtual - mediaProdutosAnterior) / mediaProdutosAnterior) * 100;
  const tendenciaProdutos = crescimentoProdutos >= 0 ? "up" : "down";

  cards.push({
    titulo: "Novos Produtos",
    valor: `${novosProdutosAtual}`,
    percentual: `${crescimentoProdutos.toFixed(1)}%`,
    tendencia: tendenciaProdutos,
    destaque: "Expansão do catálogo",
    subtitulo: "Novos produtos adicionados",
  });

  // === Ticket Médio ===
  const ticketMedioAtual = pedidosAtual === 0 ? 0 : valorReceitaAtual / pedidosAtual;
  const ticketMedioAnterior = ((receitaMesAnterior._sum.totalAmount?.toNumber() ?? 0) + (receitaDoisMesesAtras._sum.totalAmount?.toNumber() ?? 0)) /
    ((pedidosMesAnterior + pedidosDoisMesesAtras) || 1);

  const crescimentoTicket =
    ticketMedioAnterior === 0 ? 100 : ((ticketMedioAtual - ticketMedioAnterior) / ticketMedioAnterior) * 100;
  const tendenciaTicket = crescimentoTicket >= 0 ? "up" : "down";

  cards.push({
    titulo: "Ticket Médio",
    valor: `R$ ${ticketMedioAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    percentual: `${crescimentoTicket.toFixed(1)}%`,
    tendencia: tendenciaTicket,
    destaque: "Valor médio por pedido",
    subtitulo: "Comparado à média anterior",
  });

  return cards;
}
