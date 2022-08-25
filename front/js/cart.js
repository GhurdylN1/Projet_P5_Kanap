// Ne pas faire de .reload()

iniProducts();

let productsWithAllInfos = [];

function iniProducts() {
    let productsFormLS = getCart();
    productsFormLS.forEach(productFromLS => {
        fetch(`http://localhost:3000/api/products/${productFromLS.id}`)
            .then((res) => res.json())
            .then((productFromAPI) => {
                let productWithAllInfos = {};
                Object.assign(productWithAllInfos, productFromAPI)
                productWithAllInfos.color = productFromLS.color;
                delete productWithAllInfos.colors
                productWithAllInfos.id = productWithAllInfos._id
                delete productWithAllInfos._id;
                productsWithAllInfos.push(productWithAllInfos)
                console.log(productWithAllInfos)
                displayProduct(productWithAllInfos);
            })
    });
}

// Sauvegarde du panier "cart"
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// fonction d'appel du panier, si il est null retourne un panier vide, sinon retourne le panier sauvegardé au dessus.
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

// fonction d'ajout d'un produit au panier et gestion de la quantité et de la couleur
function addCart(product) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id && p.color == product.color);
    if (foundProduct != undefined) {
        foundProduct.quantity++;
    } else {
        product.quantity = 1
        cart.push(product);
    }
    saveCart(cart);
}

// fonction de retrait d'un produit du panier prenant compte de sa quantité et de sa couleur
function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter(p => p.id != product.id && p.color != product.color);
    saveCart(cart);
    productsWithAllInfos = productsWithAllInfos.filter(p => p.id != product.id && p.color != product.color);
}

// fonction de modification de quantité prenant compte de sa couleur
function changeQuantity(product, newQuantity) {
    let cart = getCart();
    let foundProductFromLS = cart.find(p => p.id == product.id && p.color == product.color);
    console.log('El to update LS', foundProductFromLS)
    if (foundProductFromLS != undefined) {
        foundProductFromLS.quantity = newQuantity;
        saveCart(cart);
    }
    let foundProductWithAllInfos = productsWithAllInfos.find(p => p.id == product.id && p.color == product.color);
    console.log('El to update all infos', foundProductWithAllInfos)
    if (foundProductWithAllInfos != undefined) {
        foundProductWithAllInfos.quantity = newQuantity;
    }
}

//calcul de quantité de produits dans le panier
function getNumberProduct() {
    let number = 0;
    for (let product of productsWithAllInfos) {
        number += product.quantity;
    }
    return number;
}

//calcul du prix total
function getTotalPrice() {
    let total = 0;
    for (let product of productsWithAllInfos) {
        total += product.quantity * product.price;
    }
    return total;

}

function displayProduct(product) {
    const cartItem = document.querySelector("#cart__items");
// Création des differents élément html qu'on veut afficher dans le DOM dans une balise "article"
const article = document.createElement("article");
article.setAttribute("class", "cart__item");
article.setAttribute("data-id", `${product.id}`);
article.setAttribute("data-color", `${product.color}`);
cartItem.appendChild(article);

// Image du produit
const cartItemImg = document.createElement("div");
cartItemImg.setAttribute("class", "cart__item__img");
const img = document.createElement("img");
img.setAttribute("src", `${product.imageUrl}`);
img.setAttribute("alt", `${product.altTxt}`);
article.appendChild(cartItemImg);
cartItemImg.appendChild(img);

// TODO: Autres elements
}



