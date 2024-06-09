import React, { useState, useEffect } from 'react';
import IngredientInput from './components/IngredientInput';
import IngredientList from './components/IngredientList';
import Auth from './components/Auth';
import { addIngredient, getIngredients, deleteIngredient, suggestRecipe } from './Api';
import { Container, Box, Button, Typography, Paper, Grid } from '@mui/material';
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
        } else {
            setIngredients([]);
        }
    }, [user]);

    const handleAddIngredient = async (ingredient) => {
        const response = await addIngredient(ingredient);
        setIngredients([...ingredients, { ...ingredient, id: response.id }]);
    };

    const handleDeleteIngredient = async (id) => {
        await deleteIngredient(id);
        setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    };

    const handleSuggestRecipe = async () => {
        const response = await suggestRecipe(ingredients);
        setRecipe(response.recipe);
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
            <Box textAlign="center" my={4}>
                <Typography variant="h3">Recipe Suggester</Typography>
            </Box>
            <Grid container spacing={2} justifyContent="center">
                {!user ? (
                    <Grid item xs={12} sm={8} md={6}>
                        <Auth setUser={setUser} />
                    </Grid>
                ) : (
                    <Grid item xs={12} sm={8} md={6}>
                        <IngredientInput onAddIngredient={handleAddIngredient} />
                        <IngredientList ingredients={ingredients} onDelete={handleDeleteIngredient} />
                        <Box textAlign="center" mt={4}>
                            <Button variant="contained" color="primary" onClick={handleSuggestRecipe}>Get Recipe</Button>
                        </Box>
                        {recipe && (
                            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                                <Typography variant="h6">Suggested Recipe:</Typography>
                                <Typography>{recipe}</Typography>
                            </Paper>
                        )}
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

export default App;