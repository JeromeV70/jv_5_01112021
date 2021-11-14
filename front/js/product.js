let url = new URL(window.location.href);
let _id = url.searchParams.get("id");
let reponse = {};

fetch("http://localhost:3000/api/products/"+_id)
    .then(function(reponse){if (reponse.ok){return reponse.json();}})
        .catch(function(erreur){alert(erreur+"\n\nLe serveur ne répond pas");})
    .then(function(reponse){afficheProduit(reponse);})

// afficher les caractéristiques du produit
function afficheProduit(reponse) 
{
    const img = `<img src=${reponse.imageUrl} alt=${reponse.altTxt}/>`;

    document.querySelector('.item__img').insertAdjacentHTML("beforeend",img);
    document.querySelector('#title').insertAdjacentHTML("beforeend",reponse.name);
    document.querySelector('#price').insertAdjacentHTML("beforeend",reponse.price);
    document.querySelector('#description').insertAdjacentHTML("beforeend",reponse.description);

    for (let couleur of reponse.colors)
    {
        const option = `<option value=${couleur}>${couleur}</option>`;
        document.querySelector('#colors').insertAdjacentHTML("beforeend",option);
    }

    document.querySelector('#addToCart').addEventListener('click',function(){ajouter(),false});
    document.querySelector('#colors').addEventListener('click',function(){quantite(),false});
    document.querySelector('#colors').addEventListener("keyup",function(){quantite(),false});
}

// afficher la quantité déja ajoutée au panier
function quantite()
{
    const couleur = document.querySelector('#colors').value;
    let panier = {};
    panier = new Map(JSON.parse(localStorage.getItem("panier")))

    if(panier.has(_id+couleur))
        {
            document.querySelector('#quantity').value = panier.get(_id+couleur)[2];
        }
    else
        {
            document.querySelector('#quantity').value = 0;
        }
}

// Ajout au panier lors du clic sur le bouton ajouter
function ajouter() 
{
    const couleur = document.querySelector('#colors').value;
    const quantite = document.querySelector('#quantity').value;

    // vérification couleur définie et quantité non nulle
    if(couleur!==''&&quantite>=1)
        {
            let panier = new Map(JSON.parse(localStorage.getItem("panier")));
            panier.set(_id+couleur,[_id,couleur,quantite]);
            localStorage.setItem("panier",JSON.stringify(Array.from(panier)));
            window.location.href="cart.html";
        }
    else{alert("Choisir une couleur et une quantité !");}
}
