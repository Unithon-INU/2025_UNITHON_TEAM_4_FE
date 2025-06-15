// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { X, Check, Upload, Plus } from "lucide-react";
// import Navbar from "../../components/Navbar";
// import client, { getApiUrl } from "../../apis/client";

// interface Image {
//   imageUrl: string;
// }

// interface PostResponse {
//   status: number;
//   message: string;
//   data: {
//     postId: number;
//     title: string;
//     content: string;
//     images: Image[];
//     // ... (기타 필드 생략)
//   };
// }

// export default function PostModifyPage() {
//   const { postId } = useParams<{ postId: string }>();
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [images, setImages] = useState<Image[]>([]);
//   const [newImages, setNewImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isImageRequiredModalOpen, setIsImageRequiredModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const NAVBAR_HEIGHT = 90;

//   // 게시물 데이터 불러오기
//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await client.get<PostResponse>(getApiUrl(`/posts/${postId}`));
//         const { data } = response.data;
//         setTitle(data.title);
//         setContent(data.content);
//         setImages(data.images);
//         // 기존 이미지 미리보기 (선택)
//         setImagePreviews(data.images.map((img) => img.imageUrl));
//       } catch (error) {
//         console.error("게시물 불러오기 실패:", error);
//       }
//     };
//     fetchPost();
//   }, [postId]);

//   // 이미지 업로드 핸들러 등 (기존 코드와 동일)
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;
//     setNewImages(files);
//     setImagePreviews(files.map((file) => URL.createObjectURL(file)));
//   };

//   // 이미지 제거 핸들러 (기존 코드와 동일)
//   const handleRemoveImage = (index: number) => {
//     setNewImages((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   // 수정하기 버튼 클릭 핸들러
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // 이미지 업로드 검증 (기존 이미지가 있거나, 새 이미지가 있으면 통과)
//     if (images.length === 0 && newImages.length === 0) {
//       setIsImageRequiredModalOpen(true);
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("content", content);
//       newImages.forEach((image) => {
//         formData.append("images", image);
//       });

//       const response = await client.patch(getApiUrl(`/posts/${postId}`), formData);
//       alert("게시물이 성공적으로 수정되었습니다!");
//       navigate(`/community/${postId}`);
//     } catch (error) {
//       console.error("게시물 수정 실패:", error);
//       alert("게시물 수정에 실패했습니다.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     document.body.style.overflow = "auto";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   return (
//     <div className="min-h-screen h-screen bg-white">
//       <Navbar />
//       <main
//         className="flex flex-col items-center w-full"
//         style={{
//           minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
//           marginTop: NAVBAR_HEIGHT,
//         }}
//       >
//         <div className="w-full max-w-2xl mx-auto mt-16">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">게시물 수정</h1>
//             <p className="text-gray-600">축제 경험을 수정하고 다른 사람들과 소통하세요</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* 게시물 제목 */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 게시물 제목 <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="게시물 제목을 입력하세요"
//                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-[#ff651b] focus:border-[#ff651b]"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>

//             {/* 이미지 업로드 */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 이미지 <span className="text-red-500">*</span>
//               </label>

//               {/* 기존 이미지 미리보기 */}
//               {images.length > 0 && (
//                 <div className="mb-4">
//                   <p className="text-sm font-medium mb-2">기존 이미지</p>
//                   <div className="flex flex-wrap gap-2">
//                     {images.map((image, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={image.imageUrl}
//                           alt={`기존 이미지 ${index + 1}`}
//                           className="w-32 h-32 object-cover rounded"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* 새 이미지 미리보기 */}
//               {imagePreviews.length > 0 ? (
//                 <div className="border border-gray-300 rounded-md p-4">
//                   <div className="relative h-64 w-full flex items-center justify-center bg-gray-50 rounded">
//                     <img
//                       src={imagePreviews[0]} // 여러 이미지일 경우 슬라이드로 확장 가능
//                       alt="업로드 이미지"
//                       className="object-contain w-full h-full"
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div
//                   className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-[#ff651b] transition-colors cursor-pointer flex flex-col items-center justify-center"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-2 text-base text-black font-semibold">이미지를 업로드하세요</p>
//                 </div>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleImageChange}
//               />
//             </div>

//             {/* 새 이미지 목록 */}
//             {newImages.length > 0 && (
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   새로 업로드할 이미지 <span className="text-red-500">*</span>
//                 </label>
//                 <div className="border border-gray-300 rounded-md p-4 bg-gray-50 flex flex-col items-end">
//                   <div className="w-full space-y-2">
//                     {newImages.map((file, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between p-2 bg-white rounded border"
//                       >
//                         <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveImage(index)}
//                           className="ml-2 text-red-500 hover:text-red-700 transition-colors"
//                         >
//                           <X className="h-4 w-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* 게시물 내용 */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 내용 <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 rows={6}
//                 placeholder="축제에 대한 경험과 느낌을 자유롭게 작성해주세요..."
//                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-[#ff651b] focus:border-[#ff651b]"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 required
//               />
//             </div>

//             {/* 버튼 그룹 */}
//             <div className="flex justify-end space-x-4 pt-4 pb-10">
//               <button
//                 type="button"
//                 className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//                 onClick={() => window.history.back()}
//               >
//                 취소
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-2 rounded-md text-white flex items-center gap-2 bg-[#ff651b] disabled:bg-gray-400"
//               >
//                 {isSubmitting ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 ) : (
//                   <Check className="h-5 w-5" />
//                 )}
//                 {isSubmitting ? "수정 중..." : "수정하기"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>

//       {/* 이미지 업로드 요청 팝업 */}
//       {isImageRequiredModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
//             <div className="mb-4">
//               <h2 className="text-lg font-semibold mb-1">알림</h2>
//               <p className="text-sm text-gray-500">이미지 업로드 해주세요.</p>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
//                 onClick={() => setIsImageRequiredModalOpen(false)}
//               >
//                 확인
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
