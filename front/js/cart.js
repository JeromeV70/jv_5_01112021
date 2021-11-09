
document.addEventListener('DOMContentLoaded',function(){load()});

function load() // récupération des données de l'API
{
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
}


function liste_produit(reponse) // affichage du panier
{
    document.querySelector('#cart__items').textContent='';
    document.querySelector('#totalQuantity').textContent='';
    document.querySelector('#totalPrice').textContent='';

    reponse = JSON.parse(reponse);
    let liste = new Map();
    let prixTotal = 0;
    let prixLibelle = 0
    let quantiteTotal = 0;

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

        const imageUrl = liste.get(_id)[0];
        const _name= liste.get(_id)[2];
        const prixUnitaire = liste.get(_id)[3];

        prixLibelle = (prixUnitaire*quantite);
        prixTotal = (prixTotal+parseInt(prixLibelle));
        quantiteTotal = (quantiteTotal+parseInt(quantite));

        let article =
        `<article class="cart__item" data-id="${_id}${couleur}">
            <div class="cart__item__img">
                <img src=${imageUrl} alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__titlePrice">
                    <h2>${_name} ${couleur}</h2>
                    <p>${prixLibelle} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté :</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantite}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        <\/article>`

        document.querySelector('#cart__items').insertAdjacentHTML("beforeend",article);
        document.querySelector('article[data-id="'+_id+couleur+'"] .deleteItem').addEventListener("click",function(){supprimer(_id+couleur),false});
        document.querySelector('article[data-id="'+_id+couleur+'"] .itemQuantity').addEventListener("change",function(){modifier(_id+couleur),false});
	}
    document.querySelector('#totalQuantity').insertAdjacentHTML("beforeend",quantiteTotal);
    document.querySelector('#totalPrice').insertAdjacentHTML("beforeend",prixTotal);

}

function supprimer(identifiant) // supprimer un article du panier
{
    document.querySelector('article[data-id="'+identifiant+'"]').remove();

    let panier = new Map(JSON.parse(localStorage.getItem("panier")));
    panier.delete(identifiant);
    localStorage.setItem("panier",JSON.stringify(Array.from(panier)));
    load();
}

function modifier(identifiant) // modifier la quantité d'un article du panier
{
    const newQuantite = document.querySelector('article[data-id="'+identifiant+'"] .itemQuantity').value;

    const panier = new Map(JSON.parse(localStorage.getItem("panier")));
    const tableauValeurs = panier.get(identifiant);
    tableauValeurs[2] = newQuantite;
    panier.set(identifiant,tableauValeurs);
    localStorage.setItem("panier",JSON.stringify(Array.from(panier)));
    load();
}
