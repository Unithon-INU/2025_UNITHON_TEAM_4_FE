// hooks/useInfinitePosts.ts
import { useState, useCallback } from "react";
import { getPosts, Post } from "../apis/posts";

export function useInfinitePosts(size = 6) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getPosts(page, size);
      setPosts((prev) => [...prev, ...res.data.content]);
      setHasMore(!res.data.last);
      setPage((prev) => prev + 1);
    } catch (e) {
      // 에러 핸들링
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, size]);

  return { posts, loadMore, hasMore, loading };
}
