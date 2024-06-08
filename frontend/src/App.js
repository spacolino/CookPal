import React, { useState, useEffect } from 'react';
import IngredientInput from './components/IngredientsInput.js';
import IngredientList from './components/IngredientsList.js';
import Auth from './components/Auth.js';
import { addIngredient, getIngredients, suggestRecipe } from './Api';
import './App.css';

function App() {
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user) {
            async function fetchIngredients() {
                const ingredients = await getIngredients();
                setIngredients(ingredients);
            }
            fetchIngredients();
        }
    }, [user]);

    const handleAddIngredient = async (ingredient) => {
        await addIngredient(ingredient);
        setIngredients([...ingredients, ingredient]);
    };

    const handleSuggestRecipe = async () => {
        const response = await suggestRecipe(ingredients);
        setRecipe(response.recipe);
    };

    return (
        <div>
            <h1>Recipe Suggester</h1>
            {!user ? (
                <Auth setUser={setUser} />
            ) : (
                <div>
                    <IngredientInput onAddIngredient={handleAddIngredient} />
                    <IngredientList ingredients={ingredients} />
                    <button onClick={handleSuggestRecipe}>Get Recipe</button>
                    {recipe && (
                        <div>
                            <h2>Suggested Recipe:</h2>
                            <p>{recipe}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;