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
    return "";
  }
}

export { CaixaDaLanchonete };

const caixa = new CaixaDaLanchonete(cardapio);

const valorTotal = caixa.calcularValorDaCompra("dinheiro", ["cafe, 1"]);
console.log(valorTotal);
