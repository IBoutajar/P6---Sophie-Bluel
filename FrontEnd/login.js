//variable 

const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const msgErreur = document.querySelector(".login p");


async function login(){
    form.addEventListener("submit", (e) =>{
        e.preventDefault();
        const valueEmail = email.value; 
        const valuePassword = password.value;

            const loginBody = {
                email: valueEmail,
                password: valuePassword
            };
            const charge = JSON.stringify(loginBody)
            fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: charge
            }).then(response => response.json())
            .then(result => {
                if (result.error || result.message){
                    msgErreur.textContent = 'Erreur dans l’identifiant ou le mot de passe'
                    email.value = ""
                    password.value = ""
                }else{

                    window.sessionStorage.setItem("token",result.token)
                    window.location.href ="./index.html"
                }
            } )
            
        
            
        
    })
}

login()