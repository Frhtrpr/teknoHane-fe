//products-Service

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/products";

const ProductsService = {

    getAllProducts: async ()=>  {
        try {
            const response = await axios.get(`${API_BASE_URL}/get`, {withCredentials: true});
            return response.data;
        }
        catch(error){
            console.error("Eylemleri getiriken hata" ,error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try{
            const response = await axios.get(`${API_BASE_URL}/get/${id}` , {withCredentials: true});
            return response.data;
        }
        catch(error){
            console.error("İd'si ${id} olan eylemi getiriken hata", error);
            throw error;
        }
    },

    getProductByCategoryId: async (categoryId) => {
        try{
            const response = await axios.get(`${API_BASE_URL}/get/categoryId/${categoryId}` , {withCredentials: true});
            return response.data;
        }
        catch(error){
            console.error("İd'si ${categoryId} olan eylemi getiriken hata", error);
            throw error;
        }
    },
    saveProduct: async (product) => {
        try{
            const response = await axios.post(`${API_BASE_URL}/create`, product);
            return response.data;
        }
        catch(error){
            console.error("Eylemi kaydederken hata", error);
            throw error;
        }
    },

    updateProduct: async (id, product) => {
        try{
            const response = await axios.put(`${API_BASE_URL}/update/${id}`, product);
            return response.data;
        }
        catch(error){
            console.error("İd si ${id} olan eylemi güncellerken hata", error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try{
            const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
            return response.data;
        }
        catch(error){
            console.error("Id' si ${id} olan eylemi silerken hata" ,error);
            throw error;
        }
    },

}

export default ProductsService;