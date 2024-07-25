const API_BASE_URL = "http://localhost:5678/api";
let allWorks = [];

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
      ////////*********************** WORKS /////// 

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
  buttonAll.textContent = "Tous";
  buttonAll.style.backgroundColor = "#1D6154";
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
/////////////*************** CATEGORIES //////////////// 


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


////////////*********** FILTERS BUTTONS **********/////////////

// Function to display works in modal
async function displayWorksInModal() {
  try {
    const works = await getWorks(); // fetch works

    const modalContent = document.querySelector(".custom-modal");
    if (!modalContent) {
      throw new Error("Élément '.custom-modal' introuvable");
    }

    // 
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
    if (!addPhotoBtn) {
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



/////////////////// ********MODAL********* //////////////////

// function to show new modal
function switchToNewModal() {
  const customModal = document.querySelector('.custom-modal');
  const newModal = document.querySelector('.new-modal');
  customModal.style.display = 'none';
  newModal.style.display = 'block';
}

// Function to come back to custom modal
function switchToCustomModal() {
  const customModal = document.querySelector('.custom-modal');
  const newModal = document.querySelector('.new-modal');
  newModal.style.display = 'none';
  customModal.style.display = 'block';
}

// Function to close modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  

  
  const textModifier = document.querySelector('.popup .show-popup');
  const modal = document.getElementById('modal');
  const closeButtons = document.querySelectorAll('.close, .closed'); // Inclure les deux classes de fermeture
  const arrowButton = document.querySelector('.arrow'); // Sélectionner le bouton de flèche de retour

  if (!textModifier || !modal || !closeButtons || !arrowButton) {
    console.error('Élément manquant dans le DOM');
    return;
  }
  // open new modal
  textModifier.addEventListener('click', async () => {
    console.log('Ouverture du modal');
    await displayWorksInModal();
    modal.style.display = 'flex'; // Afficher le modal
  });

  // close modal
  closeButtons.forEach(button => button.addEventListener('click', closeModal));

  // close modal without click
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none'; // Cacher le modal si l'utilisateur clique à l'extérieur
      console.log('Fermeture du modal...');
    }
  });

  // comme back to custom modal with arrow
  arrowButton.addEventListener('click', switchToCustomModal);

});

/////////////////// ********NEW MODAL********* //////////////////
//-------------------------------------------------Admin mode


     // add function to show "mode admin"

 function checkUserStatus() {

    // check if user is logged in
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    // show admin banner if user est administrateur
    const adminBanner = document.getElementById('adminBanner');
    console.log("adminBanner element:", adminBanner);
    const header = document.querySelector('header');
    const modifierButton = document.querySelector('.show-popup');
    console.log('header element:', header);

      if (token) {
        header.classList.add('admin-mode');
        adminBanner.style.display = 'block'; // show admin banner
        modifierButton.style.display = 'block'; // show modifierButton
    } else {
        header.classList.remove('admin-mode');
        adminBanner.style.display = 'none'; // hide adminBanner
        modifierButton.style.display = 'none'; // hide modifierButton
    }
}




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

