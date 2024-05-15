"use strict";
class BaseHandler {
    constructor() {
        this.next = null;
    }
    handle(carrinho) {
        if (this.next) {
            this.next.handle(carrinho);
        }
    }
    addNext(handler) {
        this.next = handler;
        return handler;
    }
}
class HandlerTorraTorraInverno extends BaseHandler {
    handle(carrinho) {
        carrinho.itens.forEach((item) => {
            if (item.produto.setor === 3) {
                item.produto.preco *= 0.7;
            }
        });
        super.handle(carrinho);
    }
}
class HandlerTorraTorraVerao extends BaseHandler {
    handle(carrinho) {
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
    handle(carrinho) {
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
    constructor(nome, preco, setor) {
        this.nome = nome;
        this.preco = preco;
        this.setor = setor;
    }
}
class Item {
    constructor(produto, quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
    }
}
class Carrinho {
    constructor() {
        this.itens = [];
        this.cupons = [];
    }
    adicionarItem(item) {
        this.itens.push(item);
    }
    adicionarCupom(cupom) {
        this.cupons.push(cupom);
    }
    toString() {
        this.itens.forEach((item) => {
            console.log(`${item.produto.nome}: $${item.produto.preco.toFixed(2)}`);
        });
        console.log(`Total: $${this.itens.reduce((acc, item) => acc + item.produto.preco, 0).toFixed(2)}`);
    }
}
// Assume all the classes and handlers are defined as per your code above
// Initialize products
const casaco = new Produto("Casaco de Inverno", 100.0, 3); // Setor 3: Winter clothes
const camiseta = new Produto("Camiseta de Verão", 50.0, 1); // Setor 1: Summer clothes
const arroz = new Produto("Arroz Integral", 20.0, 3); // Mistakenly marked as sector 3, should be 2 for testing
const feijao = new Produto("Feijão Preto", 30.0, 2); // Setor 2: Food
// Initialize cart and add products
const carrinho = new Carrinho();
carrinho.adicionarItem(new Item(casaco, 1));
carrinho.adicionarItem(new Item(camiseta, 2));
carrinho.adicionarItem(new Item(arroz, 3));
carrinho.adicionarItem(new Item(feijao, 1));
// Add relevant coupons
carrinho.adicionarCupom("VERAO");
carrinho.adicionarCupom("ALIMENTOS");
// Initialize handlers and chain them
const handlerInverno = new HandlerTorraTorraInverno();
const handlerVerao = new HandlerTorraTorraVerao();
const handlerAlimentos = new HandlerTorraTorraAlimentos();
handlerInverno.addNext(handlerVerao).addNext(handlerAlimentos);
// Execute the chain
console.log("Before discounts:");
carrinho.toString();
handlerInverno.handle(carrinho);
// Output results to verify correct application of discounts
console.log("After discounts:");
carrinho.toString();
