import type { SourceType, PhotoType } from "./source";
import type { Category } from "./category";
import type { Tag } from "./tag";
import type { Rating } from "./common";

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  cook_time?: number;
  servings?: number;
  source_type_id: number;
  source_url?: string;
  source_book_title?: string;
  source_page?: number;
  manual_identifier?: string;
  cooking_date?: Date;
  cooking_memo?: string;
  rating?: Rating;
  created_at: Date;
  updated_at: Date;
}

export interface RecipePhoto {
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
  created_at: Date;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  quantity?: string;
  unit?: string;
  sort_order: number;
  notes?: string;
  created_at: Date;
}

export interface Step {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction: string;
  time_estimate?: number;
  temperature?: number;
  notes?: string;
  created_at: Date;
}

export interface CookingRecord {
  id: number;
  recipe_id: number;
  cooking_date: Date;
  actual_servings?: number;
  actual_cook_time?: number;
  rating?: Rating;
  cooking_memo?: string;
  difficulty_rating?: number;
  estimated_cost?: number;
  occasion?: string;
  created_at: Date;
  updated_at: Date;
}

// リレーション付きの型
export interface RecipeWithRelations extends Recipe {
  source_type?: SourceType;
  photos?: RecipePhoto[];
  ingredients?: Ingredient[];
  steps?: Step[];
  categories?: Category[];
  tags?: Tag[];
  cooking_records?: CookingRecord[];
}

export interface RecipePhotoWithRelations extends RecipePhoto {
  photo_type?: PhotoType;
  recipe?: Recipe;
}

export interface CookingRecordWithRelations extends CookingRecord {
  recipe?: Recipe;
}
