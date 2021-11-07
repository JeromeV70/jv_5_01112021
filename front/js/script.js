let reponse = {};
let xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", 'http://localhost:3000/api/products', true);
xmlhttp.onreadystatechange = function ()
{
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{		
        let reponse = xmlhttp.responseText;
		afficheListe(reponse);
	}
}
xmlhttp.send(null);

function afficheListe(reponse) // afficher les produits sur la page d'accueil
{
	reponse = JSON.parse(reponse);

	for (let i in reponse)
	{
		const article = 
		`<a href="./product.html?id=${reponse[i]._id}">
			<article>
				<img src=${reponse[i].imageUrl} alt=${reponse[i].altTxt}/>
				<h3 class="productName">${reponse[i].name}</h3>
				<p class="productDescription">${reponse[i].description}</p>
			</article>
		</a>`;
		document.getElementById('items').insertAdjacentHTML("beforeend",article);
	}
}