import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/user",
    withCredentials: true, // Include session cookies for authentication
});

export default API;