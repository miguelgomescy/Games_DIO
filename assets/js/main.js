const searchInput = document.getElementById ('searchInput');
const searchButton = document.getElementById ('searchButton');
const mealList = document.getElementById ('mealList');
const modalContainer = document.querySelector('.modal-container');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipeCloseBtn');

/* Add Event Listeners */
searchButton.addEventListener('click', async () =>{
    const ingredient = searchInput.value.trim();
    if(ingredient){
        const meals = await searchMealsByIngredient (ingredient);
        displayMeals(meals);
    }
})

mealList.addEventListener('click', async(e) =>{
    const card = e.target.closest('.meal-item');
    if(card){
        const mealId = card.dataset.id;
        const meal = await getMealDetails(mealId);

        if (meal){
            showMealDetailsPopup(meal)
        }
       }
})

/* Função para buscar pelo ingrediente */

async function searchMealsByIngredient(ingredient) {
    try{
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    const data = await response.json();
    return data.meals;
    } catch(error){
        console.error('Erro na busca', error)
    }
}

// Buscar pelo Id

async function getMealDetails(mealId) {
    try{
        const response = await fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        return data.meals[0];
    } catch (error){
        console.error('Erro na busca por detalhes', error)
    }
    
}

// Função para mostrar as receitas na lista
function displayMeals(meals){
    mealList.innerHTML = '';
    if (meals){
        meals.forEach((meal) =>{
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.id = meal.idMeal;
            mealItem.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealItem);
        });
    } else{
        mealList.innerHTML = '<p> Nenhuma receita foi encontrada. Tente outro ingrediente</p>'
    }
}

// FUnção para mostrar detalhes da receita no popup

function showMealDetailsPopup(meal){
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3> Instruções:</h3>
            <p>${meal.strInstructions}</p>  
        </div>

        <div class="recipe-video">
            <img src="${meal.strMealThumb}"  alt="${meal.strMeal}">
        </div>

        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank"> Tutorial em Video </a>
        </div>
    `;
    modalContainer.style.display = 'block';
}

// Add evento para fechar o popup
recipeCloseBtn.addEventListener('click', closeRecipeModal);

function closeRecipeModal(){
    modalContainer.style.display = 'none';
}

searchInput.addEventListener('keyup', (e) => {
 if (e.key=== 'Enter')
{
    performSearch();
}

});

async function performSearch() {
    const ingredient = searchInput.value.trim();
    if(ingredient){
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
    
}

// Pesquisa de frango
window.addEventListener('load', () => {
    searchInput.value = 'chicken';
    performSearch();
} )