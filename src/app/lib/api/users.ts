import { apiClient } from './base';
import { User, ApiResponse } from '@/app/types';

export interface CreateUserData {
    email: string;
    password: string;
    password_confirmation: string;
    name: string;
    address?: string;
    role?: 'customer' | 'admin';
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password_confirmation'>> { }

export interface LoginData {
    email: string;
    password: string;
}

const USERS_ENDPOINT = '/users';

// Get all users (admin only)
export const getUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>(USERS_ENDPOINT);
    return response.data;
};

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`${USERS_ENDPOINT}/${id}`);
    return response.data;
};

// Create user (registration)
export const createUser = async (userData: CreateUserData): Promise<User> => {
    const response = await apiClient.post<User>(USERS_ENDPOINT, { user: userData });
    return response.data;
};

// Update user
export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await apiClient.put<User>(`${USERS_ENDPOINT}/${id}`, { user: userData });
    return response.data;
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(`${USERS_ENDPOINT}/${id}`);
};

// Login user (returns user data and token)
export const loginUser = async (loginData: LoginData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', loginData);

    // Store token in localStorage
    if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
    }

    return response.data;
};

// Logout user
export const logoutUser = async (): Promise<void> => {
    await apiClient.delete('/auth/logout');
    localStorage.removeItem('auth_token');
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
};

// Maintain backward compatibility with service object
export const usersService = {
    getAll: getUsers,
    getById: getUserById,
    create: createUser,
    update: updateUser,
    delete: deleteUser,
    login: loginUser,
    logout: logoutUser,
    getCurrentUser,
};

export default usersService;