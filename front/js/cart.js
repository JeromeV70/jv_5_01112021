
let reponse = {};

let xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", 'http://localhost:3000/api/products/', true);
xmlhttp.onreadystatechange = function ()
{
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{		
        let reponse = xmlhttp.responseText;
		liste_produit(reponse);
	}
}
xmlhttp.send(null);

function liste_produit(reponse) // affichage du panier
{
    reponse = JSON.parse(reponse);
    let liste = new Map();
    for (let i in reponse)
    {
        liste.set(reponse[i]._id,[reponse[i].imageUrl,reponse[i].altTxt,reponse[i].name,reponse[i].price,reponse[i].description]);
    }

    let panier = new Map(JSON.parse(localStorage.getItem("panier")));
    for (const element of panier)
	{
        const _id = element[1][0];
        const couleur = element[1][1];
        const quantite = element[1][2];

        //console.log(liste.get(_id));

        imageUrl = liste.get(_id)[0];
        _name= liste.get(_id)[2];
        price = liste.get(_id)[3];

        let article =
        `<article class="cart__item" data-id="${_id}">
            <div class="cart__item__img">
                <img src=${imageUrl} alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__titlePrice">
                    <h2>${_name}</h2>
                    <p>${price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${quantite}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantite}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        <\/article>`

        document.querySelector('#cart__items').insertAdjacentHTML("beforeend",article);
	}
}




