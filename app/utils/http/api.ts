import axios from 'axios';

const API_URL = 'https://assignment.stage.crafto.app';

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to set the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Add a response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Unauthorized access
            localStorage.removeItem('token'); // Clear the token
            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login'; // Redirect to the login page
            }
        }
        return Promise.reject(error); // Reject for other errors
    }
);

export interface LoginResponse {
    token: string;
}

export interface UploadResponse {
    type: string,
    url: string
}
// Function to log in the user and store the token
export const loginUser = async (username: string, otp: string): Promise<any> => {
    const response = await api.post<LoginResponse>('/login', { username, otp });
    if (response?.data?.token) {
        localStorage.setItem('token', response?.data?.token); // Store the token in localStorage
    }
    return response.data;
};

// Function to upload an image
export const uploadImage = async (formData: FormData): Promise<UploadResponse[]> => {
    const response = await axios.post<UploadResponse[]>('https://crafto.app/crafto/v1.0/media/assignment/upload', formData);
    return response.data;
};

// Quote interface definition
export interface Quote {
    id: number;
    text: string;
    mediaUrl: string;
    username: string;
    createdAt: string;
}

// Function to create a quote
export const createQuote = async (payload: object): Promise<void> => {
    await api.post('/postQuote', { payload });
};

// Function to get quotes with pagination
export const getQuotes = async (limit = 20, offset = 0): Promise<Quote[]> => {
    const response = await api.get<{ data: Quote[] }>(`/getQuotes?limit=${limit}&offset=${offset}`);
    return response.data.data; // Access the 'data' property to get the quotes array
};
