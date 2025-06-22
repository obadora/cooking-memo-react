export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: Date;
}

export interface RecipeCategory {
  recipe_id: number;
  category_id: number;
}
