import { Link } from "react-router-dom";

export default function PostGrid() {
  // 더미 데이터 (전체 노출)
  const posts = [
    {
      id: 1,
      title: "진주 남강유등축제 방문 후기",
      image: "/placeholder.svg?height=400&width=400",
      language: "ko",
      author: "festival_lover",
      date: "2023-10-15",
    },
    {
      id: 2,
      title: "Jinhae Cherry Blossom Festival Experience",
      image: "/placeholder.svg?height=400&width=400",
      language: "en",
      author: "traveler123",
      date: "2023-04-10",
    },
    {
      id: 3,
      title: "釜山花火祭りの素晴らしい瞬間",
      image: "/placeholder.svg?height=400&width=400",
      language: "ja",
      author: "sakura_fan",
      date: "2023-11-05",
    },
    {
      id: 4,
      title: "보령 머드축제에서의 즐거운 하루",
      image: "/placeholder.svg?height=400&width=400",
      language: "ko",
      author: "mud_lover",
      date: "2023-07-22",
    },
    {
      id: 5,
      title: "首尔灯节美丽夜景",
      image: "/placeholder.svg?height=400&width=400",
      language: "zh",
      author: "light_chaser",
      date: "2023-11-15",
    },
    {
      id: 6,
      title: "Festival de Máscaras de Andong: Una experiencia cultural",
      image: "/placeholder.svg?height=400&width=400",
      language: "es",
      author: "cultura_fan",
      date: "2023-10-01",
    },
    {
      id: 7,
      title: "전주 비빔밥 축제 맛집 추천",
      image: "/placeholder.svg?height=400&width=400",
      language: "ko",
      author: "food_lover",
      date: "2023-05-20",
    },
    {
      id: 8,
      title: "Le Festival des Lanternes de Jinju: Magnifique!",
      image: "/placeholder.svg?height=400&width=400",
      language: "fr",
      author: "light_enthusiast",
      date: "2023-10-12",
    },
    {
      id: 9,
      title: "Boryeong Schlammfestival: Ein matschiges Abenteuer",
      image: "/placeholder.svg?height=400&width=400",
      language: "de",
      author: "mud_fan",
      date: "2023-07-18",
    },
    {
      id: 10,
      title: "Фестиваль фейерверков в Пусане: незабываемые впечатления",
      image: "/placeholder.svg?height=400&width=400",
      language: "ru",
      author: "fireworks_lover",
      date: "2023-11-03",
    },
    {
      id: 11,
      title: "강릉 커피 축제 방문 후기",
      image: "/placeholder.svg?height=400&width=400",
      language: "ko",
      author: "coffee_addict",
      date: "2023-10-08",
    },
    {
      id: 12,
      title: "Seoul Lantern Festival Night Views",
      image: "/placeholder.svg?height=400&width=400",
      language: "en",
      author: "night_photographer",
      date: "2023-11-10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full">
      {posts.map((post) => (
        <Link key={post.id} to={`/community/${post.id}`} className="group block">
          <div className="overflow-hidden rounded-lg bg-gray-100 aspect-square relative shadow-sm hover:shadow-md transition-all duration-300 ">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#ffd6b0]/90 to-transparent p-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium truncate">{post.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs opacity-80">@{post.author}</span>
                <span className="text-xs opacity-80">{post.date}</span>
              </div>
            </div>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-800 truncate text-center">
            {post.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
