import axios from "axios";

const httpRequest = axios.create({
  withCredentials: true,
});

export default httpRequest;
