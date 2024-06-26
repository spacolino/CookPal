import axios from 'axios';

const API_URL = 'http://localhost:5000';

axios.defaults.withCredentials = true;

export const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
};

export const addIngredient = async (ingredient) => {
    const response = await axios.post(`${API_URL}/ingredients`, ingredient, { withCredentials: true });
    return response.data;
};

export const getIngredients = async () => {
    const response = await axios.get(`${API_URL}/ingredients`, { withCredentials: true });
    return response.data.ingredients;
};

export const deleteIngredient = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/ingredients/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        throw error;
    }
};

export const suggestRecipe = async (ingredients) => {
    const response = await axios.post(`${API_URL}/suggest-recipe`, { ingredients }, { withCredentials: true });
    return response.data;
};
