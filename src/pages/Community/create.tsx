import { useState, useEffect } from "react";
import { X, Search, Check } from "lucide-react";
import Navbar from "../../components/Navbar";
import FestivalSearchModal from "./components/FestivalSearchModel";
import LanguageSelector from "./components/LanguageSelector";

export default function CreatePostPage() {
  // 예시 데이터 (상태 관리 없음)
  const formData = {
    festivalName: "진주 남강유등축제",
    language: "ko",
    content: "정말 멋진 축제였어요! 다양한 체험과 먹거리, 공연이 인상적이었습니다.",
    imagePreview: "/sample1.jpg",
  };

  // 모달 열림 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const NAVBAR_HEIGHT = 90;

  // body에 overflow-x/y-hidden 적용 (스크롤 방지)
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
            <h1 className="text-3xl font-bold mb-2">게시물 작성</h1>
            <p className="text-gray-600">축제 경험을 공유하고 다른 사람들과 소통하세요</p>
          </div>

          <form className="space-y-6">
            {/* 축제 이름 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                축제 이름 <span className="text-red-500">*</span>
              </label>
              <div
                className="flex justify-between items-center border border-gray-300 rounded-md p-3 cursor-pointer "
                onClick={() => setIsModalOpen(true)}
              >
                <span className="text-gray-900">{formData.festivalName}</span>
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* 언어 선택 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                언어 <span className="text-red-500">*</span>
              </label>
              <LanguageSelector selectedLanguage={formData.language} onLanguageChange={() => {}} />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이미지 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-[#ff651b] transition-colors">
                <div className="relative">
                  <div className="relative h-64 w-full flex items-center justify-center">
                    <img
                      src={formData.imagePreview}
                      alt="업로드 이미지 미리보기"
                      className="object-contain w-full h-full"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                    <span className="absolute inset-x-0 bottom-2 text-xs text-gray-400">
                      업로드 이미지 미리보기
                    </span>
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* 게시물 내용 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="축제에 대한 경험과 느낌을 자유롭게 작성해주세요..."
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-[#ff651b] focus:border-[#ff651b]"
                value={formData.content}
                readOnly
              />
            </div>

            {/* 버튼 그룹 */}
            <div className="flex justify-end space-x-4 pt-4 pb-10">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-md text-white flex items-center gap-2 bg-[#ff651b]"
              >
                <Check className="h-5 w-5" />
                게시하기
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 축제 검색 모달: isModalOpen이 true일 때만 노출 */}
      {isModalOpen && <FestivalSearchModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
