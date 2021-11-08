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
