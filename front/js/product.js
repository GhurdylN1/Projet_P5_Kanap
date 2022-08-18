// On appelle notre fonction pour la récupération de l'id du produit ciblé.  

getOneProduct()

// Récupération de l'id du produit dans l'api via l'url, avec location.href, on lui demande de regarder dans l'url du href pour trouver l'id voulue.
// Avec Fetch on demande une réponse en .json en précisant l'id du produit désiré de manière dynamique. 
 function getOneProduct() { 
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