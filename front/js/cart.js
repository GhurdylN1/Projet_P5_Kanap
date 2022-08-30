// Ne pas faire de .reload()

initProducts();

let productsWithAllInfos = [];

function initProducts() {
    const productsFromLS = getCart();
    console.log(productsFromLS.map (e => e.color));
    productsFromLS.forEach(productFromLS => {
        fetch(`http://localhost:3000/api/products/${productFromLS.id}`)
            .then((res) => res.json())
            .then((productFromAPI) => {
                const productWithAllInfos = {};
                Object.assign(productWithAllInfos, productFromAPI)
                productWithAllInfos.color = productFromLS.color;
                productWithAllInfos.id = productWithAllInfos._id
                delete productWithAllInfos._id;
                delete productWithAllInfos.colors;
                productWithAllInfos.quantity = productFromLS.quantity;
                productsWithAllInfos.push(productWithAllInfos)
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

// //fonction de suppression d'un produit du panier prenant compte de sa quantité et de sa couleur
function removeFromCart(product) {
    let cart = getCart();
    const before = cart.length;
    cart = cart.filter((p) => !(p.id === product.id && p.color === product.color));
    saveCart(cart);
    const after = cart.length;
    productsWithAllInfos = productsWithAllInfos.filter((p) => !(p.id === product.id && p.color === product.color));
    return before !== after
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
    article.dataset.id = product.id;
    article.dataset.color = product.color;

    // article.setAttribute("data-id", `${product.id}`);
    // article.setAttribute("data-color", `${product.color}`);

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
    pItemColor.textContent = `${product.color}`;
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

    // on écoute le bouton supprimer et on appelle la fonction removeFromCart, on verifie que l'action à été effectuée et on supprime le produit du DOM puis on redemande le nombre de produit et le prix total
    pItemDelete.addEventListener("click", function() {  
        console.log(product);
        const success = removeFromCart(product);
        if (success === true) {
            console.log(article);
            article.remove();
            getNumberProduct();
            getTotalPrice();
        } 
    })

    //modification de quantité, on écoute l'input de la quantité et on appelle la fonction changeQuantity, puis on redemande le nombre de produit et le prix total
    inputItemQuantity.addEventListener("change", function() {
        changeQuantity(product, parseInt(inputItemQuantity.value));
        getNumberProduct();
        getTotalPrice();
    })
}

// to do formulaire !




