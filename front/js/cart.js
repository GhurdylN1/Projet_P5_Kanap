// on lance la fonction qui va afficher notre panier

initProducts();

let productsWithAllInfos = [];

function initProducts() {
  const productsFromLS = getCart();
  checkCart();
  productsFromLS.forEach((productFromLS) => {
    fetch(`http://localhost:3000/api/products/${productFromLS.id}`)
      .then((res) => res.json())
      .then((productFromAPI) => {
        const productWithAllInfos = {};
        Object.assign(productWithAllInfos, productFromAPI);
        productWithAllInfos.color = productFromLS.color;
        productWithAllInfos.id = productWithAllInfos._id;
        delete productWithAllInfos._id;
        delete productWithAllInfos.colors;
        productWithAllInfos.quantity = productFromLS.quantity;
        productsWithAllInfos.push(productWithAllInfos);
        displayProduct(productWithAllInfos);
      })
      .catch((err) => {
        // on affiche une erreur qui modifie la page panier si l'api ne réponds pas
        let errH1 = document.querySelector("h1");
        errH1.textContent = "erreur 404";
        let errCart = document.querySelector("section");
        errCart.style.textAlign = "center";
        errCart.style.fontSize = "x-large";
        errCart.textContent = "Le serveur ne réponds pas, veuillez réessayer plus tard.";
        // console.log("Api introuvable, erreur 404 :" + err);
      });
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

// //fonction de suppression d'un produit du panier prenant compte de sa quantité et de sa couleur
function removeFromCart(product) {
  let cart = getCart();
  const before = cart.length;
  cart = cart.filter((p) => !(p.id === product.id && p.color === product.color));
  saveCart(cart);
  checkCart(); // ici on rapelle la fonction de vérification du panier dans le cas ou le dernier produit du panier soit supprimé
  const after = cart.length;
  productsWithAllInfos = productsWithAllInfos.filter((p) => !(p.id === product.id && p.color === product.color));
  return before !== after;
}

// fonction de modification de quantité prenant compte de sa couleur
function changeQuantity(product, newQuantity) {
  let cart = getCart();
  let foundProductFromLS = cart.find((p) => p.id == product.id && p.color == product.color);
  // console.log('El to update LS', foundProductFromLS)
  if (foundProductFromLS != undefined) {
    foundProductFromLS.quantity = newQuantity;
    saveCart(cart);
  }
  let foundProductWithAllInfos = productsWithAllInfos.find((p) => p.id == product.id && p.color == product.color);
  // console.log('El to update all infos', foundProductWithAllInfos)
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
  inputItemQuantity.setAttribute("max", "100");
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
  pItemDelete.addEventListener("click", function () {
    // console.log(product);
    const success = removeFromCart(product);
    if (success === true) {
      // console.log(article);
      article.remove();
      getNumberProduct();
      getTotalPrice();
    }
  });

  // modification de quantité, on écoute l'input de la quantité et on appelle la fonction changeQuantity, puis on redemande le nombre de produit et le prix total
  inputItemQuantity.addEventListener("focus", (event) => {
    inputItemQuantity.oldValue = event.target.value;
  });
  // ici on veut que lorsque une valeur comme -40 est tapée par l'utilisateur, elle ne soit pas prise en compte et que l'ancienne valeur soit réaffichée
  // et dans le cas ou l'utilisateur tape 0, une alerte lui demandera si il veut vraiment supprimer cet article en cliquant sur ok
  inputItemQuantity.addEventListener("change", function () {
    const quantityValue = parseInt(inputItemQuantity.value);
    if (quantityValue === 0) {
      if (confirm("Cet article va être supprimé")) {
        const article = inputItemQuantity.closest("article");// ici on selection l'element du DOM qu'on veut supprimer
        const success = removeFromCart(product);
        if (success === true) {
          article.remove();// on retire du DOM l'element article du produit supprimé
        }
      } else {
        inputItemQuantity.value = inputItemQuantity.oldValue;
        return;
      }
    } else if (quantityValue < 1) {
      inputItemQuantity.value = inputItemQuantity.oldValue;
      return;
    }
    changeQuantity(product, quantityValue);
    console.log("getNumberProduct");
    getNumberProduct();
    getTotalPrice();
  });
}

// Formulaire

//déclaration des variables/regex pour la conformité demandée
let regexFirstName = new RegExp("^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ'\\s-]{3,}$","i"); // ici on veut une saisie ne comportant pas de chiffre et au moins 3 lettres min/maj
let regexLastName = new RegExp("^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ'\\s-]{3,}$","i");
let regexCity = new RegExp("^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ'\\s-]{3,}$","i");
let regexAddress = new RegExp("[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ'\\s-]{7,}$","i"); // pour l'adresse on accepte les chiffres et on veut au moins 7 lettres
// pour l'email on accepte min/maj en lettres, les chiffres, le ".", "-" et "_", 
// un seul "@"" puis encore min/maj et chiffres et ".-_", puis un seul "." et uniquement les min pour le NDD de 2 à 4 caractères
let regexEmail = new RegExp("^[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,4}$","g");

// verification des données rentrées par l'utilisateur, si elles sont conformes aux regex
function checkUserDataInput() {
  const userFirstname = document.getElementById("firstName").value;
  const userLastname = document.getElementById("lastName").value;
  const userAddress = document.getElementById("address").value;
  const userEmail = document.getElementById("email").value;
  const userCity = document.getElementById("city").value;
  if (
    !(
      regexFirstName.test(userFirstname) &&
      regexLastName.test(userLastname) &&
      regexAddress.test(userAddress) &&
      regexCity.test(userCity) &&
      regexEmail.test(userEmail)
    )
  ) {
    return false;
  } else {
    return true;
  }
}

// faire une fonction d'affichage des erreurs de saisies utilisateur
function errorDisplay(input, ErrorMsg, regex, type, required) {
  ErrorMsg = document.querySelector(`#${ErrorMsg}`);
  // console.log(errorDisplay);
  if (input == "") {
    ErrorMsg.textContent = `Renseignez ${type}`;
    ErrorMsg.style.display = "block";
  } else if (!regex.test(input)) {
    ErrorMsg.textContent = `Renseignez ${type} ${required}`;
    ErrorMsg.style.display = "block";
  } else if (regex.test(input)) {
    ErrorMsg.textContent = "";
    ErrorMsg.style.display = "none";
  }
}

// faire une fonction qui vérifie au click sur "commander!" toutes les infos saisies  grace a "checkUserDataInput" et si "true" appelle la fonction de confirmation du panier
const orderConfirmationButton = document.querySelector("#order");
orderConfirmationButton.addEventListener("click", async (e) => {
  const checkVerification = checkUserDataInput();
  const checkCartValidation = await checkCart();
  e.preventDefault();
  if (checkVerification && !checkCartValidation) {
    userCartConfirm();
  } else if (!checkVerification) {
    let userFirstNameInput = document.getElementById("firstName");
    errorDisplay(userFirstNameInput.value, "firstNameErrorMsg", regexFirstName, "votre Prénom (sans chiffres)", "d'au moins 3 lettres");
    let userLastNameInput = document.getElementById("lastName");
    errorDisplay(userLastNameInput.value, "lastNameErrorMsg", regexLastName, "votre Nom (sans chiffres)", "d'au moins 3 lettres");
    let userAddressInput = document.getElementById("address");
    errorDisplay(userAddressInput.value, "addressErrorMsg", regexAddress, "votre adresse", "d'au moins 7 caractères");
    let userCityInput = document.getElementById("city");
    errorDisplay(userCityInput.value, "cityErrorMsg", regexCity, "votre ville", "d'au moins 3 lettres");
    let userEmailInput = document.getElementById("email");
    errorDisplay(userEmailInput.value, "emailErrorMsg", regexEmail, "une adresse mail valide", "exemple: test@test.com");
  }
});

// confirmation du panier et validation puis redirection sur la page confirmation.html
function userCartConfirm() {
  const productsInLS = getCart();
  // on veux ici uniquement les id des produits
  const newProducts = productsInLS.map((item) => {
    return item.id;
  });
  const userOrder = {
    contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      email: document.getElementById("email").value,
      city: document.getElementById("city").value,
    },
    products: newProducts,
  };

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(userOrder),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      location.href = `confirmation.html?id=${data.orderId}`;
    });
}
// fonction de vérification du panier si il est vide ou pas, et on désactive l'affichage du bouton de confirmation.
async function checkCart() {
  const productsInCart = await getCart();
  const cartProducts = document.getElementById("cart__items");
  if (productsInCart.length == 0) {
    cartProducts.style.textAlign = "center";
    cartProducts.style.fontSize = "x-large";
    cartProducts.textContent = "Votre panier ne contient aucun article";
    let hideCartPrice = document.getElementsByClassName("cart__price")[0];
    hideCartPrice.style.display = "none";
    let hideCartForm = document.getElementsByClassName("cart__order")[0];
    hideCartForm.style.display = "none";
    let hideBtnConfirm = document.getElementById("order");
    hideBtnConfirm.style.display = "none";
    return true;
  }
}
