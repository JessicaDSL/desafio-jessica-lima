const cardapio = {
  cafe: 3.0,
  chantily: 1.5,
  suco: 6.2,
  sanduiche: 6.5,
  queijo: 2,
  salgado: 7.25,
  combo1: 9.5,
  combo2: 7.5,
};

class CaixaDaLanchonete {
  constructor(cardapio) {
    this.cardapio = cardapio;

    this.formasDePagamento = {
      dinheiro: 0.95,
      credito: 1.03,
      debito: 1.0,
    };
  }

  calcularValorDaCompra(metodoDePagamento, itens) {
    const valores = itens.map((item) => {
      const [codigo, quantidade] = item.split(",");
      const valorItem = cardapio[codigo];

      if (!valorItem) {
        return "Item inválido!";
      }

      if (quantidade <= 0) {
        return "Quantidade inválida!";
      }

      return valorItem * quantidade;
    });

    if (valores.includes("Item inválido!")) {
        return "Item inválido!";
    }
  
    if (itens.length === 0) {
        return "Não há itens no carrinho de compra!";
    }
  
    if (itens.length === 1 && (itens[0].startsWith('chantily') || itens[0].startsWith('queijo'))) {
        return "Item extra não pode ser pedido sem o principal";
    }
  
    if (metodoDePagamento && !this.formasDePagamento[metodoDePagamento]) {
        return "Forma de pagamento inválida!";
    }

    return "";
  }
}

export { CaixaDaLanchonete };

const caixa = new CaixaDaLanchonete(cardapio);

const valorTotal = caixa.calcularValorDaCompra("dinheiro", ["cafe, 1"]);
console.log(valorTotal);
