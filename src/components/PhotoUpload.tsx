import { useState, useRef } from "react";
import type { RecipePhotoResponse } from "../types/api";
import { API_BASE_URL } from "../config/api";

interface PhotoUploadProps {
  recipeId: number;
  cookingRecordId: number; // cooking_record_idを追加
  onPhotoUploaded: (photo: RecipePhotoResponse) => void;
  onError: (error: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  recipeId,
  cookingRecordId,
  onPhotoUploaded,
  onError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("画像ファイルを選択してください");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError("ファイルサイズは10MB以下にしてください");
      return;
    }

    setIsUploading(true);

    try {
      // FormDataを使用してファイルをアップロード
      const formData = new FormData();
      formData.append("file", file);
      formData.append("photo_type_id", "3");
      formData.append("is_primary", "false");
      formData.append("sort_order", "0");
      formData.append("alt_text", file.name);

      console.log("Uploading photo with FormData to new endpoint");

      const response = await fetch(
        `${API_BASE_URL}/recipe/${recipeId}/cooking-record/${cookingRecordId}/photo/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const uploadedPhoto = await response.json();
        onPhotoUploaded(uploadedPhoto);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json();
        console.error("Upload error response:", errorData);
        
        // detailが配列の場合の処理
        let errorMessage = "アップロードに失敗しました";
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const detailMessages = errorData.detail.map((item: any) => 
            typeof item === 'object' ? item.msg || JSON.stringify(item) : String(item)
          );
          errorMessage = detailMessages.join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = String(errorData.detail);
        }
        
        onError(errorMessage);
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError("アップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
          <circle cx="12" cy="13" r="3"></circle>
        </svg>
        {isUploading ? "アップロード中..." : "写真を追加"}
      </button>
    </div>
  );
};

export default PhotoUpload;
