let url = new URL(window.location.href);
let _id = url.searchParams.get("id");
let reponse = {};

let xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", 'http://localhost:3000/api/products/'+_id, true);
xmlhttp.onreadystatechange = function ()
{
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{		
        let reponse = xmlhttp.responseText;
		afficheProduit(reponse);
	}
}
xmlhttp.send(null);

function afficheProduit(reponse) // afficher les caractéristiques du produit
{
	reponse = JSON.parse(reponse);

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
}

document.querySelector('#addToCart').addEventListener('click',function(){ajouter(),false});

function ajouter() // Ajout au panier lors du clic sur le bouton ajouter
{
    const couleur = document.querySelector('#colors').value;
    const quantite = document.querySelector('#quantity').value;

    let panier = new Map(JSON.parse(localStorage.getItem("panier")));
    panier.set(_id+couleur,[_id,couleur,quantite]);

    localStorage.setItem("panier",JSON.stringify(Array.from(panier)));

    //console.log(panier);
}
