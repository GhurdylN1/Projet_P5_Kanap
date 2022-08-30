// Ne pas faire de .reload()

initProducts();

let productsWithAllInfos = [];

function initProducts() {
    let productsFromLS = getCart();
    productsFromLS.forEach(productFromLS => {
        fetch(`http://localhost:3000/api/products/${productFromLS.id}`)
            .then((res) => res.json())
            .then((productFromAPI) => {
                let productWithAllInfos = {};
                Object.assign(productWithAllInfos, productFromAPI)
                productWithAllInfos.colors = productFromLS.color;
                productWithAllInfos.id = productWithAllInfos._id
                delete productWithAllInfos._id;
                productWithAllInfos.quantity = productFromLS.quantity;
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

//fonction de suppression d'un produit du panier prenant compte de sa quantité et de sa couleur (elle fonctionnait mais supprime le produit avec le meme id sans prendre en compte la couleur)
function removeFromCart(product) {
   let cart = getCart();
   cart = cart.filter((p) => p.id != product.id && p.color != product.color);
   console.log(cart);
   saveCart(cart);
   productsWithAllInfos = productsWithAllInfos.filter((p) => p.id != product.id && p.color != product.color);    
}

// //function removeFromCart() {  // finalement ça marche pas non plus..... il cible au click un autre poduit que celui clické aléatoirement et le supprime.... 
//     let pItemDelete = document.getElementsByClassName("deleteItem"); 
//     console.log(pItemDelete)
//     let products = getCart()

//     for (let i = 0 ; i < pItemDelete.length ; i++) {
//         pItemDelete[i].addEventListener("click", (e) => {
//             console.log(e)
//             let pItemDeleteProductId = products[i].id
//             let pItemDeleteProductColor = products[i].color
//             console.log(pItemDeleteProductId)
//             console.log(pItemDeleteProductColor)

//             products = products.filter((p) => p.id != pItemDeleteProductId || p.color != pItemDeleteProductColor);
//             console.log(products)

//             localStorage.setItem("cart", JSON.stringify(products));

//             //window.location.href = "cart.html";

//         })
//     }
// }

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
    let cart = getCart();
    let number = 0;
    for (let product of cart) {
        number += product.quantity;
    }
    const totalProductQuantity = document.querySelector("#totalQuantity");
        totalProductQuantity.textContent = number;
        saveCart(cart);
    
}

//calcul du prix total
function getTotalPrice() {
    let cart = getCart();
    let total = 0;
    for (let product of productsWithAllInfos) {
        total += product.quantity * product.price;
    }
    const totalProductPrice = document.querySelector("#totalPrice");
	totalProductPrice.textContent = total;
	saveCart(cart);

}

function displayProduct(product) {
    const cartItem = document.querySelector("#cart__items");
    // Création des differents élément html qu'on veut afficher dans le DOM dans une balise "article"
    const article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", `${product.id}`);
    article.setAttribute("data-color", `${product.colors}`);

    cartItem.appendChild(article);

    // Image du produit
    const cartItemImg = document.createElement("div");
    cartItemImg.setAttribute("class", "cart__item__img");
    const img = document.createElement("img");
    img.setAttribute("src", `${product.imageUrl}`);
    img.setAttribute("alt", `${product.altTxt}`);

    article.appendChild(cartItemImg);
    cartItemImg.appendChild(img);

    //Description du produit, nom + couleur + prix
    const cartItemContent = document.createElement("div");
    cartItemContent.setAttribute("class", "cart__item__content");
    const cartItemContentDescription = document.createElement("div");
    cartItemContentDescription.setAttribute("class", "cart__item__content__description");
    const h2ItemDescription = document.createElement("h2");
    h2ItemDescription.setAttribute("class", "name");
    h2ItemDescription.textContent = `${product.name}`;
    const pItemColor = document.createElement("p");
    pItemColor.setAttribute("class", "color");
    pItemColor.textContent = `${product.colors}`;
    const pItemPrice = document.createElement("p");
    pItemPrice.setAttribute("class", "price");
    pItemPrice.textContent = `${product.price} €`;

    article.appendChild(cartItemContent);
    cartItemContent.appendChild(cartItemContentDescription);
    cartItemContentDescription.appendChild(h2ItemDescription);
    cartItemContentDescription.appendChild(pItemColor);
    cartItemContentDescription.appendChild(pItemPrice);

    //Quantité
    const cartItemContentSettings = document.createElement("div");
    cartItemContentSettings.setAttribute("class", "cart__item__content__settings");
    const cartItemContentSettingsQuantity = document.createElement("div");
    cartItemContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
    const pItemQuantity = document.createElement("p");
    pItemQuantity.textContent = "Qté : ";
    const inputItemQuantity = document.createElement("input");
    inputItemQuantity.setAttribute("type", "number");
    inputItemQuantity.setAttribute("class", "itemQuantity");
    inputItemQuantity.setAttribute("name", "itemQuantity");
    inputItemQuantity.setAttribute("min", "1");
    inputItemQuantity.setAttribute("max", "100")
    inputItemQuantity.setAttribute("value", `${product.quantity}`);

    cartItemContent.appendChild(cartItemContentSettings);
    cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
    cartItemContentSettingsQuantity.appendChild(pItemQuantity);
    cartItemContentSettingsQuantity.appendChild(inputItemQuantity);

    // Suppression
    const cartItemDelete = document.createElement("div");
    cartItemDelete.setAttribute("class", "cart__item__content__settings__delete");
    const pItemDelete = document.createElement("p");
    pItemDelete.setAttribute("class", "deleteItem");
    pItemDelete.textContent = "Supprimer";

    cartItemContentSettings.appendChild(cartItemDelete);
    cartItemDelete.appendChild(pItemDelete);

    
    getNumberProduct();
    getTotalPrice();

    pItemDelete.addEventListener("click", function() {  // comme écrit plus haut, elle fonctionnait mais ne prenait pas en compte la couleur du produit et supprime tous les produits ayant la meme id
        console.log(pItemDelete);
        removeFromCart(product);
        //window.location.href = "cart.html";
    })
}



