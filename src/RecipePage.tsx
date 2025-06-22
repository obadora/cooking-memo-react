import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { Recipe } from "./types/recipe";

interface RecipeIngredient {
  name: string;
  quantity?: string;
  unit?: string;
}

interface RecipeStep {
  instruction: string;
  step_number?: number;
  time_estimate?: number;
}

interface RecipePhoto {
  photo_url: string;
}

interface RecipeData {
  title: string;
  description?: string;
  ingredients: RecipeIngredient[]; // オブジェクトの配列に変更
  steps: RecipeStep[]; // オブジェクトの配列に変更
  cook_time?: number;
  servings?: number;
  source_url?: string;
  recipe_photos: RecipePhoto[];
}

const RecipePage = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  // URL送信ハンドラ
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    try {
      const response = await fetch("http://localhost:8000/recipe/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_url: inputUrl }),
      });
      const data = await response.json();
      setRecipeData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   // 初期表示時は従来通りGET
  //   fetch("http://localhost:8000/scrape")
  //     .then((response) => response.json())
  //     .then((data) => setRecipeData(data))
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []);

  const handleBackToCalendar = (): void => {
    navigate("/");
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (!recipeData) {
    // return (
    //   <div className="h-screen bg-gray-100 p-4 flex items-center justify-center">
    //     <div className="text-lg">Loading...</div>
    //   </div>
    // );
  }

  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col">
      <form
        onSubmit={handleUrlSubmit}
        className="mb-4 flex gap-2 max-w-2xl mx-auto w-full"
      >
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="レシピのURLを入力"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          送信
        </button>
      </form>
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-4 flex-shrink-0">
          {formatDate(date)}のレシピ
        </h1>
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <button
            onClick={handleBackToCalendar}
            className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            ← カレンダーに戻る
          </button>
          {recipeData && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* 画像をタイトルの上に表示 */}
              {recipeData?.recipe_photos && (
                <img
                  src={recipeData.recipe_photos[0].photo_url}
                  alt={recipeData.title}
                  className="mx-auto mb-4 rounded shadow max-h-64 object-contain"
                />
              )}
              <h2 className="text-2xl font-bold mb-4">{recipeData.title}</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">材料</h3>
                <ul className="list-disc list-inside space-y-1">
                  {recipeData.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">手順</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {recipeData.steps.map((step, index) => (
                    <li key={index} className="text-gray-700">
                      {step.instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
