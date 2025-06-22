export interface RecipeSearchParams {
  title?: string;
  category_ids?: number[];
  tag_ids?: number[];
  source_type_id?: number;
  rating?: number;
  cook_time_max?: number;
  servings?: number;
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "updated_at" | "title" | "rating" | "cook_time";
  sort_order?: "asc" | "desc";
}

export interface SearchFilters {
  categories: number[];
  tags: number[];
  source_types: number[];
  rating_min?: number;
  rating_max?: number;
  cook_time_min?: number;
  cook_time_max?: number;
  servings_min?: number;
  servings_max?: number;
  date_from?: string;
  date_to?: string;
}
