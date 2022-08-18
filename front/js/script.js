//--Récupération des produits via l'api de Bilal

fetch("http://localhost:3000/api/products") //--Avec la commande "fetch" on va chercher la liste des produits via l'url de l'api.
    .then((res) => res.json()) //--on demande un résultat en .json.
    .then((productsItems) => { //--le résultat sera appelé productsItems, qui corespond à l'ensemble des produits de l'api, les canapés. 
        console.table(productsItems); //--on demande l'affichage sous forme de tableau dans la console de productsItems. 
        kanapAllProductsList(productsItems); //-- on appelle la fonction pour l'affichage des produits "kanapAllProductsList", qui représente la liste de tous les canapés. 
    })

//--On affiche les canapés sur la page index.html avec la fonction "kanapAll".

function kanapAllProductsList(products) {
    let cardArticle = document.querySelector("#items"); //--on déclare la variable pour l'affichage des canapé, "cardArticle" en précisant l'Id ciblé "items". 
    //--on utilise une boucle pour l'affichage en html (en utilisant append, appendChild et setAttribute) de chaque produit de l'api en y indiquant les clés associées à chaque canapé. 
    for (let product of products) { 

        let a = document.createElement("a"); //--création de l'élement html <a>
        a.setAttribute("href", `./product.html?id=${product._id}`);
        cardArticle.appendChild(a);

        let article = document.createElement("article"); //--création de l'élement html <article>
        a.appendChild(article);

        let img = document.createElement("img"); //--création de l'élement html <img>
        img.setAttribute("src", `${product.imageUrl}`);
        img.setAttribute("alt", `${product.altTxt}`);
        article.appendChild(img);

        let h3 = document.createElement("h3"); //--création de l'élement html <h3>
        h3.textContent = `${product.name}`;
        h3.setAttribute("class", `productName`);
        article.appendChild(h3);

        let p = document.createElement("p"); //--création de l'élement html <p>
        p.textContent = `${product.description}`;
        p.setAttribute("class", `productDescription`);
        article.appendChild(p);
    }
}





