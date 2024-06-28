//products-Service

import axios from "axios"

const API_BASE_URL = "http://localhost:3000/products-detail";

const ProductsService = {

    getAllProductsDetail: async ()=>  {
        try {
            const response = await axios.get(`${API_BASE_URL}/get`, {withCredentials: true});
            return response.data;
        }
        catch(error){
            console.error("Eylemleri getiriken hata" ,error);
            throw error;
        }
    },

    getProductDetailById: async (id) => {
        try{
            const response = await axios.get(`${API_BASE_URL}/get/${id}` , {withCredentials: true});
            return response.data;
        }
        catch(error){
            console.error("İd'si ${id} olan eylemi getiriken hata", error);
            throw error;
        }
    },

    getProductDetailByProductId: async (productId) => {
        try{
            const response = await axios.get(`${API_BASE_URL}/getDetailByProductId/${productId}` , {withCredentials: true});
            return response.data;
        }
        catch(error){
            console.error("İd'si ${categoryId} olan eylemi getiriken hata", error);
            throw error;
        }
    },
    saveProduct: async (productDetail) => {
        try{
            const response = await axios.post(`${API_BASE_URL}/create`, productDetail);
            return response.data;
        }
        catch(error){
            console.error("Eylemi kaydederken hata", error);
            throw error;
        }
    },

    updateProduct: async (id, productDetail) => {
        try{
            const response = await axios.put(`${API_BASE_URL}/update/${id}`, productDetail);
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