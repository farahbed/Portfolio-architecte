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
        console.error('Error fetching works:', error);
    }
}

async function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Nettoyer la galerie avant d'ajouter de nouveaux éléments
    
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        
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
        console.error('Error fetching categories:', error);
    }
}

function displayCategories(categories) {
    const filters = document.querySelector('.filters');
    filters.innerHTML = ''; // Nettoyer les filtres avant d'ajouter de nouveaux éléments
    
    // ADD button "tous"
    const buttonAll = document.createElement('button');
    buttonAll.classList.add('category-btn');
    buttonAll.textContent = "Tous";
    buttonAll.addEventListener('click', () => {
        console.log("filter works by category: tous");
        displayWorks(allWorks);
    })
    filters.appendChild(buttonAll);

    // Ajouter les boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-btn');
        button.textContent = category.name;
        button.addEventListener('click', () => {
            console.log(`filter works by category: ${category.name}`);
            // Filtrer les travaux par la catégorie
            const filterWorks = allWorks.filter(work => work.categoryId === category.id);
            displayWorks(filterWorks);
        })
        

        filters.appendChild(button);
    });

    console.log("Categories displayed successfully");
}

// Appeler les fonctions pour récupérer et afficher les données
getWorks();
getCategories();
