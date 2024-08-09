const API_BASE_URL = "http://localhost:5678/api";
let allWorks = [];

    ////////*********************** WORKS **************///////
// Fetch works
async function getWorks() {
  try {
    const response = await fetch(`${API_BASE_URL}/works`);
    if (!response.ok) {
      throw new Error("Erreur de récupération des œuvres: " + response.statusText);
    }
    const data = await response.json();
    console.log("Œuvres récupérées avec succès:", data);
    allWorks = data; // Stocker les œuvres dans la variable globale
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres:", error);
    return [];  // Retourner un tableau vide en cas d'échec
  }
}

// display works
function displayWorks(works) {
  try {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Nettoyer la galerie avant d'ajouter de nouveaux éléments

    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const deleteIcon = document.createElement("i");
      const figcaption = document.createElement("figcaption");

      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(deleteIcon);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);

    });
    console.log("wokd displayed successfully");
  } catch (error) {
    console.error("Error displaying works:", error);
  }
}
   
/////////////*************** CATEGORIES //////////////// 
// Fetch categories
async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error("Erreur de récupération des catégories: " + response.statusText);
    }
    const data = await response.json();
    console.log("Catégories récupérées avec succès:", data);
    displayCategories(data); 
    displayCategoriesInModal(data);

  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
  }
}

// display categories
function displayCategories(categories) {
  const filters = document.querySelector(".filters");
  filters.innerHTML = ""; // 

  // Add button "Tous"
  const buttonAll = document.createElement("button");
  buttonAll.classList.add("category-btn");
  buttonAll.classList.add("active");
  buttonAll.textContent = "Tous";
  buttonAll.addEventListener("click", () => {
    console.log("Filtrer les œuvres par catégorie: tous");
    displayWorks(allWorks);

    // Mettre à jour l'état actif du bouton
    const activeButton = filters.querySelector(".category-btn.active");
    if (activeButton) {
      activeButton.classList.remove("active");
    }
    buttonAll.classList.add("active");
  });

  filters.appendChild(buttonAll);

  // Ajouter les boutons pour chaque catégorie
  categories.forEach((category) => {
    createCategoryButton(category);
  });

  console.log("Catégories affichées avec succès");
}

////////////*********** FILTERS BUTTONS **********/////////////

// Function to create a button for each category
function createCategoryButton(category) {
  const filters = document.querySelector(".filters");
  const button = document.createElement("button");

  button.classList.add("category-btn");
  button.textContent = category.name;

  button.addEventListener("click", () => {
    console.log(`Filtrer les œuvres par catégorie: ${category.name}`);

    const filteredWorks = allWorks.filter((work) => work.categoryId === category.id);
    console.log(filteredWorks)
    displayWorks(filteredWorks);

    // Mettre à jour l'état actif du bouton
    const activeButton = filters.querySelector(".category-btn.active");
    if (activeButton) {
      activeButton.classList.remove("active");
    }
    button.classList.add("active");
  });

  filters.appendChild(button);
}


/////////////////// ********CUSTOM MODAL********* //////////////////

// Function to display works in modal
async function displayWorksInModal() {
  try {
    const works = await getWorks(); // fetch works

    const modalContent = document.querySelector(".custom-modal");
    if (!modalContent) {
      throw new Error("Élément '.custom-modal' introuvable");
    }

    // set modal content
    const title = modalContent.querySelector("h2");
    const closeButton = modalContent.querySelector(".close");
    const galleryInModale = modalContent.querySelector("#galleryInModale");

  
      title.textContent = "Galerie photo";
      closeButton.textContent = "x";
      closeButton.addEventListener("click", closeModal);

      galleryInModale.innerHTML = "";

    // add photos
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const deleteIcon = document.createElement("i");

      img.src = work.imageUrl;
      img.alt = work.title;

      // add delete icon & event listener to delete button
      deleteIcon.classList.add("fa", "fa-trash", "delete-icon");
      deleteIcon.id = `delete-${work.id}`; // Inclure un préfixe unique
      deleteIcon.addEventListener("click", () => {
        console.log("Suppression de l'œuvre:", work.id);
        deleteWorks(work.id); // Appeler la fonction delete avec l'ID
      });

      figure.id = `work-${work.id}`; // Inclure un préfixe unique
      figure.appendChild(img);
      figure.appendChild(deleteIcon);
      galleryInModale.appendChild(figure);
    });

    //  add photo button
    let addPhotoBtn = document.querySelector("#addPhoto");
    if (addPhotoBtn) {
      addPhotoBtn = document.createElement("button");
      addPhotoBtn.id = "addPhoto";
      addPhotoBtn.textContent = "Ajouter une photo";
      addPhotoBtn.classList.add("modal-button");
      addPhotoBtn.addEventListener("click", switchToNewModal);
      modalContent.appendChild(addPhotoBtn);
    }

    modalContent.style.display = "block";

    console.log("Œuvres affichées avec succès dans le modal");
  } catch (error) {
    console.error("Erreur lors de l'affichage des œuvres dans le modal:", error);
  }
}


