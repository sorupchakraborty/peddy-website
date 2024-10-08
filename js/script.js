const apiUrl = 'https://openapi.programming-hero.com/api/peddy/pets';
const categoryUrls = {
    dog: 'https://openapi.programming-hero.com/api/peddy/category/dog',
    cat: 'https://openapi.programming-hero.com/api/peddy/category/cat',
    rabbit: 'https://openapi.programming-hero.com/api/peddy/category/rabbit',
};

let fetchedPets = [];

function showLoadingSpinner() {
    const petCardsContainer = document.getElementById('pet-cards');
    petCardsContainer.innerHTML = `
<div class="flex justify-center items-center h-48"><div class="loader"></div></div>
`;
    return new Promise(resolve => setTimeout(resolve, 2000));
}

function validateField(field) {
    return field ? field : 'Not Found';
}

function createCard(pet) {
    const imageUrl = validateField(pet.image);
    const petName = validateField(pet.name);
    const breed = validateField(pet.breed);
    const birth = validateField(pet.birth);
    const gender = validateField(pet.gender);
    const price = validateField(pet.price);
    const petId = validateField(pet.id);

    return `
<div class="border rounded-xl p-4">
    <img src="${imageUrl}" class="rounded-t-lg w-full h-48 object-cover" alt="${petName}">
    <div class="p-4">
        <h3 class="text-xl font-bold">${petName}</h3>
        <div class="flex items-center gap-1">
            <img src="./images/Breed.png" alt="Breed Icon" class="w-5 h-5">
            <p class="text-gray-600">Breed: ${breed}</p>
        </div>
        <div class="flex items-center gap-1">
            <img src="./images/Birth.png" alt="Birth Icon" class="w-5 h-5">
            <p class="text-gray-600">Birth: ${birth}</p>
        </div>
        <div class="flex items-center gap-1">
            <img src="./images/Gender.png" alt="Gender Icon" class="w-5 h-5">
            <p class="text-gray-600">Gender: ${gender}</p>
        </div>
        <div class="flex items-center gap-1">
            <img src="./images/Price.png" alt="Price Icon" class="w-5 h-5">
            <p class="text-gray-600">Price: ${price} $</p>
        </div>
        <div class="mt-4 flex justify-between">
            <button class="like-btn btn bg-white text-black hover:bg-[#5bf260]" data-img="${imageUrl}">
                <img src="./images/like.png" alt="Like">
            </button>
            <button class="btn adopt-btn bg-white text-black hover:bg-[#5bf260]">Adopt</button>
            <button onclick="loadDetails(\`${pet.petId}\`)" class="btn bg-white hover:bg-[#5bf260] text-black">
            Details </button>
        </div>
    </div>
</div>
`;
}

function renderPetCards(pets) {
    const petCardsContainer = document.getElementById('pet-cards');
    petCardsContainer.innerHTML = '';

    pets.forEach(function (pet) {
        const cardHTML = createCard(pet);
        petCardsContainer.innerHTML += cardHTML;
    });

    addLikeButtonListeners();
    addDetailsButtonListeners();
    addAdoptButtonListeners();
}

async function fetchAndDisplayPets(url) {
    await showLoadingSpinner();

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                return Promise.reject('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            fetchedPets = data.pets || data.data || [];
            if (!fetchedPets.length) {
                return Promise.reject('No pets found in the response.');
            }

            renderPetCards(fetchedPets.slice(0, 12));
        })
        .catch(function (error) {
            console.error('Error fetching pets:', error);
            document.getElementById('pet-cards').innerHTML = `<p class=" text-2xl text-center text-black font-bold">No information Available</p>`;
        });
}

function showAdoptionCountdown() {
    let countdown = 3;
    const countdownElement = document.createElement('div');
    countdownElement.className = 'fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50';
    countdownElement.innerHTML = `<div class="text-white text-4xl font-bold">${countdown}</div>`;
    document.body.appendChild(countdownElement);

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = `<div class="text-white text-2xl font-bold">Adopted</div>`;
            setTimeout(() => {
                document.body.removeChild(countdownElement);
            }, 1500);
        } else {
            countdownElement.innerHTML = `<div class="text-white text-4xl font-bold">${countdown}</div>`;
        }
    }, 1000);
}

function addAdoptButtonListeners() {
    const adoptButtons = document.querySelectorAll('.adopt-btn');
    adoptButtons.forEach(function (button) {
        button.addEventListener('click', showAdoptionCountdown);
    });
}

function sortByPriceDescending() {
    if (fetchedPets.length > 0) {
        const sortedPets = [...fetchedPets].sort(function (a, b) {
            return parseFloat(b.price) - parseFloat(a.price);
        });
        renderPetCards(sortedPets.slice(0, 12));
    }
}

function addCategoryClickHandlers() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            categoryButtons.forEach(btn => btn.classList.remove('bg-green-400'));
            button.classList.add('bg-green-400');
            fetchAndDisplayPets(categoryUrls[button.id.split('-')[0]]);
        });
    });
}

function addSortByPriceClickHandler() {
    const sortButton = document.getElementById('sort-price-btn');
    sortButton.addEventListener('click', sortByPriceDescending);
}

function fetchPetsOnLoad() {
    fetchAndDisplayPets(apiUrl);
}

function addDetailsButtonListeners() {
    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const petId = button.getAttribute('data-id');
            showModal(petId);
        });
    });
}

function addLikeButtonListeners() {
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const petThumbnail = button.getAttribute('data-img');
            addPetThumbnailToRightSection(petThumbnail);
        });
    });
}

function addPetThumbnailToRightSection(thumbnailUrl) {
    const rightSection = document.getElementById('right-section');
    const thumbnailHTML = `
<div class="w-1/2 p-2">
    <img src="${thumbnailUrl}" class="rounded-lg object-cover w-full h-24">
</div>
`;
    rightSection.innerHTML += thumbnailHTML;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchPetsOnLoad();
    addCategoryClickHandlers();
    addSortByPriceClickHandler();
});