import { Search, Plus } from "lucide-react";
import Navbar from "../../components/Navbar";
import LanguageFilter from "./components/LanguageFilter";
import PostGrid from "./components/PostGrid";
import { Link } from "react-router-dom";

export default function CommunityPage() {
  // 퍼블리싱용 하드코딩 값
  const searchQuery = "";
  const selectedLanguage = "all";
  const NAVBAR_HEIGHT = 90; // 네비게이션 바 높이(px)

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      <main
        className="w-full max-w-screen-xl mx-auto px-4 py-8"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginTop: NAVBAR_HEIGHT,
        }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">커뮤니티</h1>
          <p className="text-gray-600">전 세계 축제 애호가들과 경험을 공유하세요</p>
        </div>

        {/* 검색/필터/버튼 영역 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center w-full">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="게시물 검색..."
              className="pl-10 w-full rounded-full  py-2 px-4 focus:outline-none bg-[#fffefb] shadow-lg border border-gray-200"
              value={searchQuery}
              readOnly // 퍼블리싱: 입력 불가
            />
          </div>

          <LanguageFilter selectedLanguage={selectedLanguage} />

          <Link
            to="/create"
            className="flex items-center gap-2 bg-[#ff651b]/90 hover:bg-[#ff651b] text-[#fffefb] px-6 py-2 rounded-md transition-all border"
          >
            <Plus className="h-5 w-5" />
            <span>게시물 작성</span>
          </Link>
        </div>

        {/* 카드형 게시글 그리드 */}
        <PostGrid />
      </main>
    </div>
  );
}
