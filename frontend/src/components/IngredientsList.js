import React from 'react';

const IngredientList = ({ ingredients }) => {
    return (
        <ul>
            {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name} - {ingredient.quantity}</li>
            ))}
        </ul>
    );
};

export default IngredientList;
