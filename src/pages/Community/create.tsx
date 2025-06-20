import { useState, useEffect, useRef } from "react";
import { X, Check, Upload, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { createPost } from "../../apis/createPost";
import { useTranslation } from 'react-i18next';
import imageCompression from "browser-image-compression";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageRequiredModalOpen, setIsImageRequiredModalOpen] = useState(false); // 팝업 상태 추가
  const [isUploading, setIsUploading] = useState(false);
  const [beforeSize, setBeforeSize] = useState<number>(0);
  const [afterSize, setAfterSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();
  const NAVBAR_HEIGHT = 90;

  // 이미지 업로드 영역 클릭 시 파일 선택창 열기
  const handleClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  // 추가 이미지 업로드 버튼 클릭
  const handleAdditionalUpload = () => {
    if (!isUploading) additionalFileInputRef.current?.click();
  };

  // 파일 사이즈 합산(바이트)
  const getTotalSize = (files: File[]) =>
    files.reduce((acc, file) => acc + file.size, 0);

  // 첫 번째 이미지 파일 선택 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setBeforeSize(getTotalSize(files));
    try {
      const options = {
        maxSizeMB: 0.63,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFiles = await Promise.all(
        files.map(file => imageCompression(file, options))
      );
      setAfterSize(getTotalSize(compressedFiles));
      setImages(compressedFiles);

      // 이미지 미리보기 생성
      const previews = compressedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      setCurrentImageIndex(0);
    } finally {
      setIsUploading(false);
    }
  };

  // 추가 이미지 파일 선택 핸들러
  const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setBeforeSize(getTotalSize([...images, ...files]));
    try {
      const options = {
        maxSizeMB: 0.63,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFiles = await Promise.all(
        files.map(file => imageCompression(file, options))
      );
      const newImages = [...images, ...compressedFiles];
      setAfterSize(getTotalSize(newImages));
      setImages(newImages);

      const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));
      const allPreviews = [...imagePreviews, ...newPreviews];
      setImagePreviews(allPreviews);
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    if (isUploading) return;
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);

    setBeforeSize(getTotalSize(newImages));
    setAfterSize(getTotalSize(newImages));
    if (currentImageIndex >= newImages.length && newImages.length > 0) {
      setCurrentImageIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentImageIndex(0);
    }
  };

  // 슬라이드 네비게이션
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagePreviews.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === imagePreviews.length - 1 ? 0 : prev + 1));
  };

  // 게시물 작성 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;

    if (images.length === 0) {
      setIsImageRequiredModalOpen(true); // 팝업 열기
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert(t("createPostPage.alertTitleContent"));
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost({
        title: title.trim(),
        content: content.trim(),
        images,
      });
      alert(t("createPostPage.success"));
      window.location.href = "/community";
    } catch (error) {
      console.error("게시물 작성 실패:", error);
      alert(t("createPostPage.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="min-h-screen h-screen bg-white">
      <Navbar />
      <main
        className="flex flex-col items-center w-full"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginTop: NAVBAR_HEIGHT,
        }}
      >
        <div className="w-full max-w-2xl mx-auto mt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("createPostPage.title")}</h1>
            <p className="text-gray-600">{t("createPostPage.desc")}</p>
          </div>
          
          

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 게시물 제목 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("createPostPage.form.title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t("createPostPage.form.titlePlaceholder")}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-[#ff651b] focus:border-[#ff651b]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isUploading}
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("createPostPage.form.images")} <span className="text-red-500">*</span>
              </label>
              {imagePreviews.length > 0 ? (
                <div className="border border-gray-300 rounded-md p-4">
                  <div className="relative h-64 w-full flex items-center justify-center bg-gray-50 rounded">
                    <img
                      src={imagePreviews[currentImageIndex]}
                      alt={t("createPostPage.form.uploadedImageAlt", { index: currentImageIndex + 1 })}
                      className="object-contain w-full h-full"
                    />
                    {imagePreviews.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={goToPrevious}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                          disabled={isUploading}
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-800" />
                        </button>
                        <button
                          type="button"
                          onClick={goToNext}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                          disabled={isUploading}
                        >
                          <ChevronRight className="h-5 w-5 text-gray-800" />
                        </button>
                      </>
                    )}
                  </div>
                  {imagePreviews.length > 1 && (
                    <div className="flex justify-center mt-3 space-x-2">
                      {imagePreviews.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 w-2 rounded-full ${
                            index === currentImageIndex ? "bg-[#ff651b]" : "bg-gray-300"
                          }`}
                          disabled={isUploading}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-[#ff651b] transition-colors cursor-pointer flex flex-col items-center justify-center ${
                    isUploading ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={handleClick}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-base text-black font-semibold">
                    {t("createPostPage.form.imageUploadText")}
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={isUploading}
              />
              <input
                type="file"
                accept="image/*"
                multiple
                ref={additionalFileInputRef}
                style={{ display: "none" }}
                onChange={handleAdditionalImageChange}
                disabled={isUploading}
              />
            </div>
            {/* 업로드된 이미지 목록 */}
            {images.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("createPostPage.form.uploadedImages")} <span className="text-red-500">* {/* 용량 정보 */}
                    {beforeSize > 0 && (
                      <div className="text-sm text-gray-500 mt-1 mb-1">
                        {t("createPostPage.form.imageSizeInfo", {
                          before: (beforeSize / 1024 / 1024).toFixed(2),
                          after: (afterSize / 1024 / 1024).toFixed(2),
                        })}
                        {/* 전체 이미지 크기 ui */}
                      </div>
                    )}</span>
                </label>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 flex flex-col items-end">
                  <div className="w-full space-y-2">
                    {images.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                        {/* 개별 이미지 파일 크기(압축 후) 표시 */}
                        <span className="text-xs text-gray-400 ml-2">
                          {t("createPostPage.form.fileSize", {
                            size: (file.size / 1024 / 1024).toFixed(2),
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))} {/* 업로드/압축 중 로딩 */}
                      {isUploading && (
                        <div className="flex justify-center items-center gap-2 text-[#ff651b] font-medium mb-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="#ff651b" strokeWidth="4" fill="none"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="#ff651b" strokeWidth="4" fill="none"/>
                          </svg>
                          {t("createPostPage.form.uploading")} {/* ex: "업로드 중..." */}
                        </div>
                      )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAdditionalUpload}
                    className="mt-3 flex items-center justify-center gap-2 p-2 border border-solid border-[#ff651b] rounded text-[#ff651b] hover:bg-[#ff651b] hover:text-white transition-colors self-end"
                    disabled={isUploading}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">{t("createPostPage.form.addImageBtn")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 게시물 내용 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("createPostPage.form.content")} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                placeholder={t("createPostPage.form.contentPlaceholder")}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-[#ff651b] focus:border-[#ff651b]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isUploading}
              />
            </div>
            {/* 버튼 그룹 */}
            <div className="flex justify-end space-x-4 pt-4 pb-10">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => window.history.back()}
                disabled={isUploading}
              >
                {t("createPostPage.form.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-6 py-2 rounded-md text-white flex items-center gap-2 bg-[#ff651b] disabled:bg-gray-400"
              >
                {(isSubmitting || isUploading) ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Check className="h-5 w-5" />
                )}
                {isSubmitting
                  ? t("createPostPage.form.posting")
                  : isUploading
                    ? t("createPostPage.form.uploading")
                    : t("createPostPage.form.post")}
              </button>
            </div>
          </form>
        </div>
      </main>
      {/* 이미지 업로드 요청 팝업 */}
      {isImageRequiredModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">{t("createPostPage.imageRequired.title")}</h2>
              <p className="text-sm text-gray-500">{t("createPostPage.imageRequired.desc")}</p>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => setIsImageRequiredModalOpen(false)}
              >
                {t("createPostPage.imageRequired.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
