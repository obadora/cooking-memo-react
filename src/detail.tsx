import { useEffect, useState } from "react";

interface RecipeData {
  title: string;
  ingredients: string[];
  steps: string[];
}

const RecipeDisplay = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/scrape") // FastAPIエンドポイントにリクエストを送る
      .then((response) => response.json())
      .then((data) => setRecipeData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!recipeData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{recipeData.title}</h1>
      <h2>材料</h2>
      <ul>
        {recipeData.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>手順</h2>
      <ol>
        {recipeData.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDisplay;
