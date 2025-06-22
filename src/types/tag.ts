export interface Tag {
  id: number;
  name: string;
  created_at: Date;
}

export interface RecipeTag {
  recipe_id: number;
  tag_id: number;
}
