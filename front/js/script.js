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
		let _id = reponse[i]._id;
		let name = reponse[i].name;
		let imageUrl = reponse[i].imageUrl;
		let description = reponse[i].description;
		let altTxt = reponse[i].altTxt;

		let a = document.createElement('a');
		a.href = "./product.html?id="+_id;

		let article = document.createElement('article');

		let img = document.createElement('img');
		img.src=imageUrl;
		img.alt=altTxt;

		let h3 = document.createElement('h3');
		h3.class="productName";
		h3.append(name);

		let p = document.createElement('p');
		p.class = "productDescription";
		p.append(description);

		article.appendChild(img);
		article.appendChild(h3);
		article.appendChild(p);

		a.appendChild(article);

		document.getElementById('items').appendChild(a);
	}
}