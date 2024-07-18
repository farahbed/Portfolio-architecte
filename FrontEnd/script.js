const API_BASE_URL = "http://localhost:5678/api";
let allWorks = [];

// Fonction pour récupérer les œuvres depuis l'API
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

// Fonction pour afficher les œuvres dans la galerie principale
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
      gallery.appendChild(figure);
      figure.appendChild(figcaption);

      deleteIcon.classList.add("fa", "fa-trash", "delete-icon");
      deleteIcon.addEventListener("click", () => {
        console.log("Suppression de l'œuvre:", work.id);
        // Implémentez ici la logique de suppression de l'œuvre avec l'ID work.id
        // Par exemple :
        // deleteWork(work.id);
      });


    });
    console.log("wokd displayed successfully");
  } catch (error) {
    console.error("Error displaying works:", error);
  }
}

      

// Fonction pour récupérer les catégories depuis l'API
async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error("Erreur de récupération des catégories: " + response.statusText);
    }
    const data = await response.json();
    console.log("Catégories récupérées avec succès:", data);
    displayCategories(data); // Afficher les catégories dans l'interface utilisateur
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
  }
}

// Fonction pour afficher les catégories dans l'interface utilisateur
function displayCategories(categories) {
  const filters = document.querySelector(".filters");
  filters.innerHTML = ""; // Nettoyer les filtres avant d'ajouter de nouveaux éléments

  // Ajouter le bouton "Tous"
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

// Fonction pour créer un bouton pour chaque catégorie
function createCategoryButton(category) {
  const filters = document.querySelector(".filters");
  const button = document.createElement("button");

  button.classList.add("category-btn");
  button.textContent = category.name;

  button.addEventListener("click", () => {
    console.log(`Filtrer les œuvres par catégorie: ${category.name}`);

    const filteredWorks = allWorks.filter((work) => work.categoryId === category.id);
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

// Fonction pour afficher les œuvres dans le modal
async function displayWorksInModal() {
  try {
    const works = await getWorks(); // Récupérer les œuvres depuis l'API

    const modalContent = document.querySelector(".custom-modal");
    modalContent.innerHTML = ""; // Nettoyer le contenu précédent du modal

    // Ajouter un titre au modal
    const title = document.createElement("h2");
    title.textContent = "Galerie photo";
    modalContent.appendChild(title);

    // Ajouter le bouton de fermeture
    const closeButton = document.createElement("span");
    closeButton.classList.add("close");
    closeButton.textContent = "x";
    closeButton.addEventListener("click", () => {
      console.log("Fermeture du modal");
      modal.style.display = "none"; // Cacher le modal
    });
    modalContent.appendChild(closeButton);

    // Afficher les œuvres dans le modal
    const gallery = document.createElement("div");
    gallery.classList.add("gallery");

    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const deleteIcon = document.createElement("i");

      img.src = work.imageUrl;
      img.alt = work.title;

      deleteIcon.classList.add("fa", "fa-trash", "delete-icon");
      deleteIcon.addEventListener("click", () => {
        console.log("Suppression de l'œuvre:", work.id);
        // Implémentez ici la logique de suppression de l'œuvre avec l'ID work.id
      });

      figure.appendChild(img);
      figure.appendChild(deleteIcon);
      gallery.appendChild(figure);
    });
    modalContent.appendChild(gallery);

    // Ajouter le bouton "Ajouter une photo"
    const addPhotoBtn = document.createElement("button");
    addPhotoBtn.id = "addPhoto";
    addPhotoBtn.textContent = "Ajouter une photo";
    addPhotoBtn.classList.add("modal-button");
    addPhotoBtn.addEventListener("click", () => {
      console.log("Ouverture de la fenêtre d'ajout de photo");
      // Ici, vous pourriez ouvrir une fenêtre modale ou effectuer une action spécifique
    });
    modalContent.appendChild(addPhotoBtn);

    modal.style.display = "block"; // Afficher le modal

    console.log("Œuvres affichées avec succès dans le modal");
  } catch (error) {
    console.error("Erreur lors de l'affichage des œuvres dans le modal:", error);
  }
}

// Initialiser l'application lorsque le DOM est entièrement chargé
document.addEventListener("DOMContentLoaded", () => {
  getWorks().then(displayWorks); // Récupérer et afficher les œuvres dans la galerie principale
  getCategories(); // Récupérer et afficher les catégories

  const textModifier = document.querySelector('.popup .show-popup');
  const modal = document.getElementById('modal');
  const close = document.querySelector('.close');

  textModifier.addEventListener('click', () => {
    console.log('Ouverture du modal');
    displayWorksInModal(); // Appeler displayWorksInModal pour afficher les œuvres dans le modal
    modal.style.display = 'flex'; // Afficher le modal
  });

  close.addEventListener('click', () => {
    modal.style.display = 'none'; // Cacher le modal
    console.log('Fermeture du modal...');
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none'; // Cacher le modal si l'utilisateur clique à l'extérieur
      console.log('Fermeture du modal...');
    }
  });
});

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

document.addEventListener('DOMContentLoaded', checkUserStatus);


// ------------------------------------------SHOW MODAL / CLOSE MODAL POPUP

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  const textModifier = document.querySelector('.popup .show-popup');
  const modal = document.getElementById('modal');
  const customModal = document.querySelector('.custom-modal');
  const close = document.querySelector('.close');

  console.log('Elements:', {
      textModifier,
      modal,
      customModal,
      close
  });

  // click on button to open modal
  function openModal(event) {
      event.preventDefault();
      console.log('Opening modal');

     
      modal.style.display = 'flex'; // show modal
    }
    textModifier.addEventListener('click', openModal);


 close.addEventListener('click', function() {
       modal.style.display = 'none'; // hide modal
       console.log('Closing modal...');
     
   
 })

 // click outside modal to close modal
  modal.addEventListener('click', function(event) {
      if (event.target === modal) {
          console.log('Clicked outside modal, close the modal');
          modal.style.display = 'none'; // hide modal
      }
  });
});


//mise a joour des styles css
function updateStyles() {
  const filters = document.querySelector('.filters');
  const buttons = filters.querySelectorAll('.category-btn');

  buttons.forEach((button) => {
    button.style.backgroundColor = 'red';
  });
}
