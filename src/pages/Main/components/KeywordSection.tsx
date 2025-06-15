import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function KeywordSection() {
  const navigate = useNavigate()
  const { t } = useTranslation();

  const keywords = t("keywordSection.keywords", { returnObjects: true }) as string[];

  const handleClick = (keyword: string) => {
    navigate(`/festival?search=${encodeURIComponent(keyword)}`)
  }

  return (
    <section className="bg-[#fffefb] py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{t("keywordSection.title")}</h2>
          <Button
            variant="ghost"
            className="text-[#ff651b]/90 hover:text-[#ff651b] hover:scale-105 transition-transform duration-200"
            onClick={() => navigate("/festival")}
          >
            {t("keywordSection.all")}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="outline"
              className="cursor-pointer text-gray-800  bg-white px-4 py-2 text-sm hover:bg-[#ff651b]/15 hover:border-[#ff651b]/50 transition-all duration-200"
              onClick={() => handleClick(keyword)}
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
