import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const IngredientList = ({ ingredients, onDelete }) => {
    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h6">Ingredients</Typography>
            <List>
                {ingredients.map((ingredient, index) => (
                    <ListItem key={index}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(ingredient.id)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={`${ingredient.name} - ${ingredient.quantity}`} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default IngredientList;