/////////////////// ********NEW MODAL********* //////////////////


// function to show new modal
function switchToNewModal() {
  const modalContent = document.querySelector('.custom-modal');
  const newModal = document.querySelector('.new-modal');
  modalContent.style.display = 'none';
  newModal.style.display = 'block';
}

// Function to come back to custom modal
function switchToCustomModal() {
  const modalContent = document.querySelector('.custom-modal');
  const newModal = document.querySelector('.new-modal');
  newModal.style.display = 'none';
  modalContent.style.display = 'block';
}

// Function to close modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  

  
  const textModifier = document.querySelector('.popup .show-popup');
  const modalContent = document.querySelector('.custom-modal');
  const closeButtons = document.querySelectorAll('.close, .closed'); // Inclure les deux classes de fermeture
  const arrowButton = document.querySelector('.arrow'); // Sélectionner le bouton de flèche de retour

  if (!textModifier || !modalContent || !closeButtons || !arrowButton) {
    console.error('Élément manquant dans le DOM');
    return;
  }
  // open new modal
  textModifier.addEventListener('click', async () => { // when the modifier is clicked the modal will open
    console.log('Ouverture du modal');
    await displayWorksInModal();
    modalContent.style.display = 'flex'; // Afficher le modal
    newModal.style.display = 'none'; // Hide the new modal when the custom modal is opened
  });

  // close modal
  closeButtons.forEach(button => button.addEventListener('click', closeModal));

  // close modal without click
  modalContent.addEventListener('click', (event) => {
    if (event.target === modalContent) {
      modalContent.style.display = 'none'; // Cacher le modal si l'utilisateur clique à l'extérieur
      console.log('Fermeture du modal...');
    }
  });

  // comme back to custom modal with arrow
  arrowButton.addEventListener('click', switchToCustomModal);

});

//categories filters and search

