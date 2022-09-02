//--Récupération des produits via l'api 

fetch("http://localhost:300/api/products") // Avec la commande "fetch" on va chercher la liste des produits via l'url de l'api.
    .then((res) => res.json()) // on demande un résultat en .json.
    .then((productsItems) => { // le résultat sera appelé productsItems, qui corespond à l'ensemble des produits de l'api, les canapés. 
        console.table(productsItems); // on demande l'affichage sous forme de tableau dans la console de productsItems. 
        displayKanapProductList(productsItems); // on appelle la fonction pour l'affichage des produits "kanapAllProductsList", qui représente la liste de tous les canapés. 
    })
    .catch((err) => { // on affiche une erreur qui modifie la page d'accueil si l'api ne réponds pas
        let errH1 = document.querySelector("h1");
        errH1.textContent = "erreur 404";
        let errH2 = document.querySelector("h2");
        errH2.textContent = "Le serveur ne réponds pas, veuillez réessayer plus tard."
        console.log("erreur 404, api introuvable :" + err);
    });

// On affiche les canapés sur la page index.html avec la fonction "kanapAll".

function displayKanapProductList(products) {
    const cardArticle = document.querySelector("#items"); // on déclare la variable pour l'affichage des canapé, "cardArticle" en précisant l'Id ciblé "items". 
    // on utilise une boucle pour l'affichage en html (en utilisant append, appendChild et setAttribute) de chaque produit de l'api en y indiquant les clés associées à chaque canapé. 
    for (let product of products) { 

        const a = document.createElement("a"); // création de l'élement html <a>
        a.setAttribute("href", `./product.html?id=${product._id}`);
        cardArticle.appendChild(a);

        const article = document.createElement("article"); // création de l'élement html <article>
        a.appendChild(article);

        const img = document.createElement("img"); // création de l'élement html <img>
        img.setAttribute("src", `${product.imageUrl}`);
        img.setAttribute("alt", `${product.altTxt}`);
        article.appendChild(img);

        const h3 = document.createElement("h3"); // création de l'élement html <h3>
        h3.textContent = `${product.name}`;
        h3.classList.add(`productName`);
        article.appendChild(h3);

        const p = document.createElement("p"); // création de l'élement html <p>
        p.textContent = `${product.description}`;
        p.classList.add(`productDescription`);
        article.appendChild(p);
    }
}