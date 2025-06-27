import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Heart,
  MessageCircle,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { getPost, togglePostLike, getMyLikedPosts } from "../../apis/post"; // 위에서 만든 API 함수 import
import CommentSection from "./components/CommentSection"; // 댓글 섹션은 이후에 별도로 넣으신다고 하셨으니 일단 그대로
import { useTranslation } from "react-i18next";
interface PostDetail {
  postId: number;
  likes: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  images: { imageUrl: string }[];
  comments: {
    commentId: number;
    content: string;
    writerId: number;
    writerName: string;
    writerProfileImageUrl: string;
    createdAt: string;
    updatedAt: string;
  }[];
  writer: {
    id: number;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // ✅ 좋아요 상태 동기화 함수 (서버에서 fetch)
  const fetchLikeStatus = async (currPostId: number) => {
    try {
      const likedPosts = await getMyLikedPosts(); // [{ postId: 123, ... }]
      setIsLiked(likedPosts.some((p) => p.postId === currPostId));
    } catch (e) {
      console.error(t("postDetail.errorLoadLikeStatus", { error: e }));
      setIsLiked(false);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data } = await getPost(Number(id));
      setPost(data);
      setLikeCount(data.likes);
    } catch (error) {
      console.error(t("postDetail.errorLoad", { error }));
    } finally {
      setLoading(false);
    }
  };

  // ✅ 첫 진입 시 게시글 및 좋아요 상태 fetch
  useEffect(() => {
    if (!postId) return;
    fetchPost();
    fetchLikeStatus(postId);
  }, [postId]);

  const nextImage = () => {
    if (!post) return;
    setCurrentImageIndex((prevIndex) => (prevIndex === post.images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    if (!post) return;
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? post.images.length - 1 : prevIndex - 1));
  };

  // ✅ 좋아요 토글 핸들러: 서버에 요청 → 완료 후 다시 fetchLikeStatus(postId)
  const handleToggleLike = async () => {
  if (!post) return;
  try {
    const res = await togglePostLike(post.postId);
    console.log(res.message); // 서버 응답 메시지 출력 (예: "좋아요 완료" 또는 "좋아요 취소")
    // 서버 최신 데이터로 동기화 (likes, 댓글 등 모두)
    await fetchPost(); // 이 줄만 있으면 모든 동기화 문제 해결됨!
    await fetchLikeStatus(post.postId); // isLiked도 다시 동기화
  } catch (e) {
    alert(t("postDetail.errorLike"));
    console.error(e);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#ff651b] border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">{t("postDetail.notFound.title")}</h1>
          <p className="mt-4 text-gray-600">{t("postDetail.notFound.desc")}</p>
        </div>
      </div>
    );
  }

  const NAVBAR_HEIGHT = 90;

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
                <Calendar className="h-4 w-4 mr-1 text-[#ff651b]" />
                <span className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 이미지 슬라이더 */}
          <div className="relative mb-8 bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <div className="w-[800px] h-[400px] md:h-[500px] relative flex items-center justify-center bg-gray-100">
                <img
                  src={post.images[currentImageIndex]?.imageUrl || "/placeholder.svg"}
                  alt={t("postDetail.imageAlt", {
                    title: post.title,
                    index: currentImageIndex + 1,
                  })}
                  className="object-contain w-full h-full"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>

              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                    aria-label={t("postDetail.prevImage")}
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-all"
                    aria-label={t("postDetail.nextImage")}
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
                    aria-label={t("postDetail.imageIndicator", { index: index + 1 })}
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
                  src={post.writer.profileImage || "/placeholder.svg"}
                  alt={post.writer.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">@{post.writer.name}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleToggleLike}
                className={`flex items-center ${isLiked ? "text-[#ff651b]" : "text-gray-500"} hover:text-[#ff651b] transition-colors`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="ml-1 text-sm">{likeCount}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-[#ff651b] transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="ml-1 text-sm">{post.comments.length}</span>
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
          <CommentSection
            postId={post.postId}
            comments={post.comments}
            onCommentAdded={fetchPost} // 추가: 댓글 작성 후 데이터 갱신
          />
        </div>
      </main>
    </div>
  );
}
