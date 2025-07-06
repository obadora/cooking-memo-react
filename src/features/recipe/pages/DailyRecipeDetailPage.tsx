import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Tag } from "../../../types/tag";
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
  source_type_id: number;
  recipe_photos: RecipePhoto[];
  tags?: Tag[];
}

const DailyRecipeDetailPage = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.recipe) {
      setRecipeData(location.state.recipe);
      fetchAvailableTags();
    }
  }, [location]);

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch("http://localhost:8000/tags");
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const addTagToRecipe = async (tagId: number) => {
    if (!recipeData?.id) return;
    
    try {
      const response = await fetch(
        `http://localhost:8000/recipe/${recipeData.id}/tag/${tagId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        const addedTag = availableTags.find(tag => tag.id === tagId);
        if (addedTag) {
          setRecipeData(prev => ({
            ...prev!,
            tags: [...(prev!.tags || []), addedTag]
          }));
        }
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const removeTagFromRecipe = async (tagId: number) => {
    if (!recipeData?.id) return;
    
    try {
      const response = await fetch(
        `http://localhost:8000/recipe/${recipeData.id}/tag/${tagId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setRecipeData(prev => ({
          ...prev!,
          tags: prev!.tags?.filter(tag => tag.id !== tagId) || []
        }));
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  const handleBackToCalendar = (): void => {
    navigate("/calendar");
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
      const response = await fetch(
        `http://localhost:8000/recipe/record/${recipeData.id}/${date}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setShowDeleteConfirm(false);
        navigate(`/recipe/${date}`);
      } else {
        console.error("削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
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
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-lg">レシピデータがありません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-4 flex-shrink-0">
          {formatDate(date)}のレシピ詳細
        </h1>
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="mb-4 flex gap-2">
            <button
              onClick={handleBackToRecipeList}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              ← 戻る
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* 画像をタイトルの上に表示 */}
            {recipeData?.recipe_photos &&
              recipeData.recipe_photos.length > 0 && (
                <img
                  src={recipeData.recipe_photos[0].photo_url}
                  alt={recipeData.title}
                  className="mx-auto mb-4 rounded shadow max-h-64 object-contain"
                />
              )}
            <h2 className="text-2xl font-bold mb-4">{recipeData.title}</h2>
            <div className="mb-6">
              {recipeData.source_type_id === 1 && recipeData.source_url ? (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">参照元URL:</p>
                  <a
                    href={recipeData.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all underline"
                  >
                    {recipeData.source_url}
                  </a>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">レシピ本の情報です</p>
                </div>
              )}
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

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">タグ</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {recipeData.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag.name}
                    <button
                      onClick={() => removeTagFromRecipe(tag.id)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" x2="6" y1="6" y2="18"></line>
                        <line x1="6" x2="18" y1="6" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setShowTagSelector(true)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" x2="12" y1="5" y2="19"></line>
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                  </svg>
                  タグを追加
                </button>
              </div>
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
                  この日のレシピを削除する
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
            <p className="text-gray-600 mb-6 leading-relaxed">
              「{recipeData.title}
              」を削除します。他の日付には残ります。
            </p>
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

      {showTagSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">タグを追加</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {availableTags
                .filter(tag => !recipeData?.tags?.some(recipeTag => recipeTag.id === tag.id))
                .map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      addTagToRecipe(tag.id);
                      setShowTagSelector(false);
                    }}
                    className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    {tag.name}
                  </button>
                ))}
              {availableTags.filter(tag => !recipeData?.tags?.some(recipeTag => recipeTag.id === tag.id)).length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  追加できるタグがありません
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTagSelector(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyRecipeDetailPage;
