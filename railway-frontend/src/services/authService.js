import axios from 'axios';

const API_BASE_URL = 'http://localhost:8086';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user-service/users/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorData = error.response.data.toLowerCase();
      
      // First check for email conflict
      if (errorData.includes('email already exist')) {
        throw new Error('Email already exists. Please use a different email.');
      }
      // Then check for username conflict
      else if (errorData.includes('username already exist')) {
        throw new Error('Username already exists. Please choose a different username.');
      }
      else if (error.response.status === 400) {
        throw new Error('Validation failed. Please check your input.');
      } else {
        throw new Error(error.response.data || 'Registration failed. Please try again.');
      }
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user-service/users/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error('User login failed. Please check your username and password and try again.');
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin-service/admins/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error('Admin login failed. Please check your username and password and try again.');
  }
};
