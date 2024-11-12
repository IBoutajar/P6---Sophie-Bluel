// Variable //



const reponse = await fetch ('http://localhost:5678/api/works') ;
let works = await reponse.json() ;



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

// si utilisateur connecté
const logout = document.getElementById("logout")
const adminMode = document.querySelector(".admin-mode")
const edition = document.getElementById("edition")
const modifier = document.getElementById("modifier")
const modaleGallery = document.querySelector(".containerModale .modaleGallery")
const modalWorks = document.querySelector(".modaleGallery .modalWorks")

if (window.sessionStorage.getItem("token") != null){
    logout.textContent = 'logout'
    adminMode.classList.remove("displayNone")
    edition.classList.remove("displayNone")

    // déconnexion
    logout.addEventListener("click", () =>{
        window.sessionStorage.removeItem("token")
        
    })
}

// Affichage Modale sur click "modififer"

const modaleContainer = document.querySelector(".containerModale")

modifier.addEventListener("click", () =>{
    modaleContainer.style.display = "flex"
})

// quitter la modal quand on click sur la croix
const xmark = document.querySelector(".containerModale .fa-xmark")

xmark.addEventListener("click", () =>{
    modaleContainer.style.display = "none"
})

// quitter la modal quand on click en dehors 
modaleContainer.addEventListener("click", (e) =>{
    if (e.target.className === "containerModale") {
        modaleContainer.style.display = "none"
    }
})
// generer la gallery dans la modal
async function genererModalGallery() {
    modalWorks.innerHTML=""
    const reponse = await fetch ('http://localhost:5678/api/works') ;
    const works = await reponse.json() ;
    for (let i = 0; i < works.length; i++) {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        const span = document.createElement("span")
        const trash = document.createElement("i")

        trash.classList.add("fa-solid","fa-trash-can", "fa-2xs")
        trash.id = works[i].id
        img.src = works[i].imageUrl

        span.appendChild(trash)
        figure.appendChild(span)
        figure.appendChild(img)
        modalWorks.appendChild(figure)
    }
    deleteProject()
    

    
}

// supprimer projet 
async function deleteProject(){
    const trashAll = document.querySelectorAll(".fa-trash-can")
    for (let i = 0; i < trashAll.length; i++) {
        let trash = trashAll[i]
        trash.addEventListener("click",async (e) =>{
            let id = trash.id
            const init = {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + window.sessionStorage.getItem("token")},
            }
            await fetch("http://localhost:5678/api/works/"+id,init)
           
                const worksDelete = works.filter(function(works){
                    return works.id != id
                });
                
                
                genererModalGallery()


                document.querySelector(".gallery").innerHTML = ""
                genererGallery(worksDelete)
                
            
                
            
        })
        
    }
    
    
}

genererModalGallery()


// faire apparaitre la deuxiemes modal
const btnAjouter = document.querySelector(".modaleGallery .btnAjouter")
const modalAddPhoto = document.querySelector(".modaleAddPhoto")
const arrow = document.querySelector(".fa-arrow-left")
const xmarkPhoto = document.querySelector(".modaleAddPhoto .fa-xmark")

function genererModalAjout(){
    btnAjouter.addEventListener("click",() =>{
        modaleGallery.style.display = "none"
        modalAddPhoto.style.display = "flex"
    })

    arrow.addEventListener("click",() =>{
        modalAddPhoto.style.display = "none"
        modaleGallery.style.display= "flex"
    })

    xmarkPhoto.addEventListener("click", () =>{
        modaleContainer.style.display = "none"
    })
}

genererModalAjout()

// Faire prévisualisation

const previewImg = document.querySelector(".containerFile img")
const inputFile = document.getElementById("file")
const labelFile = document.querySelector(".containerFile label")
const iconeFile = document.querySelector(".containerFile .fa-image")
const pFile = document.querySelector(".containerFile p")

//Ecoute changement input file
//previsualisation
inputFile.addEventListener("change",() =>{
    const file = inputFile.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function (e){
            previewImg.src = e.target.result
            previewImg.style.display = "flex"
            labelFile.style.display = "none"
            iconeFile.style.display = "none"
            pFile.style.display = "none"
        }
        reader.readAsDataURL(file)
    }
})



//créer liste de catégories dans Select de Form

async function categoriesSelect() {
    const select = document.querySelector(".modaleAddPhoto .formBas select") ;
    const reponseCategori = await fetch('http://localhost:5678/api/categories');
    const categories = await reponseCategori.json();
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option")
        option.value = categories[i].id
        option.textContent = categories[i].name
        select.appendChild(option)        
    }
}

categoriesSelect()


//ajouter une photo via POST

const form = document.querySelector(".modaleAddPhoto form")
const title = document.querySelector(".modaleAddPhoto .formBas #title")
const category = document.querySelector(".modaleAddPhoto .formBas #category")
const pModalPhoto = document.querySelector(".modaleAddPhoto p")
const btnAjouterValide = document.querySelector("form button")




async function addPhoto() {
    
    form.addEventListener("submit",async (e) =>{
        e.preventDefault()
        if (title.value === '' || previewImg.src === '') {
            pModalPhoto.textContent = "Veuillez télécharger l'image ou bien renseigné un titre avant de continuer"
        }else{
            btnAjouter.classList.add("btnAjouterVerif")
            const formdata = new FormData(form);
            await fetch("http://localhost:5678/api/works",{
                method:"POST",
                body:formdata,
                headers:{
                    "Authorization": "Bearer " + window.sessionStorage.getItem("token")
                }
                
            })
                const reponse = await fetch ('http://localhost:5678/api/works') ;
                const works = await reponse.json() ;
                document.querySelector(".gallery").innerHTML = ""
                genererGallery(works)
                console.log(works);
                
            
        }
    
        genererModalGallery()
        title.value = ''
        previewImg.src = ''
        previewImg.style.display = "none"
        labelFile.style.display = "flex"
        iconeFile.style.display = "flex"
        pFile.style.display = "flex"

        
        
    })
}

addPhoto()

        
function VerifForm() {
   form.addEventListener("input",() => {
    if (title.value !== '' && previewImg.src !== '' && categories.value !== '') {
        console.log("AHA");
        btnAjouterValide.classList.add("btnAjouter")
        btnAjouterValide.classList.remove("btnAjouterGris")
        btnAjouterValide.disabled = false
        
    } else {
        console.log("BABA");
        
        btnAjouterValide.classList.add("btnAjouterGris")
        btnAjouterValide.classList.remove("btnAjouter")
        btnAjouterValide.disabled = true
    }
   })
    
}

VerifForm()

