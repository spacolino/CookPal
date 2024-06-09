import React, { useState } from 'react';
import { Box, Button, TextField, Paper } from '@mui/material';

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
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Ingredient Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Quantity"
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAdd}>Add Ingredient</Button>
            </Box>
        </Paper>
    );
};

export default IngredientInput;