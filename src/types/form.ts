import type { Rating } from "./common";

export interface CreateRecipeData {
  title: string;
  description?: string;
  cook_time?: number;
  servings?: number;
  source_type_id: number;
  source_url?: string;
  source_book_title?: string;
  source_page?: number;
  manual_identifier?: string;
  cooking_date?: string;
  cooking_memo?: string;
  rating?: Rating;
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: number;
}

export interface CreateIngredientData {
  name: string;
  quantity?: string;
  unit?: string;
  sort_order: number;
  notes?: string;
}

export interface CreateStepData {
  step_number: number;
  instruction: string;
  time_estimate?: number;
  temperature?: number;
  notes?: string;
}

export interface CreateCookingRecordData {
  recipe_id: number;
  cooking_date: string;
  actual_servings?: number;
  actual_cook_time?: number;
  rating?: Rating;
  cooking_memo?: string;
  difficulty_rating?: number;
  estimated_cost?: number;
  occasion?: string;
}

export interface CreateCategoryData {
  name: string;
  color: string;
}

export interface CreateTagData {
  name: string;
}
