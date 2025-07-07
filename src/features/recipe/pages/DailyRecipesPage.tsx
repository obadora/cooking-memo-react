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
  id?: number;
  title: string;
  description?: string;
  ingredients: RecipeIngredient[]; // オブジェクトの配列に変更
  steps: RecipeStep[]; // オブジェクトの配列に変更
  cook_time?: number;
  servings?: number;
  source_url?: string;
  recipe_photos: RecipePhoto[];
}

const DailyRecipesPage = () => {
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
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
        body: JSON.stringify({ source_url: inputUrl, cooking_date: date }),
      });
      const data = await response.json();
      setRecipes((prev) => [...prev, data]);
      setInputUrl("");
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
    navigate("/calendar");
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleRecipeClick = (recipe: RecipeData) => {
    navigate(`/recipe/${date}/detail`, { state: { recipe } });
  };

  // 日付のレシピを取得する関数
  const fetchRecipesForDate = async (cookingDate: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/recipes/date/${cookingDate}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Selected date:", data);
        setRecipes(data);
      } else {
        console.error("Failed to fetch recipes for date:", cookingDate);
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recipes for date:", error);
      setRecipes([]);
    }
  };

  // 日付が変更された時にレシピを取得
  useEffect(() => {
    if (date) {
      fetchRecipesForDate(date);
    }
  }, [date]);
  // const recipes = getDayRecipes(selectedDate);
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
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
          {recipes.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id || index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow aspect-square relative"
                >
                  <div
                    onClick={() => handleRecipeClick(recipe)}
                    className="cursor-pointer h-full"
                  >
                    <div className="h-3/4 overflow-hidden">
                      {recipe.recipe_photos &&
                      recipe.recipe_photos.length > 0 ? (
                        <img
                          src={recipe.recipe_photos[0].photo_url}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">画像なし</span>
                        </div>
                      )}
                    </div>
                    <div className="h-1/4 p-3 flex items-center">
                      <h3 className="text-sm font-semibold line-clamp-2 text-gray-800">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>レシピのURLを入力してレシピを追加してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyRecipesPage;
