// Variable //

const reponse = await fetch ('http://localhost:5678/api/works') ;
const works = await reponse.json() ;

const reponseCategori = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategori.json();

function genererGallery(works) {

    for (let i = 0; i < works.length; i++) {
        
        const photo = works[i];
        //récuperation de l'élément du Dom qui acceuil les photos
        const gallery = document.querySelector(".gallery");
        // Création de l'élément qui va acceuil le contenu
        const figure = document.createElement("figure");
        // Creation element image
        const img = document.createElement("img");
        img.src = photo.imageUrl;
        //creation du texte de l'élément
        const figcaption = document.createElement("figcaption");
        figcaption.innerText = photo.title

        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    }
}

function genererFiltre(categories){
    for (let i = 0; i < categories.length; i++) {
        const filtre = document.querySelector(".filtre");

        const button = document.createElement("button");
        button.classList.add("button");
        button.innerText = categories[i].name;
        

        filtre.appendChild(button)
        button.addEventListener ("click", function(){
            const worksTrier = works.filter(function (work){
                return work.category.id === categories[i].id
                
            })
            document.querySelector(".gallery").innerHTML = "";
            genererGallery(worksTrier)
            
        })
    }
}

genererFiltre(categories)

genererGallery(works)

// bouton pour voir toute la gallerie sans filtre

const btnDefault = document.querySelector(".default")

btnDefault.addEventListener("click", function(){
    document.querySelector(".gallery").innerHTML = ""
    genererGallery(works)
})