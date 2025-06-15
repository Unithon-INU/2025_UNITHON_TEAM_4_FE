import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../../../apis/posts";

export default function PostGrid() {
  const [posts, setPosts] = useState<
    {
      postId: number;
      title: string;
      thumbnailUrl: string;
      writer: {
        id: number;
        name: string;
        profileImage: string;
      };
      createdAt: string;
      updatedAt: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts();
        // 최신순 정렬: createdAt 기준 내림차순
        const sortedPosts = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("게시물 불러오기 실패:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 w-full">
      {posts.map((post) => (
        <Link key={post.postId} to={`/community/${post.postId}`} className="group block">
          <div className="overflow-hidden rounded-lg bg-gray-100 aspect-square relative shadow-sm hover:shadow-md transition-all duration-300">
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium truncate">{post.title}</p>
              <div className="flex items-center justify-between mt-1">
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
  );
}
