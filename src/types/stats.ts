import type { Category } from "./category";
import type { Tag } from "./tag";

export interface RecipeStats {
  total_recipes: number;
  total_cooking_records: number;
  average_rating: number;
  most_used_categories: CategoryUsage[];
  most_used_tags: TagUsage[];
  cooking_frequency: CookingFrequency[];
}

export interface CategoryUsage {
  category: Category;
  count: number;
}

export interface TagUsage {
  tag: Tag;
  count: number;
}

export interface CookingFrequency {
  month: string;
  count: number;
}

export interface MonthlyStats {
  month: string;
  recipes_created: number;
  recipes_cooked: number;
  average_rating: number;
}
