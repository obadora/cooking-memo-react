import { useState } from "react";
import type { RecipePhotoResponse } from "../types/api";
import { API_BASE_URL } from "../config/api";

interface PhotoGalleryProps {
  photos: RecipePhotoResponse[];
  onPhotoDelete: (photoId: number) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onPhotoDelete,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  const handleDeletePhoto = (photoId: number) => {
    onPhotoDelete(photoId);
    setShowDeleteConfirm(null);
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(null);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        追加された写真がありません
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer"
            onClick={() => handlePhotoClick(index)}
          >
            <img
              src={`${API_BASE_URL}${photo.photo_url}`}
              alt={photo.alt_text || `レシピ写真 ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg shadow hover:shadow-md transition-shadow"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200"></div>
          </div>
        ))}
      </div>

      {/* フルスクリーンモーダル */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={`${API_BASE_URL}${photos[selectedPhotoIndex].photo_url}`}
              alt={
                photos[selectedPhotoIndex].alt_text ||
                `レシピ写真 ${selectedPhotoIndex + 1}`
              }
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* 閉じるボタン */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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

            {/* 削除ボタン */}
            <button
              onClick={() =>
                setShowDeleteConfirm(photos[selectedPhotoIndex].id)
              }
              className="absolute top-4 left-4 bg-red-500 bg-opacity-80 text-white rounded-full p-2 hover:bg-opacity-100 transition-all"
            >
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
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" x2="10" y1="11" y2="17"></line>
                <line x1="14" x2="14" y1="11" y2="17"></line>
              </svg>
            </button>

            {/* 前の写真ボタン */}
            {selectedPhotoIndex > 0 && (
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
            )}

            {/* 次の写真ボタン */}
            {selectedPhotoIndex < photos.length - 1 && (
              <button
                onClick={handleNextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            )}

            {/* 写真番号表示 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedPhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
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
              <h3 className="text-xl font-bold text-gray-900">写真を削除</h3>
            </div>
            <p className="text-gray-600 mb-6">
              この写真を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeletePhoto(showDeleteConfirm)}
                className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
