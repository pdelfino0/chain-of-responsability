interface Handler {
    handle: (carrinho: Carrinho) => void;

    addNext(handler: Handler): Handler;
}

class BaseHandler implements Handler {
    private next: Handler | null = null;


    handle(carrinho: Carrinho): void {
        if (this.next) {
            this.next.handle(carrinho);
        }
    }

    addNext(handler: Handler): Handler {
        this.next = handler;
        return handler;
    }
}

class HandlerTorraTorraInverno extends BaseHandler {
    handle(carrinho: Carrinho): void {
        carrinho.itens.forEach((item) => {
            if (item.produto.setor === 3) {
                item.produto.preco *= 0.7;
            }
        });
        super.handle(carrinho);
    }
}

class HandlerTorraTorraVerao extends BaseHandler {
    handle(carrinho: Carrinho): void {
        if (carrinho.cupons.includes("VERAO")) {
            carrinho.itens.forEach((item) => {
                if (item.produto.setor === 1) {
                    item.produto.preco *= 0.8;
                }
            });
        }
        super.handle(carrinho);
    }
}

class HandlerTorraTorraAlimentos extends BaseHandler {
    handle(carrinho: Carrinho): void {
        if (carrinho.cupons.includes("ALIMENTOS")) {
            carrinho.itens.forEach((item) => {
                if (item.produto.setor === 2) {
                    item.produto.preco *= 0.9;
                }
            });
        }
        super.handle(carrinho);
    }
}

class Produto {
    nome: string;
    preco: number;
    setor: number;

    constructor(nome: string, preco: number, setor: number) {
        this.nome = nome;
        this.preco = preco;
        this.setor = setor;
    }
}


class Item {
    produto: Produto;
    quantidade: number;

    constructor(produto: Produto, quantidade: number) {
        this.produto = produto;
        this.quantidade = quantidade;
    }
}

class Carrinho {
    itens: Item[] = [];
    cupons: string[] = [];

    constructor() {
    }

    adicionarItem(item: Item) {
        this.itens.push(item);
    }

    adicionarCupom(cupom: string) {
        this.cupons.push(cupom);
    }

    toString() {
        this.itens.forEach((item) => {
            console.log(`${item.produto.nome}: $${item.produto.preco.toFixed(2)}`);

        });
        console.log(`Total: $${this.itens.reduce((acc, item) => acc + item.produto.preco, 0).toFixed(2)}`);
    }
}


const casaco = new Produto("Casaco de Inverno", 100.0, 3);
const camiseta = new Produto("Camiseta de Verão", 50.0, 1);
const arroz = new Produto("Arroz Integral", 20.0, 3);
const feijao = new Produto("Feijão Preto", 30.0, 2);

const carrinho = new Carrinho();
carrinho.adicionarItem(new Item(casaco, 1));
carrinho.adicionarItem(new Item(camiseta, 2));
carrinho.adicionarItem(new Item(arroz, 3));
carrinho.adicionarItem(new Item(feijao, 1));

carrinho.adicionarCupom("VERAO");
carrinho.adicionarCupom("ALIMENTOS");

const handlerInverno = new HandlerTorraTorraInverno();
const handlerVerao = new HandlerTorraTorraVerao();
const handlerAlimentos = new HandlerTorraTorraAlimentos();

handlerInverno.addNext(handlerVerao).addNext(handlerAlimentos);

console.log("Before discounts:");
carrinho.toString();

handlerInverno.handle(carrinho);

console.log("After discounts:");
carrinho.toString();
