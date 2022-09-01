// On appelle notre fonction pour la récupération de l'id du produit ciblé.  

getOneProductId()

// Récupération de l'id du produit dans l'api via l'url, avec location.href, on lui demande de regarder dans l'url du href pour trouver l'id voulue.
// Avec Fetch on demande une réponse en .json en précisant l'id du produit désiré de manière dynamique. 
 function getOneProductId() { 
  const oneProductId = new URL(location.href).searchParams.get("id");

  fetch(`http://localhost:3000/api/products/${oneProductId}`)
  .then((res) => res.json())
  .then((product) => {
    console.log(product)
    displayProduct(product);
  }) 
}

// Fonction d'affichage du produit et des ses caractéristiques, création de variables item**** corespondant aux differents attributs du produit (img, content,...)

function displayProduct(product) {
  
  document.title = `${product.name}`; //--on donne un titre à la page produit

  const itemImg = document.querySelector(".item__img"); // on demande a selectionner la classe ".item__img" de la page product.html avec un querySelector 
  const img = document.createElement("img");// et ensuite création de l'element html "img" avec sa source src et son alt
  img.setAttribute("src", `${product.imageUrl}`);
  img.setAttribute("alt", `${product.altTxt}`);
  itemImg.appendChild(img);

  const itemContent = document.querySelector(".item__content__titlePrice");// comme précedement, meme méthode pour l'element h1 concernant le nom du produit
  const h1 = document.createElement("h1");
  h1.textContent = `${product.name}`;
  itemContent.appendChild(h1);

  const itemPrice = document.querySelector("#price");// comme précedement, meme méthode concernant le prix du produit
  itemPrice.textContent = `${product.price}`;

  const itemDescription = document.querySelector("#description");// comme précedement, meme méthode concernant la description du produit
  itemDescription.textContent = `${product.description}`;

  const select = document.querySelector("select");// meme méthode de selection avec query ici
  for (let color of product.colors) {// Et création d'une boucle pour l'affichage des differentes couleurs renseignées dans l'api de notre produit => "product.colors"
    const option = document.createElement("option");
    option.textContent = color;
    option.value = color;
    select.appendChild(option);
  }
}


// Sauvegarder les choix dans le Local Storage

const buttonValidation = document.querySelector("#addToCart"); // on selection le bouton de la page product.html

buttonValidation.addEventListener("click", addToLocalStorage); // au click sur le bouton, on execute la fonction d'ajout au local storage

function saveProductToLocalStorage(product) { // on aura besoin d'une fonction de sauvegarde des choix en fin de fonction pour enregistrer le panier, ici "cart" en chaine de caractères.
  return localStorage.setItem("cart", JSON.stringify(product));
}

function getActualProductInLocalStorage() { // fonction pour recuperer des produits du panier "cart" déjà existants dans le local storage, s'il n'y en a pas, on aura un tableau vide
  let product = JSON.parse(localStorage.getItem("cart"));
  if (product == null) {
    return [];
  } else {
    return product;
  }
}

const idProduct = new URL(location.href).searchParams.get("id"); // récupération de l'id pour le local storage

async function getProductId() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${idProduct}`
    );
    const body = await response.json();
    return body;
  } catch (e) {
    alert("Il semblerait que notre serveur fasse une sieste, merci de réessayer plus tard")
  }
}

async function addToLocalStorage() {
  const product = await getProductId();// on attends la réponse de la fonction pour la récupération de l'id du produit dans l'api
  const colorSelect = document.querySelector("select"); // on veut récuperer le choix de la couleur
  const quantityImput = document.querySelector("#quantity"); // on veut récuperer la quantité choisie
  const productItemData = { // on met les données du produit dans un array pour l'affichage dans le local storage
    id: product._id,
    color: colorSelect.value,
    quantity : parseInt(quantityImput.value), // parseInt permet d'ajouter chaque nouvelle valeur, sinon la valeur se rajoute à la suite de la nouvelle (au lieu de (1+4 = 5) on aurait 1+4 => 14)
  };
  let productChoice = getActualProductInLocalStorage(); // grace a la fonction on demande s'il trouve ce produit dans le local storage et on recherche avec "find"
  let productChoiceFind = productChoice.find((item) => { 
    return item.id == product._id && item.color == colorSelect.value;
  });
  if ((quantityImput.value < 1 || quantityImput.value > 100) && colorSelect.value == "") { // on veut afficher une fenetre d'alerte si la couleur et/ou la quantité n'est pas renseignée
    alert ("Veuillez choisir une couleur et une quantité comprise entre 1 et 100");
  } else if (quantityImput.value < 1 || quantityImput.value > 100) {
    alert ("Veuillez choisir une quantité comprise entre 1 et 100");
  } else if (colorSelect.value =="") {
    alert ("Veuillez choisir une couleur");
  } else {
    alert (`Le canapé ${product.name} a été ajouté au panier en ${quantityImput.value} exemplaire(s) `); // sinon on affiche que le produit à bien été ajouté au panier
    if (!productChoiceFind) { // si ce produit n'est pas déja dans le panier alors on l'ajoute. 
      productChoice.push(productItemData);
    } else if (productChoiceFind) { // si il est déjà présent avec la meme couleur alors on ajoute seulement sa quantité
      productChoiceFind.quantity += parseInt(quantityImput.value);
    } else if (productChoiceFind && productChoiceFind.color != colorSelect.value) { // si il est déjà présent mais d'une couleur différente alors on l'ajoute
      productChoice.push(productItemData);
    }
    saveProductToLocalStorage(productChoice);
  }
}

