
// si url de la page panier, alors lancer fonction load(), si url page confirmation alors fonction confirmer()
if(/cart\.html$/i.test(window.location.href)){document.addEventListener('DOMContentLoaded',function(){load()});}
if(/confirmation\.html\S{1,}$/i.test(window.location.href)){document.addEventListener('DOMContentLoaded',function(){confirmer()});}

// récupération des données de l'API
function load()
{
    let reponse={};
    fetch("http://localhost:3000/api/products/")
        .then(function(reponse){if (reponse.ok){return reponse.json();}})
            .catch(function(erreur){alert(erreur+"\n\nLe serveur ne répond pas");})
        .then(function(reponse){liste_produit(reponse);})
}

// affichage du panier
function liste_produit(reponse)
{
    document.querySelector('#cart__items').textContent='';
    document.querySelector('#totalQuantity').textContent='';
    document.querySelector('#totalPrice').textContent='';

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
                        <p class="deleteItem" role="button" tabindex="0">Supprimer</p>
                    </div>
                </div>
            </div>
        <\/article>`;

        document.querySelector('#cart__items').insertAdjacentHTML("beforeend",article);
        document.querySelector('article[data-id="'+_id+couleur+'"] .deleteItem').addEventListener("click",function(){supprimer(_id+couleur),false});
        document.querySelector('article[data-id="'+_id+couleur+'"] .deleteItem').addEventListener("keydown",function(e){if(e.key==='Enter'){supprimer(_id+couleur)}});
        document.querySelector('article[data-id="'+_id+couleur+'"] .itemQuantity').addEventListener("change",function(){modifier(_id+couleur),false});
	}
    document.querySelector('#totalQuantity').insertAdjacentHTML("beforeend",quantiteTotal);
    document.querySelector('#totalPrice').insertAdjacentHTML("beforeend",prixTotal);

    //document.querySelector('#order').setAttribute('type','button');
    //document.querySelector('#order').addEventListener("click",function(){verification()});
    const test = document.querySelector('form').addEventListener("submit", verification);
}

// supprimer un article du panier
function supprimer(identifiant)
{
    document.querySelector('article[data-id="'+identifiant+'"]').remove();

    let panier = new Map(JSON.parse(localStorage.getItem("panier")));
    panier.delete(identifiant);
    localStorage.setItem("panier",JSON.stringify(Array.from(panier)));
    load();
}

// modifier la quantité d'un article du panier
function modifier(identifiant)
{
    const newQuantite = document.querySelector('article[data-id="'+identifiant+'"] .itemQuantity').value;

    const panier = new Map(JSON.parse(localStorage.getItem("panier")));
    const tableauValeurs = panier.get(identifiant);
    tableauValeurs[2] = newQuantite;
    panier.set(identifiant,tableauValeurs);
    localStorage.setItem("panier",JSON.stringify(Array.from(panier)));
    load();
}

// vérifier les données du formulaire et présence d'au moins un article
function verification(e)
{
    e.preventDefault(); // bloquer le submit html
    const prenom = document.querySelector('#firstName').value;
    const nom = document.querySelector('#lastName').value;
    const adresse = document.querySelector('#address').value;
    const ville = document.querySelector('#city').value;
    const email = document.querySelector('#email').value;
    const totalQuantite = document.querySelector('#totalQuantity').textContent;

    let valider=true;

    if (/^[a-z ]{1,}$/i.test(prenom)==false){valider=false;messageErreur('firstName','Le prénom doit comporter uniquement des lettres');}
    else{ document.querySelector('#firstNameErrorMsg').textContent='';}

    if (/^[a-z ]{1,}$/i.test(nom)==false){valider=false;messageErreur('lastName','Le nom doit comporter uniquement des lettres');}
    else{document.querySelector('#lastNameErrorMsg').textContent='';}

    if (/^[a-z0-9 ]{1,}$/i.test(adresse)==false){valider=false;messageErreur('address','L\'adresse doit comporter uniquement des lettres ou des chiffres');}
    else{document.querySelector('#addressErrorMsg').textContent='';}

    if (/^[a-z- ]{1,}$/i.test(ville)==false){valider=false;messageErreur('city','La ville doit comporter uniquement des lettres ou \"-\"');}
    else{document.querySelector('#cityErrorMsg').textContent='';}

    if (/\S+@\S+\.\S+/i.test(email)==false){valider=false;messageErreur('email','L\'adresse email doit comporter des lettres, un arobase et un point. ');}
    else{document.querySelector('#emailErrorMsg').textContent='';}

    if(parseInt(totalQuantite)<1){valider=false;document.querySelector('#emailErrorMsg').append("Le panier est vide !");}
    
    if (valider==true){commande(prenom,nom,adresse,ville,email);}//document.querySelector('form').submit();
}

// affiche le message d'erreur si les données formulaire sont non-conformes
function messageErreur(champs,message)
{
    document.querySelector('#'+champs+'ErrorMsg').textContent='';
    document.querySelector('#'+champs+'ErrorMsg').append(message);
}

// construction de l'objet à envoyer
function commande(prenom,nom,adresse,ville,email)
{
    let liste_produits=[];
    let panier = new Map(JSON.parse(localStorage.getItem("panier")));
    for (const element of panier)
	{
        liste_produits.push(element[1][0]);
    }

    let tableau = {contact: {firstName: ""+prenom+"",lastName:""+nom+"",address:""+adresse+"",city:""+ville+"",email:""+email+""},products:liste_produits};
    envoi(tableau);
}

// envoi des données sur le service web
function envoi(tableau)
{
    const reponseCommande={};
    fetch("http://localhost:3000/api/products/order/",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(tableau)
    })
        .then(function(reponseCommande){if (reponseCommande.ok){return reponseCommande.json();}})
            .catch(function(erreur){alert(erreur+"\n\nLe serveur ne répond pas");})
        .then(function(reponseCommande)
            {
                //console.table(reponseCommande);
                window.location.href="confirmation.html?orderId="+reponseCommande.orderId+"";
            }
        )
}

// afficher le numéro de commande passer dans l'url
function confirmer()
{
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get("orderId");

    const id=document.createElement('p');
    id.append(orderId);

    const merci=document.createElement('p');
    merci.append('Nous vous remercions pour votre commande !');

    document.querySelector('#orderId').insertAdjacentElement("beforeend",id);
    document.querySelector('#orderId').insertAdjacentElement("beforeend",merci);

    localStorage.clear();
}