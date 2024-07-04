const API_BASE_URL = "http://localhost:5678/api";

function login() {

  let mail = document.querySelector('#email').value;
  let password = document.querySelector('#password').value;

  let data = {
    email: mail,
    password: password,
  }

  fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type' : 'application/json'
    },
    // gérer la réponse de l'API
    // Dans la réponse de l'API, prendre le token et le placer dans le localStorage (localStorage.setItem.......................)
    // Rediriger l'utilisateur vers la page index
    // Gérer les erreurs
  })

}

document.querySelector('#login form').addEventListener('submit', function (e) {
  e.preventDefault();
  login();
})