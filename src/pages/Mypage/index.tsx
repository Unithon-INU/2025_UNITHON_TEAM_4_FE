import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Edit, MoreVertical, Trash2, User, MessageCircle, Settings2Icon } from "lucide-react";
import { fetchUserProfile } from "../../apis/users";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../apis/post";
import { useTranslation } from "react-i18next";
const NAVBAR_HEIGHT = 90;

interface Post {
  postId: number;
  thumbnailUrl: string;
  title: string;
  updatedAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  profileImageUrl: string;
  createdAt: string;
  postCount: number;
  posts: Post[];
}

export default function MyPage() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    profileImageUrl: "",
    createdAt: "",
    postCount: 0,
    posts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchUserProfile();
        setUserProfile({
          name: response.data.name,
          email: response.data.email,
          profileImageUrl: response.data.profileImageUrl,
          createdAt: new Date(response.data.createdAt).toLocaleDateString(),
          postCount: response.data.postCount,
          posts: response.data.posts.map((post) => ({
            ...post,
            updatedAt: new Date(post.updatedAt).toLocaleDateString(),
          })),
        });
      } catch (err) {
        setError(t("mypage.loadError"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      setUserProfile((prev) => ({
        ...prev,
        posts: prev.posts.filter((post) => post.postId !== postId), // postId로 삭제
      }));
      setIsDeleteDialogOpen(false);
      setSelectedPostId(null);
    } catch (error) {
      console.error(t("mypage.deleteFail"), error);
      alert(t("mypage.deleteFail"));
    }
  };

  const handleEditPost = (postId: number) => {
    navigate(`/postmodify/${postId}`);
    setDropdownOpenId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff651b]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-sm p-6 text-center">
          <p className="text-gray-600 text-lg mb-4">{t("mypage.loadError")}</p>
          <p className="text-gray-400 text-sm mb-6">{t("mypage.goLoginQ")}</p>
          <Link
            to="/login"
            className="block w-full border border-[#ff651b] text-[#ff651b] rounded-md px-4 py-2 text-center hover:bg-[#ff651b] hover:text-white transition-colors"
          >
            {t("common.login")}
          </Link>
        </div>
      </div>
    );
  }

  // 최근 게시물이 위로 오도록 정렬
  const sortedPosts = [...userProfile.posts].sort((a, b) => b.postId - a.postId);

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
              <div className="bg-white rounded-lg border border-border-[#fffefb] h-full flex items-center justify-center">
                <div className="w-full max-w-sm p-8">
                  <div className="text-center space-y-6">
                    <div className="relative mx-auto w-32 h-32">
                      {userProfile.profileImageUrl ? (
                        <img
                          src={userProfile.profileImageUrl}
                          alt={userProfile.name}
                          className="rounded-full w-32 h-32 object-cover border"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-200">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                      <p className="text-gray-500 text-sm">{userProfile.email}</p>
                    </div>
                    <div className="flex justify-center gap-8">
                      <div className="text-center">
                        <p className="text-xl font-bold">{userProfile.postCount}</p>
                        <p className="text-xs text-gray-400">{t("mypage.post")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold">16</p>
                        <p className="text-xs text-gray-400">{t("mypage.bookmark")}</p>
                      </div>
                    </div>
                    <div className="space-y-3 flex flex-col items-center">
                      <button
                        className="w-full border border-gray-300 rounded bg-white px-4 py-2 flex items-center justify-center hover:bg-gray-50"
                        onClick={() => navigate("/mypage/account-setting")}
                      >
                        <Settings2Icon className="w-4 h-4 mr-2 text-[#ff651b]" />
                        {t("mypage.accountSetting")}
                      </button>
                    </div>
                    <div className="pt-4 border-t border-[#ff651b]">
                      <p className="text-xs text-gray-300">
                        {t("mypage.signupDate")}: {userProfile.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 게시물 영역 */}
            <div className="lg:col-span-3 overflow-y-auto h-full rounded-lg border border-border-[#fffefb]">
              <div className="bg-white rounded-lg h-full flex flex-col">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-[#ff651b] rounded-sm" />
                      ))}
                    </div>
                    <span className="font-medium">{t("mypage.myPosts")}</span>
                  </div>
                </div>
                {/* 게시물 리스트 */}
                <div className="flex-1 h-full p-6 pt-0">
                  <div className="grid grid-cols-3 gap-4">
                    {sortedPosts.map((post, index) => (
                      <div
                        key={post.postId}
                        className="overflow-hidden rounded-lg bg-gray-100 aspect-square relative shadow-sm hover:shadow-md transition-all duration-300 mb-6 group cursor-pointer"
                        onClick={() => navigate(`/community/${post.postId}`)}
                      >
                        {/* 이미지 영역 */}
                        <img
                          src={post.thumbnailUrl || "/placeholder.svg"}
                          alt={post.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* 더보기 메뉴 */}
                        <div
                          className="absolute top-2 right-2 z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpenId(dropdownOpenId === index ? null : index);
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {/* 드롭다운 메뉴 */}
                          {dropdownOpenId === index && (
                            <div
                              className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPost(post.postId);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                {t("mypage.edit")}
                              </button>
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPostId(post.postId);
                                  setIsDeleteDialogOpen(true);
                                  setDropdownOpenId(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t("mypage.delete")}
                              </button>
                            </div>
                          )}
                        </div>
                        {/* 하단 정보 오버레이 */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <div className="flex items-center justify-between text-xs mb-1 opacity-80">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>13</span>
                            </div>
                            <span>{post.updatedAt}</span>
                          </div>
                          <p className="text-sm font-medium truncate">{post.title}</p>
                          <div className="flex items-center justify-between mt-1 text-xs opacity-80">
                            <span>{t("mypage.category")}</span>
                            <span>@{userProfile.name}</span>
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
                <h2 className="text-lg font-semibold mb-1">{t("mypage.deletePostTitle")}</h2>
                <p className="text-sm text-gray-500">{t("mypage.deletePostDesc")}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  {t("common.cancel")}
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => selectedPostId !== null && handleDeletePost(selectedPostId)}
                >
                  {t("mypage.delete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
