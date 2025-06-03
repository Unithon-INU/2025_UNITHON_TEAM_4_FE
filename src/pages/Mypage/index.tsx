import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Edit, MoreVertical, Trash2, User, MessageCircle, Settings2Icon } from "lucide-react";

const NAVBAR_HEIGHT = 90; // 네비게이션 바 높이(px)

// 샘플 데이터
const userProfile = {
  id: 1,
  name: "festival_lover",
  email: "festival_lover@example.com",
  bio: "축제를 사랑하는 사람입니다.",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: "2023-01-15",
  postCount: 12,
  likeCount: 42,
  bookmarkCount: 16,
};

const samplePosts = [
  ...Array.from({ length: 17 }).map((_, i) => ({
    id: i + 1,
    title: `진주 남강유등축제 방문...${i + 1}`,
    content: "진주 남강유등축제에 다녀온 후기입니다.",
    createdAt: "2023-10-15",
    comments: 24,
    category: "한국어",
    author: "@festival_lover",
    image: "/placeholder.svg?height=120&width=180",
  })),
];

export default function MyPage() {
  const [posts, setPosts] = useState(samplePosts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

  // 게시물 삭제
  const handleDeletePost = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    setIsDeleteDialogOpen(false);
    setSelectedPostId(null);
  };

  // 게시물 수정 (콘솔 출력)
  const handleEditPost = (postId: number) => {
    console.log(`게시물 ${postId} 수정`);
    setDropdownOpenId(null);
  };

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
        <div className="w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full h-[calc(85vh-2rem)]">
            {/* 프로필 영역 */}
            <div className="lg:col-span-2 h-full">
              <div className="bg-white rounded-lg  border border-border-[#fffefb] h-full flex items-center justify-center">
                <div className="w-full max-w-sm p-8">
                  <div className="text-center space-y-6">
                    {/* 프로필 이미지 */}
                    <div className="relative mx-auto w-32 h-32">
                      {userProfile.avatar ? (
                        <img
                          src={userProfile.avatar}
                          alt={userProfile.name}
                          className="rounded-full w-32 h-32 object-cover border"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-200">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {/* 사용자 정보 */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                      <p className="text-gray-500 text-sm">{userProfile.email}</p>
                    </div>
                    {/* 통계 */}
                    <div className="flex justify-center gap-8">
                      <div className="text-center">
                        <p className="text-xl font-bold">{userProfile.postCount}</p>
                        <p className="text-xs text-gray-400">게시물</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold">{userProfile.likeCount}</p>
                        <p className="text-xs text-gray-400">좋아요</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold">{userProfile.bookmarkCount}</p>
                        <p className="text-xs text-gray-400">북마크</p>
                      </div>
                    </div>
                    {/* 버튼들 */}
                    <div className="space-y-3">
                      <button className="w-full border border-gray-300 rounded bg-white px-4 py-2 flex items-center justify-center hover:bg-gray-50">
                        <Edit className="w-4 h-4 mr-2" />
                        프로필 수정
                      </button>
                      <button className="w-full border border-gray-300 rounded bg-white px-4 py-2 flex items-center justify-center hover:bg-gray-50">
                        <Settings2Icon className="w-4 h-4 mr-2" />
                        계정 설정
                      </button>
                    </div>
                    {/* 가입일 */}
                    <div className="pt-4 border-t border-[#ff651b]">
                      <p className="text-xs text-gray-300">가입일: {userProfile.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 게시물 영역 */}
            <div className="lg:col-span-3 overflow-y-auto h-full rounded-lg border border-border-[#fffefb]">
              <div className="bg-white rounded-lg  h-full flex flex-col">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 grid grid-cols-3 gap-0.5 ">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-[#ff651b] rounded-sm" />
                      ))}
                    </div>
                    <span className="font-medium">내 게시물</span>
                  </div>
                </div>
                {/* 게시물 리스트: flex-1, h-full, overflow-y-auto */}
                <div className="flex-1 h-full p-6 pt-0 ">
                  <div className="grid grid-cols-3 gap-4 ">
                    {posts.map((post, idx) => (
                      <div
                        key={post.id + "-" + idx}
                        className="bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow relative mb-6"
                        style={{ minHeight: 150, maxHeight: 300 }}
                      >
                        {/* 이미지 영역 */}
                        <div className="aspect-[5/3] rounded-lg bg-gray-200 flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-300 rounded" />
                        </div>
                        {/* 더보기 메뉴 */}
                        <div className="absolute top-2 right-2">
                          <button
                            className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpenId(dropdownOpenId === post.id ? null : post.id);
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {/* 드롭다운 메뉴 */}
                          {dropdownOpenId === post.id && (
                            <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPost(post.id);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                수정
                              </button>
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPostId(post.id);
                                  setIsDeleteDialogOpen(true);
                                  setDropdownOpenId(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                        {/* 하단 정보 오버레이 */}
                        <div className="relative bottom-0 left-0 right-0 bg-gray-300 text-black p-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{post.comments}</span>
                            </div>
                            <span>{post.createdAt}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-t from-[#ffd6b0]/90 to-transparent">
                          <h3 className="font-medium text-sm mb-1 truncate">{post.title}</h3>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{post.category}</span>
                            <span>{post.author}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 게시물 삭제 확인 모달 */}
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">게시물 삭제</h2>
                <p className="text-sm text-gray-500">
                  정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => selectedPostId && handleDeletePost(selectedPostId)}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
