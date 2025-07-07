export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface RecipePhotoResponse {
  id: number;
  recipe_id: number;
  photo_url: string;
  photo_type_id: number;
  is_primary: boolean;
  sort_order: number;
  alt_text?: string;
  file_size?: number;
  width?: number;
  height?: number;
  created_at: string;
}

export interface RecipePhotoCreate {
  photo_url: string;
  photo_type_id: number;
  is_primary?: boolean;
  alt_text?: string;
  file_size?: number;
  width?: number;
  height?: number;
}
