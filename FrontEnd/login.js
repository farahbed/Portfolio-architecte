const API_BASE_URL = "http://localhost:5678/api";

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  
   console.log("email & password:", email, password);

  // Creer un objet data avec l'email et le mot de passe
  let data = {
    email: email,
    password: password
  };

  console.log("data object:", data);

  //fetch API login (POST)

  fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      console.log("response from fetch received:", response);
      if (!response.ok) {
        throw new Error("response not ok: " + response.statusText);
      }
      return response.json();
    })
    .then(function (data) {
      console.log("data received:", data);

      // Stocker le token dans le localStorage
      localStorage.setItem("token", data.token);
      console.log("Token stored in localStorage:", data.token);

      window.location.href = "index.html";
    })
     .catch(function (error) {
      console.error("Error:", error);
      const errorMessage = document.querySelector(".error");
      errorMessage.style.display = "flex";
    });

  }

 

  document.querySelector("#login form").addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });


