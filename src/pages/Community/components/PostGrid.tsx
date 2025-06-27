import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInfinitePosts } from "../../../hooks/useInfinitePosts";
import { useBottomObserver } from "../../../hooks/useBottomObserver";
import { Heart } from "lucide-react"; // 추가!

export default function PostGrid() {
  const { t } = useTranslation();
  const { posts, loadMore, hasMore, loading } = useInfinitePosts();

  // 옵저버 div가 보이면 loadMore 호출
  const bottomRef = useBottomObserver(() => {
    if (hasMore && !loading) loadMore();
  }, hasMore);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post) => (
          <Link key={post.postId} to={`/community/${post.postId}`} className="group block">
            <div className="overflow-hidden rounded-lg bg-gray-100 aspect-square relative shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  {post.likes > 0 && (
                    <div className="flex items-center gap-1 ml-2">
                      <Heart className="w-4 h-4 text-[#ff651b]" fill="#ff651b" />
                      <span className="text-xs font-semibold">{post.likes}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-80">@{post.writer.name}</span>
                  <span className="text-xs opacity-80">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* 로딩중 or 다음페이지 있으면 바텀 옵저버 보여줌 */}
      <div ref={bottomRef} className="h-10 flex justify-center items-center">
        {loading && <span className="text-gray-400">{t("postGrid.loading")}</span>}
        {!hasMore && <span className="text-gray-400">{t("postGrid.noMorePosts")}</span>}
      </div>
    </div>
  );
}
