import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Check, Upload, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { getPost, updatePost } from "../../apis/post";
import imageCompression from "browser-image-compression";

const NAVBAR_HEIGHT = 90;

export default function PostModify() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) {
        alert("잘못된 접근입니다. 게시물 ID가 없습니다.");
        navigate(-1); // 이전 페이지로 이동
        return;
      }
      try {
        const response = await getPost(parseInt(postId));
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        const imageUrls = post.images.map((img) => img.imageUrl);
        setExistingImages(imageUrls);
        setImagePreviews(imageUrls);
        console.log("게시물 데이터 불러오기 성공:", post);
      } catch (error) {
        console.error("게시물 불러오기 실패:", error);
        alert("게시물을 불러오지 못했습니다");
      }
    };
    fetchPostData();
  }, [postId]);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.63,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      const compressedFiles = await Promise.all(files.map(compressImage));
      setNewImages((prev) => [...prev, ...compressedFiles]);
      const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      console.log("이미지 추가 완료:", compressedFiles.length, "개");
    } catch (error) {
      console.error("이미지 압축 실패:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (index < existingImages.length) {
      const removedUrl = existingImages[index];
      setRemovedImageUrls((prev) => [...prev, removedUrl]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      console.log("기존 이미지 삭제:", removedUrl);
    } else {
      const newIndex = index - existingImages.length;
      const removedFile = newImages[newIndex];
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
      URL.revokeObjectURL(imagePreviews[index]);
      console.log("새 이미지 삭제:", removedFile.name);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    if (currentImageIndex >= imagePreviews.length - 1 && imagePreviews.length > 1) {
      setCurrentImageIndex(imagePreviews.length - 2);
    }
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagePreviews.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === imagePreviews.length - 1 ? 0 : prev + 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[1] 수정하기 버튼 클릭됨");

    if (!postId) {
      console.error("[ERROR] postId가 없습니다");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("[2] 수정 요청 시작");
      console.log("[3] 전송 데이터:", {
        title: title.trim(),
        content: content.trim(),
        images: newImages.map((f) => f.name),
        removedImageUrls,
      });

      await updatePost(parseInt(postId), {
        title: title.trim(),
        content: content.trim(),
        images: newImages,
        removedImageUrls,
      });

      console.log("[4] 수정 요청 성공");
      alert("게시물이 성공적으로 수정되었습니다");
      navigate(`/community/${postId}`);
    } catch (error) {
      console.error("[ERROR] 게시물 수정 실패:", error);
      alert("게시물 수정에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main
        className="flex flex-col items-center w-full"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginTop: NAVBAR_HEIGHT,
        }}
      >
        <div className="w-full max-w-2xl mx-auto mt-16 p-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">게시물 수정</h1>
            <p className="text-gray-600">게시물을 수정하고 변경사항을 저장하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 게시물 제목 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-[#ff651b] focus:border-[#ff651b]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이미지 <span className="text-red-500">*</span>
              </label>

              {imagePreviews.length > 0 ? (
                <div className="border border-gray-300 rounded-md p-4">
                  {/* 이미지 슬라이더 */}
                  <div className="relative h-64 w-full flex items-center justify-center bg-gray-50 rounded">
                    <img
                      src={imagePreviews[currentImageIndex]}
                      alt={`업로드된 이미지 ${currentImageIndex + 1}`}
                      className="object-contain w-full h-full"
                    />

                    {/* 이전/다음 버튼 (이미지가 2개 이상일 때만 표시) */}
                    {imagePreviews.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={goToPrevious}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-800" />
                        </button>
                        <button
                          type="button"
                          onClick={goToNext}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-800" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* 이미지 인디케이터 (이미지가 2개 이상일 때만 표시) */}
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
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // 이미지가 없을 때 표시되는 업로드 영역
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-[#ff651b] transition-colors cursor-pointer flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-base text-black font-semibold">이미지를 업로드하세요</p>
                </div>
              )}

              {/* 숨겨진 파일 입력 */}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </div>

            {/* 업로드된 이미지 목록 */}
            {imagePreviews.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  업로드된 이미지 <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="space-y-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex items-center">
                          <img
                            src={preview}
                            alt={`미리보기 ${index + 1}`}
                            className="w-12 h-12 object-cover mr-3"
                          />
                          <span className="text-sm text-gray-700">
                            {index < existingImages.length
                              ? `기존 이미지 ${index + 1}`
                              : `새 이미지 ${index - existingImages.length + 1}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 추가 이미지 업로드 버튼 */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-[#ff651b] rounded text-[#ff651b] hover:bg-[#ff651b] hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">이미지 추가하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* 게시물 내용 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="내용을 입력하세요"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-[#ff651b] focus:border-[#ff651b]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* 버튼 그룹 - 취소/수정 */}
            <div className="flex justify-end gap-4 pt-4 pb-10">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => window.history.back()}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-md text-white flex items-center gap-2 bg-[#ff651b] disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Check className="h-5 w-5" />
                )}
                {isSubmitting ? "수정 중..." : "수정하기"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
