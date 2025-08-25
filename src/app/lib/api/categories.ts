import apiClient from "./base";
import { Category} from "@/app/types";

export interface CreateCategoryData {
    name: string;
    description?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

const CATEGORIES_ENDPOINT = '/categories';

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>(CATEGORIES_ENDPOINT);
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await apiClient.get<Category>(`${CATEGORIES_ENDPOINT}/${id}`);
  return response.data;
};

export const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  const response = await apiClient.post<Category>(CATEGORIES_ENDPOINT, { category: categoryData });
  return response.data;
};

export const updateCategory = async (id: number, categoryData: UpdateCategoryData): Promise<Category> => {
  const response = await apiClient.put<Category>(`${CATEGORIES_ENDPOINT}/${id}`, { category: categoryData });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`${CATEGORIES_ENDPOINT}/${id}`);
};

// Maintain backward compatibility with the original service object
export const categoriesService = {
  getAll: getCategories,
  getById: getCategoryById,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory,
};

export default categoriesService;