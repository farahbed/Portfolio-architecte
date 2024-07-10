const API_BASE_URL = "http://localhost:5678/api";
let allWorks = [];

async function getWorks() {
  try {
    const response = await fetch(`${API_BASE_URL}/works`);
    const data = await response.json();
    console.log("Works fetched successfully:", data);
    allWorks = data;
    displayWorks(allWorks);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}

async function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Nettoyer la galerie avant d'ajouter de nouveaux éléments

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });

  console.log("Works displayed successfully");
}

async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    console.log("Categories fetched successfully:", data);
    displayCategories(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function displayCategories(categories) {
  const filters = document.querySelector(".filters");
  filters.innerHTML = ""; // Nettoyer les filtres avant d'ajouter de nouveaux éléments

  // ADD button "tous"
  const buttonAll = document.createElement("button");
  buttonAll.classList.add("category-btn");
  buttonAll.textContent = "Tous";
  buttonAll.addEventListener("click", () => {
    console.log("filter works by category: tous");
    displayWorks(allWorks);
  });
  filters.appendChild(buttonAll);

  // Ajouter les boutons pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("category-btn");
    button.textContent = category.name;
    button.addEventListener("click", () => {
      console.log(`filter works by category: ${category.name}`);
      // Filtrer les travaux par la catégorie
      const filterWorks = allWorks.filter(
        (work) => work.categoryId === category.id
      );
      displayWorks(filterWorks);
    });

    filters.appendChild(button);
  });

  console.log("Categories displayed successfully");
}
// Appeler les fonctions pour récupérer et afficher les données
getWorks();
getCategories();

//Admin mode

// Vérifier que le token est valide
const token = localStorage.getItem("token");
console.log("Token from localStorage:", token);

// Vérifier si l'utilisateur est administrateur
const adminKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMDYzNzUxMiwiZXhwIjoxNzIwNzIzOTEyfQ.wG7y2tAZ42QKsrUTs4QRIJuQ8g6yQPGntwQ6eAfbOgI"
const modeAdmin = token === adminKey;
console.log("Mode admin:", modeAdmin);

const adminBanner = document.getElementById('adminBanner');
console.log("adminBanner element:", adminBanner);

const header = document.querySelector('header');
console.log("Header element:", header);


// Afficher le bandeau "Mode édition" si l'utilisateur est administrateur
if (modeAdmin) {
    header.classList.add('admin-mode');
    adminBanner.style.display = 'block'; // show admin banner
} else {
    header.classList.remove('admin-mode');
    adminBanner.style.display = 'none'; // hide admin banner
}


// SHOW MODAL / CLOSE MODAL POPUP

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  const textModifier = document.querySelector('.popup .show-popup');
  const modal = document.getElementById('modal');
  const customModal = document.querySelector('.custom-modal');

  console.log('Elements:', {
      textModifier,
      modal,
      customModal
  });

  // cliquer sur "Modifier" ouvre le modal
  function openModal(event) {
      event.preventDefault();
      console.log('Opening modal...');

      // cliquer sur le bouton "Modifier" ouvre le modal
      modal.style.display = 'flex';
    }
    textModifier.addEventListener('click', openModal);

 
// on quite le modal quand on clique en dehors
  modal.addEventListener('click', function(event) {
      if (event.target === modal) {
          console.log('Clicked outside modal, close the modal');
          modal.style.display = 'none'; // Masque le modal et le fond semi-transparent
      }
  });
});
