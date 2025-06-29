import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

const RecipePage = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.recipe) {
      setRecipeData(location.state.recipe);
    }
  }, [location]);

  const handleBackToCalendar = (): void => {
    navigate("/");
  };

  const handleBackToRecipeList = (): void => {
    navigate(`/recipe/${date}`);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleDeleteRecipe = async () => {
    if (!recipeData?.id || !date) return;

    try {
      const response = await fetch(`http://localhost:8000/recipe/record/${recipeData.id}/${date}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteConfirm(false);
        navigate(`/recipe/${date}`);
      } else {
        console.error('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!recipeData) {
    return (
      <div className="h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-lg">レシピデータがありません</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col">
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-4 flex-shrink-0">
          {formatDate(date)}のレシピ詳細
        </h1>
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="mb-4 flex gap-2">
            <button
              onClick={handleBackToCalendar}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
            >
              ← カレンダーに戻る
            </button>
            <button
              onClick={handleBackToRecipeList}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              ← レシピ一覧に戻る
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* 画像をタイトルの上に表示 */}
            {recipeData?.recipe_photos && recipeData.recipe_photos.length > 0 && (
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
            
            {/* 削除ボタン */}
            {recipeData.id && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={confirmDelete}
                  className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-medium py-3 px-6 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                  このレシピを削除する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-600"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">レシピを削除</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">「{recipeData.title}」を完全に削除します。この操作は取り消すことができません。</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-150 font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteRecipe}
                className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-150 font-medium shadow-lg"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
