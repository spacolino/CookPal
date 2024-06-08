import React, { useState } from 'react';

const IngredientInput = ({ onAddIngredient }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleAdd = () => {
        if (name && quantity) {
            onAddIngredient({ name, quantity });
            setName('');
            setQuantity('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter ingredient name"
            />
            <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
            />
            <button onClick={handleAdd}>Add</button>
        </div>
    );
};

export default IngredientInput;