import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./Card";
import { styleMap } from "./seasonalFestivals";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  currentSeason: number;
}

export default function SeasonSection({ currentSeason }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // i18n에서 계절별 축제 배열 가져오기
  const seasonalFestivals = t("seasonal", { returnObjects: true }) as Array<{
    id: string;
    season: string;
    title: string;
    description: string;
    festivals: string[];
  }>;

  return (
    <section className="py-0 -translate-y-3 bg-[#fffefb]">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 1.5,
          duration: 0.7,
          ease: "easeInOut"
        }}
      >
        <div className="container mx-auto px-4 -translate-y-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("seasonSection.headline")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("seasonSection.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalFestivals.map((festival, index) => {
              const style = styleMap[festival.id as keyof typeof styleMap];
              return (
                <Card
                  key={festival.id}
                  className={`group cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-3 ${
                    index === currentSeason ? "ring-2 ring-[#ff651b] shadow-lg -translate-y-2" : ""
                  }`}
                  onClick={() => navigate(`/festival?search=${festival.season}`)}
                >
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <div className={`absolute inset-0 ${style.color}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-700">
                        <div className="text-4xl mb-2">
                          {style.emoji}
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
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
