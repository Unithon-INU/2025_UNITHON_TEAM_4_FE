import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import CommentSection from "./components/CommentSection";

interface PostImage {
  id: number;
  url: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  language: string;
  images: PostImage[];
  likes: number;
  comments: number;
  region: string;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 데이터를 가져올 것입니다
    const fetchPost = async () => {
      setLoading(true);
      setTimeout(() => {
        const dummyPost: Post = {
          id: Number(id),
          title: "진주 남강유등축제",
          content:
            "진주 남강유등축제에 다녀왔습니다! 밤하늘을 수놓는 아름다운 등불들이 정말 환상적이었어요. 남강을 따라 설치된 다양한 모양의 등불들은 물 위에 비친 모습까지 더해져 더욱 아름다웠습니다.\n\n축제 기간 동안 진행되는 다양한 공연과 체험 프로그램도 즐길 수 있었어요. 특히 소원등을 만들어 띄우는 체험은 잊지 못할 추억이 되었습니다. 가족, 연인, 친구들과 함께 방문하기 좋은 축제입니다.\n\n주변에 맛있는 음식점도 많아서 축제를 즐기고 나서 맛있는 식사까지 할 수 있어요. 다음에 또 방문하고 싶은 축제였습니다!",
          author: "festival_lover",
          date: "2023-10-15",
          language: "ko",
          images: [
            { id: 1, url: "/placeholder.svg?height=600&width=800" },
            { id: 2, url: "/placeholder.svg?height=600&width=800" },
            { id: 3, url: "/placeholder.svg?height=600&width=800" },
          ],
          likes: 128,
          comments: 24,
          region: "경상남도",
        };
        setPost(dummyPost);
        setLoading(false);
      }, 500);
    };
    fetchPost();
  }, [id]);

  const nextImage = () => {
    if (!post) return;
    setCurrentImageIndex((prevIndex) => (prevIndex === post.images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    if (!post) return;
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? post.images.length - 1 : prevIndex - 1));
  };

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">게시물을 찾을 수 없습니다</h1>
          <p className="mt-4 text-gray-600">요청하신 게시물이 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </div>
    );
  }

  const NAVBAR_HEIGHT = 90; // 네비게이션 바 높이(px)

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      <main
        className="flex justify-center items-center"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginTop: NAVBAR_HEIGHT,
        }}
      >
        <div className="max-w-4xl mx-auto mt-8">
          {/* 게시물 헤더 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <div className="flex items-center mt-3 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{post.date}</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {post.language === "ko"
                    ? "한국어"
                    : post.language === "en"
                    ? "English"
                    : post.language === "ja"
                    ? "日本語"
                    : post.language === "zh"
                    ? "中文"
                    : post.language === "es"
                    ? "Español"
                    : post.language === "fr"
                    ? "Français"
                    : post.language === "de"
                    ? "Deutsch"
                    : post.language === "ru"
                    ? "Русский"
                    : post.language}
                </span>
              </div>
              <span className="mx-2">•</span>
              <span className="text-sm">{post.region}</span>
            </div>
          </div>

          {/* 이미지 슬라이더 */}
          <div className="relative mb-8 bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <div className="w-full h-[400px] md:h-[500px] relative flex items-center justify-center bg-gray-100">
                <img
                  src={post.images[currentImageIndex].url || "/placeholder.svg"}
                  alt={`${post.title} 이미지 ${currentImageIndex + 1}`}
                  className="object-contain w-full h-full"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>

              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                    aria-label="다음 이미지"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {/* 이미지 인디케이터 */}
            {post.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {post.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex ? "bg-[#ff651b]" : "bg-gray-300"
                    }`}
                    aria-label={`이미지 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 작성자 정보 및 상호작용 버튼 */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#ff651b]">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt={post.author}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">@{post.author}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={toggleLike}
                className={`flex items-center ${
                  isLiked ? "text-red-500" : "text-gray-500"
                } hover:text-red-500 transition-colors`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="ml-1 text-sm">{isLiked ? post.likes + 1 : post.likes}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="ml-1 text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={toggleBookmark}
                className={`flex items-center ${
                  isBookmarked ? "text-[#ff651b]" : "text-gray-500"
                } hover:text-[#ff651b] transition-colors`}
              >
                <BookmarkPlus className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* 게시물 내용 */}
          <div className="mb-8">
            <div className="prose max-w-none">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-800 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* 댓글 섹션 */}
          <CommentSection postId={post.id} />
        </div>
      </main>
    </div>
  );
}
