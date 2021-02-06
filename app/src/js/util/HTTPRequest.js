import axios from 'axios';

const httpRequest = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000"
});

export default httpRequest;
