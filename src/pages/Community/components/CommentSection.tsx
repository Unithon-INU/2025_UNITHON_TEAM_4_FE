import { useState } from "react";
import { Send } from "lucide-react";
import { createComment } from "../../../apis/post"; // 추가된 API 함수 import
import { useTranslation } from 'react-i18next';
interface Comment {
  commentId: number;
  content: string;
  writerId: number;
  writerName: string;
  writerProfileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  onCommentAdded: () => void; // 추가: 댓글 작성 후 상위 컴포넌트에서 데이터 갱신을 위한 콜백
}
export default function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createComment(postId, newComment);
      setNewComment("");
      onCommentAdded(); // 추가: 상위 컴포넌트에서 데이터 갱신 요청
    } catch (error) {
      alert(t("commentSection.writeError"));
      console.error("댓글 작성 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // 아래는 번역 기능이 필요한 경우에만 추가하세요. 예시에서는 생략합니다.
  // const [translatedComments, setTranslatedComments] = useState<{ [key: number]: string }>({});
  // const [currentLanguage] = useState("ko");

  return (
    <div className="border-t border-[#ff651b] pt-6">
      <h3 className="text-xl font-bold mb-6">{t("commentSection.title", { count: comments.length })}</h3>
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          {t("commentSection.noComment")}
        </p>
      ) : (
        <div className="space-y-7 mb-8">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex items-start space-x-4">
              {/* 프로필 */}
              <div className="flex-shrink-0 pt-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={comment.writerProfileImageUrl || "/placeholder.svg"}
                    alt={comment.writerName}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              {/* 본문 */}
              <div className="flex-1">
                <div className="flex items-center mb-0.5">
                  <span className="font-semibold text-gray-900 text-[15px]">
                    @{comment.writerName}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[15px] text-gray-800 leading-relaxed">
                  <p className="mb-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 입력창 */}
      <form onSubmit={handleSubmitComment} className="mt-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-1">
            <div className="w-8 h-8 rounded-full bg-[#fffefb] shadow-lg border border-gray-200 overflow-hidden flex items-center justify-center">
              <img
                src="/placeholder.svg"
                alt="Current user"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1 relative mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("commentSection.inputPlaceholder")}
              className="w-full bg-[#fffefb] shadow-lg border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
              rows={1}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="absolute right-3 bottom-2 text-[#ffb37b] hover:text-[#ff651b] disabled:text-[#ffb37b] disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="h-10 w-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff651b]"></div>
                </div>
              ) : (
                <Send className="h-10 w-8" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
