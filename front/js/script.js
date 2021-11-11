let reponse={};
fetch("http://localhost:3000/api/products/")
	.then(function(reponse){if (reponse.ok){return reponse.json();}})
		.catch(function(erreur){alert(erreur+"\n\nLe serveur ne répond pas");})
	.then(function(reponse){afficheListe(reponse);})

// afficher les produits sur la page d'accueil
function afficheListe(reponse) 
{
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
		document.querySelector('#items').insertAdjacentHTML("beforeend",article);
	}
}