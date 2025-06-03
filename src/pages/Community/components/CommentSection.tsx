import { useState, useEffect } from "react";
import { Send } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  language: string;
  translations?: {
    [key: string]: string;
  };
}

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [translatedComments, setTranslatedComments] = useState<{ [key: number]: string }>({});
  const [currentLanguage, setCurrentLanguage] = useState("ko"); // 실제로는 네브바에서 선택한 언어를 가져와야 함

  useEffect(() => {
    // 실제 구현에서는 API 호출로 댓글을 가져올 것입니다
    const fetchComments = async () => {
      setLoading(true);
      setTimeout(() => {
        const dummyComments: Comment[] = [
          {
            id: 1,
            author: "traveler123",
            content: "저도 작년에 다녀왔는데 정말 아름다웠어요! 올해도 가고 싶네요.",
            date: "2023-10-16",
            language: "ko",
            translations: {
              en: "I also visited last year and it was really beautiful! I want to go again this year.",
              ja: "私も去年行きましたが、本当に美しかったです！今年もまた行きたいですね。",
              zh: "我去年也去过，真的很漂亮！今年也想去。",
              es: "¡También visité el año pasado y fue realmente hermoso! Quiero ir de nuevo este año.",
              fr: "J'ai aussi visité l'année dernière et c'était vraiment magnifique ! Je veux y retourner cette année.",
              de: "Ich habe es letztes Jahr auch besucht und es war wirklich schön! Ich möchte dieses Jahr wieder hingehen.",
              ru: "Я тоже посещал в прошлом году, и это было действительно красиво! Хочу поехать снова в этом году.",
            },
          },
          {
            id: 2,
            author: "light_enthusiast",
            content:
              "The lanterns reflecting on the water create such a magical atmosphere. I highly recommend visiting this festival!",
            date: "2023-10-16",
            language: "en",
            translations: {
              ko: "물에 비치는 등불이 정말 마법 같은 분위기를 만들어요. 이 축제 방문을 강력 추천합니다!",
              ja: "水面に映る灯籠が魔法のような雰囲気を作り出します。このお祭りへの訪問を強くお勧めします！",
              zh: "灯笼倒映在水中，营造出如此神奇的氛围。我强烈推荐参观这个节日！",
              es: "Las linternas que se reflejan en el agua crean un ambiente tan mágico. ¡Recomiendo encarecidamente visitar este festival!",
              fr: "Les lanternes qui se reflètent sur l'eau créent une atmosphère si magique. Je recommande vivement de visiter ce festival !",
              de: "Die Laternen, die sich im Wasser spiegeln, schaffen eine so magische Atmosphäre. Ich empfehle sehr, dieses Festival zu besuchen!",
              ru: "Фонари, отражающиеся в воде, создают такую волшебную атмосферу. Я настоятельно рекомендую посетить этот фестиваль!",
            },
          },
          {
            id: 3,
            author: "sakura_fan",
            content:
              "灯籠の美しさに感動しました。韓国の伝統文化を体験できる素晴らしいお祭りですね。",
            date: "2023-10-17",
            language: "ja",
            translations: {
              ko: "등불의 아름다움에 감동했습니다. 한국의 전통 문화를 경험할 수 있는 멋진 축제네요.",
              en: "I was moved by the beauty of the lanterns. It's a wonderful festival where you can experience Korean traditional culture.",
              zh: "我被灯笼的美丽所感动。这是一个可以体验韩国传统文化的精彩节日。",
              es: "Me conmovió la belleza de las linternas. Es un festival maravilloso donde puedes experimentar la cultura tradicional coreana.",
              fr: "J'ai été ému par la beauté des lanternes. C'est un festival merveilleux où vous pouvez découvrir la culture traditionnelle coréenne.",
              de: "Ich war bewegt von der Schönheit der Laternen. Es ist ein wunderbares Festival, bei dem man die traditionelle koreanische Kultur erleben kann.",
              ru: "Я был тронут красотой фонарей. Это замечательный фестиваль, где можно познакомиться с традиционной корейской культурой.",
            },
          },
          {
            id: 4,
            author: "local_guide",
            content:
              "진주 남강유등축제는 우리나라의 대표적인 문화축제입니다. 특히 밤에 보는 풍경이 환상적이에요. 주변 맛집도 많으니 꼭 들러보세요!",
            date: "2023-10-18",
            language: "ko",
            translations: {
              en: "Jinju Namgang Yudeung Festival is a representative cultural festival in Korea. The night view is especially fantastic. There are many great restaurants nearby, so be sure to visit!",
              ja: "晋州南江流灯祭りは韓国を代表する文化祭りです。特に夜の景色が幻想的です。周辺には美味しいレストランもたくさんありますので、ぜひ立ち寄ってみてください！",
              zh: "晋州南江流灯节是韩国具有代表性的文化节日。尤其是夜景非常梦幻。附近有很多美食餐厅，一定要去看看！",
              es: "El Festival de Linternas de Jinju Namgang es un festival cultural representativo de Corea. La vista nocturna es especialmente fantástica. Hay muchos buenos restaurantes cerca, ¡así que asegúrate de visitarlos!",
              fr: "Le Festival des Lanternes de Jinju Namgang est un festival culturel représentatif de la Corée. La vue de nuit est particulièrement fantastique. Il y a beaucoup de bons restaurants à proximité, alors n'hésitez pas à les visiter !",
              de: "Das Jinju Namgang Laternen Festival ist ein repräsentatives Kulturfestival in Korea. Die Nachtansicht ist besonders fantastisch. Es gibt viele gute Restaurants in der Nähe, also besuchen Sie sie unbedingt!",
              ru: "Фестиваль фонарей Намган в Чинджу - это представительный культурный фестиваль в Корее. Ночной вид особенно фантастичен. Поблизости много отличных ресторанов, так что обязательно посетите их!",
            },
          },
        ];
        setComments(dummyComments);
        setLoading(false);
      }, 800);
    };
    fetchComments();
  }, [postId]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: comments.length + 1,
      author: "current_user", // 실제로는 로그인한 사용자 정보를 사용
      content: newComment,
      date: new Date().toISOString().split("T")[0],
      language: currentLanguage,
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  const handleTranslate = (commentId: number, language: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment || !comment.translations || !comment.translations[language]) return;

    setTranslatedComments({
      ...translatedComments,
      [commentId]: comment.translations[language],
    });
  };

  const resetTranslation = (commentId: number) => {
    const newTranslatedComments = { ...translatedComments };
    delete newTranslatedComments[commentId];
    setTranslatedComments(newTranslatedComments);
  };

  return (
    <div className="border-t border-[#ff651b] pt-6">
      <h3 className="text-xl font-bold mb-6">댓글 {comments.length}개</h3>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
        </div>
      ) : (
        <div className="space-y-7 mb-8">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                {/* 프로필 */}
                <div className="flex-shrink-0 pt-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=32&width=32"
                      alt={comment.author}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                {/* 본문 */}
                <div className="flex-1">
                  <div className="flex items-center mb-0.5">
                    <span className="font-semibold text-gray-900 text-[15px]">
                      @{comment.author}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <div className="text-[15px] text-gray-800 leading-relaxed">
                    {translatedComments[comment.id] ? (
                      <>
                        <p className="mb-1">{translatedComments[comment.id]}</p>
                        <button
                          onClick={() => resetTranslation(comment.id)}
                          className="text-xs text-gray-800 hover:text-gray-800"
                        >
                          원문 보기
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="mb-1">{comment.content}</p>
                        {comment.language !== currentLanguage && comment.translations && (
                          <button
                            onClick={() => handleTranslate(comment.id, currentLanguage)}
                            className="text-xs text-gray-800 hover:text-gray-800"
                          >
                            번역 보기
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 댓글 입력창 */}
      <form onSubmit={handleSubmitComment} className="mt-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-1">
            <div className="w-8 h-8 rounded-full bg-[#fffefb] shadow-lg border border-gray-200overflow-hidden flex items-center justify-center">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Current user"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1 relative mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성해주세요..."
              className="w-full bg-[#fffefb] shadow-lg border border-gray-200 rounded-lg py-2 px-3 focus:outline-none "
              rows={1}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-3 bottom-2 text-[#ffb37b] hover:text-[#ff651b] disabled:text-[#ffb37b] disabled:cursor-not-allowed"
            >
              <Send className="h-10 w-8" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
