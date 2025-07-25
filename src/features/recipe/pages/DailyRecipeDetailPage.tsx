import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Tag } from "../../../types/tag";
import type { RecipePhotoResponse } from "../../../types/api";
import PhotoUpload from "../../../components/PhotoUpload";
import PhotoGallery from "../../../components/PhotoGallery";
import { API_BASE_URL } from '../../../config/api';
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
  cooking_records: CookingRecords[];
}

interface CookingRecords {
  id?: number;
  cooking_date: string;
}
const DailyRecipeDetailPage = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState("");
  const [nonPrimaryPhotos, setNonPrimaryPhotos] = useState<
    RecipePhotoResponse[]
  >([]);
  const [photoError, setPhotoError] = useState<string>("");
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.recipe) {
      setRecipeData(location.state.recipe);
      fetchAvailableTags();
    }
  }, [location]);

  useEffect(() => {
    const fetchNonPrimaryPhotos = async () => {
      if (!recipeData?.id || !date) return;

      // 該当するcooking_recordを探す
      const matchingRecord = recipeData.cooking_records.find(
        (record) => record.cooking_date === date
      );

      if (!matchingRecord?.id) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/recipe/${recipeData.id}/cooking-record/${matchingRecord.id}/photos`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched non-primary photos:", data);
          setNonPrimaryPhotos(data);
        }
      } catch (error) {
        console.error("Error fetching cooking record photos:", error);
      }
    };

    if (recipeData?.id && date) {
      fetchNonPrimaryPhotos();
    }
  }, [recipeData?.id, date]);

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handlePhotoUploaded = (photo: RecipePhotoResponse) => {
    setNonPrimaryPhotos((prev) => [...prev, photo]);
    setPhotoError("");
  };

  const handlePhotoError = (error: string) => {
    setPhotoError(error);
    setTimeout(() => setPhotoError(""), 5000);
  };

  const handlePhotoDelete = async (photoId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/photo/${photoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNonPrimaryPhotos((prev) =>
          prev.filter((photo) => photo.id !== photoId)
        );
      } else {
        setPhotoError("写真の削除に失敗しました");
        setTimeout(() => setPhotoError(""), 5000);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      setPhotoError("写真の削除に失敗しました");
      setTimeout(() => setPhotoError(""), 5000);
    }
  };

  const addTagToRecipe = async (tagId: number) => {
    if (!recipeData?.id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/recipe/${recipeData.id}/tag/${tagId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        const addedTag = availableTags.find((tag) => tag.id === tagId);
        if (addedTag) {
          setRecipeData((prev) => ({
            ...prev!,
            tags: [...(prev!.tags || []), addedTag],
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
        `${API_BASE_URL}/recipe/${recipeData.id}/tag/${tagId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setRecipeData((prev) => ({
          ...prev!,
          tags: prev!.tags?.filter((tag) => tag.id !== tagId) || [],
        }));
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  const createTag = async () => {
    if (!tagInputValue.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tagInputValue.trim() }),
      });
      if (response.ok) {
        const newTag = await response.json();
        setAvailableTags((prev) => [...prev, newTag]);
        setTagInputValue("");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const updateTag = async (tagId: number, newName: string) => {
    if (!newName.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tag/${tagId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (response.ok) {
        const updatedTag = await response.json();
        setAvailableTags((prev) =>
          prev.map((tag) => (tag.id === tagId ? updatedTag : tag))
        );
        setRecipeData((prev) => ({
          ...prev!,
          tags: prev!.tags?.map((tag) => (tag.id === tagId ? updatedTag : tag)),
        }));
        setEditingTagId(null);
        setEditingTagName("");
      }
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const deleteTag = async (tagId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tag/${tagId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAvailableTags((prev) => prev.filter((tag) => tag.id !== tagId));
        setRecipeData((prev) => ({
          ...prev!,
          tags: prev!.tags?.filter((tag) => tag.id !== tagId) || [],
        }));
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
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
        `${API_BASE_URL}/recipe/record/${recipeData.id}/${date}`,
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
                <button
                  onClick={() => setShowTagManager(true)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors"
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
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  タグ管理
                </button>
              </div>
            </div>

            {/* 写真セクション */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">写真</h3>

              {/* エラーメッセージ */}
              {photoError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{photoError}</p>
                </div>
              )}

              {/* 写真アップロード */}
              {recipeData.id &&
                recipeData.cooking_records.length > 0 &&
                (() => {
                  const matchingRecord = recipeData.cooking_records.find(
                    (record) => record.cooking_date === date
                  );
                  return (
                    matchingRecord && (
                      <div className="mb-4">
                        <PhotoUpload
                          recipeId={recipeData.id}
                          cookingRecordId={matchingRecord.id!}
                          onPhotoUploaded={handlePhotoUploaded}
                          onError={handlePhotoError}
                        />
                      </div>
                    )
                  );
                })()}

              {/* 写真ギャラリー */}
              <PhotoGallery
                photos={nonPrimaryPhotos}
                onPhotoDelete={handlePhotoDelete}
              />
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
                .filter(
                  (tag) =>
                    !recipeData?.tags?.some(
                      (recipeTag) => recipeTag.id === tag.id
                    )
                )
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
              {availableTags.filter(
                (tag) =>
                  !recipeData?.tags?.some(
                    (recipeTag) => recipeTag.id === tag.id
                  )
              ).length === 0 && (
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

      {showTagManager && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">タグ管理</h3>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                新しいタグを追加
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInputValue}
                  onChange={(e) => setTagInputValue(e.target.value)}
                  placeholder="タグ名を入力"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      createTag();
                    }
                  }}
                />
                <button
                  onClick={createTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  追加
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                既存のタグ
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {availableTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    {editingTagId === tag.id ? (
                      <>
                        <input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              updateTag(tag.id, editingTagName);
                            }
                          }}
                        />
                        <button
                          onClick={() => updateTag(tag.id, editingTagName)}
                          className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => {
                            setEditingTagId(null);
                            setEditingTagName("");
                          }}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm">{tag.name}</span>
                        <button
                          onClick={() => {
                            setEditingTagId(tag.id);
                            setEditingTagName(tag.name);
                          }}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => deleteTag(tag.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {availableTags.length === 0 && (
                  <div className="text-gray-500 text-center py-4 text-sm">
                    タグがありません
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTagManager(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyRecipeDetailPage;
