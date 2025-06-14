import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "./Card"
import  {seasonalFestivals}  from "./seasonalFestivals"
import { motion } from "framer-motion"

interface Props {
  currentSeason: number
}

export default function SeasonSection({ currentSeason }: Props) {
  const navigate = useNavigate()

  return (
    <section className="py-0 -translate-y-3 bg-[#fffefb]">
      <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1.5,
            duration: 0.7,
            ease: "easeInOut",
          }}
        >
      <div className="container mx-auto px-4 -translate-y-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">계절별 추천 축제</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">각 계절마다 특별한 매력을 가진 축제들을 만나보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalFestivals.map((festival, index) => (
            <Card
              key={festival.id}
              className={`group cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-3 ${
                index === currentSeason ? "ring-2 ring-[#ff651b] shadow-lg -translate-y-2" : ""
              }`}
              onClick={() => navigate(`/festival?search=${festival.id}`)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <div className={`absolute inset-0 ${festival.color}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-700">
                    <div className="text-4xl mb-2">
                      {festival.season === "봄" && "🌸"}
                      {festival.season === "여름" && "🌊"}
                      {festival.season === "가을" && "🍂"}
                      {festival.season === "겨울" && "❄️"}
                    </div>
                    <h3 className="text-xl font-bold">{festival.season}</h3>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{festival.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{festival.description}</p>
                <div className="space-y-1">
                  {festival.festivals.map((name) => (
                    <div key={name} className="text-xs text-gray-500">
                      • {name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div></motion.div>
    </section>
  )
}
