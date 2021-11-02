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

    let colors = reponse.colors;
    let id = reponse._id;
    let name = reponse.name;
    let price = reponse.price;
    let imageUrl = reponse.imageUrl;
    let description = reponse.description;
    let altTxt = reponse.altTxt;

    let img = document.createElement('img');
    img.src=imageUrl;
    img.alt=altTxt;

    document.getElementsByClassName('item__img')[0].appendChild(img);

    document.getElementById('title').append(name);
    document.getElementById('price').append(price);
    document.getElementById('description').append(description);

    for (let couleur of colors)
    {
        let option = document.createElement('option');
        option.value=couleur;
        option.append(couleur);
        document.getElementById('colors').appendChild(option);
    }
}