async function displayCategoriesInModal(categories) {
const categorySelect = document.querySelector('#categorySelect');//selecetor du modal(label)

//delete all options already in the select
categorySelect.innerHTML = '<option value="">--</option>';

  // ajouter une option pour chaque categorie
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
  console.log("Catégories affichées dans le modal");
}




  //--------------------------FETCH DERNIER POST-------------------------------------------//
 


  

 
  const addPhotoBtn = document.getElementById("addPhotoBtn");
  const imageUpload = document.getElementById("imageUpload");
  const validerBtn = document.getElementById("valider");
  const imagePreview = document.getElementById("imagePreview");
  const addTitle = document.getElementById("title");
  const categorySelect = document.getElementById("categorySelect");
  
  // Add event listeners to the buttons
  if (addPhotoBtn && imageUpload) {
    console.log("addPhotoBtn and imageUpload found");
    addPhotoBtn.addEventListener("click", () => {
      console.log("addPhotoBtn clicked");
      imageUpload.click();
    });
    imageUpload.addEventListener("change", handleInputChange);
  } else {
    console.error("Bouton ajouter photo ou élément imageUpload non trouvé");
  }
  
  // Add event listeners to the input fields to check form completion
  if (addTitle && categorySelect) {
    console.log("addTitle and categorySelect found");
    addTitle.addEventListener("input", handleInputChange);
    categorySelect.addEventListener("change", handleInputChange);
  }
  
  // Function to handle input change and display the selected image in the modal preview and check form completion
  function handleInputChange() {
    console.log("handleInputChange called");
    const file = imageUpload.files[0];
    if (file) {
      console.log("File selected:", file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("FileReader onload called");
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        addPhotoBtn.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
      imagePreview.style.display = "none";
      addPhotoBtn.style.display = "block";
    }
  
    checkFormCompletion();
  }
  
  // Check form completion if the input fields are filled and the image is selected, the valider button is enabled
  function checkFormCompletion() {
    console.log("checkFormCompletion called");
    const isFormComplete = addTitle.value.trim() && categorySelect.value && imageUpload.files.length > 0;
    console.log("Is form complete?", isFormComplete);
    validerBtn.style.backgroundColor = isFormComplete ? "#1D6154" : "";
    validerBtn.disabled = !isFormComplete;
  }
  
  // Function to handle form data and submission
  async function fetchLastPost(event) {
    event.preventDefault();
    console.log("fetchLastPost called");
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token non trouvé dans localStorage");
      return;
    }
    console.log("Token trouvé:", token);

 // *****partie du code qui ne fonctionné pas*****
    const image = imageUpload.files[0];
    const title = addTitle.value.trim(); // Trim whitespace from title
    const category = categorySelect.value; // Get category value as string
  
    // Debugging logs
    console.log("Raw category value:", category); // Log raw value from select
  
    // Convert category to integer
    const categoryInt = parseInt(category, 10);
  
    // Log the result of the conversion
    console.log("Converted categoryInt:", categoryInt); // Should be an integer or NaN
  
    // Validate title and category
    if (!title) {
      console.error("Titre non fourni. Veuillez entrer un titre.");
      return;
    }
  
    // Category validation
    if (!category || isNaN(categoryInt) || categoryInt <= 0) {
      console.error("Catégorie non valide. Veuillez sélectionner une catégorie.");
      return;
    }
  
    // Prepare form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryInt); // Ensure category is an integer
    formData.append("image", image);
    
  // *****fin partie du code qui ne fonctionné pas*****
    try {
      console.log("Tentative d'envoi de la requête fetch...");
  
      const response = await fetch('http://localhost:5678/api/works', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
  
      console.log("Requête fetch envoyée");
  
      if (response.ok) {
        const data = await response.json();
        console.log("Post ajouté avec succès. Réponse reçue:", data);
        window.location.reload();
      } else {
        console.error("Erreur dans la requête : ", response.statusText);
        const errorResponse = await response.text();
        console.error("Détails de l'erreur :", errorResponse);
      }
    } catch (error) {
      console.error("Une erreur est survenue :", error);
    }
  }
  
  
  // Add event listener to the valider button
  if (validerBtn) {
    console.log("validerBtn found");
    validerBtn.addEventListener("click", fetchLastPost);
  } else {
    console.error("Bouton valider non trouvé");
  }
  
  
  
  
  

//-------------------------------------------------Admin mode


     // add function to show "mode admin"

 function checkUserStatus() {

    // check if user is logged in
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    // show admin banner if user est administrateur
    const adminBanner = document.getElementById('adminBanner');
    const header = document.querySelector('header');
    const modifierButton = document.querySelector('.show-popup');
    const logoutButton = document.querySelector('.logout');
    const loginButton = document.querySelector('.login');
    
    //console.log des composants
    console.log("adminBanner element:", adminBanner);
    console.log("header element:", header);
    console.log("modifierButton element:", modifierButton);
    console.log("logoutButton element:", logoutButton);
    console.log("loginLink element:", loginButton);
      
    
    if (token) {
        console.log("Utilisateur connecté");
        header.classList.add('admin-mode');
        adminBanner.style.display = 'block'; // show admin banner
        modifierButton.style.display = 'block'; // show modifierButton
        logoutButton.style.display = 'block';
        loginButton.style.display = 'none'; // hide loginButton
    } else {
        console.log("Utilisateur non connecté");
        header.classList.remove('admin-mode');
        adminBanner.style.display = 'none'; // hide adminBanner
        modifierButton.style.display = 'none'; // hide modifierButton
        logoutButton.style.display = 'none';
        loginButton.style.display = 'block'; // show loginButton
    }
  }

        // logout function
        function logout() {
          console.log("Deconnexion");

          // remove token from localStorage
          localStorage.removeItem('token');
          console.log("Token supprimé");

          //load conexion page
          window.location.href = 'login.html';
          console.log("Redirection vers la page de connexion");
        } 


        // add event listener to logout button
        
        document.querySelector('.logout').addEventListener('click', logout);
        document.addEventListener('DOMContentLoaded', checkUserStatus);
    





// ------------------------------------------SHOW MODAL / CLOSE MODAL POPUP




////// *********** DELETE WORKS **********////////
async function deleteWorks(id) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_BASE_URL}/works/${id}`, {
      method: "DELETE",
      headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
      },
  });
  
  if (!response.ok) {
      throw new Error("Erreur de suppression de l'œuvre: " + response.statusText);
  } //gerer la reponse de l'api//
console.log(result, "suppression de l'œuvre");

  //delete from DOM
    const elementToDelete = document.getElementById(`work-${id}`)
    if (elementToDelete) {
      elementToDelete.parentNode.removeChild(elementToDelete);
      console.log("œuvre supprimée");
    } else {
      console.log("ID introuvable");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre:", error);
  }  
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
  getWorks().then(displayWorks);
  getCategories();
  checkUserStatus();

  const textModifier = document.querySelector('.popup .show-popup');
  const modal = document.getElementById('modal');
  const closeButtons = document.querySelectorAll('.close, .closed');
  const arrowButton = document.querySelector('.arrow');

  textModifier.addEventListener('click', () => {
    displayWorksInModal();
    modal.style.display = 'flex';
  });

  // close modal
  closeButtons.forEach(button => button.addEventListener('click', closeModal));

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  arrowButton.addEventListener('click', switchToCustomModal);
});

//  le btn valider devien vert quand on a bien rempli les champs et qu'on appuie sur le btn


