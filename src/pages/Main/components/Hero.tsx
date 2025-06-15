import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Sparkles, CalendarDays } from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/Badge"
import { motion, AnimatePresence } from "framer-motion"
import { styleMap } from "./seasonalFestivals"
import { useTranslation } from 'react-i18next'

// const floatingKeywords = [
//   { text: "벚꽃축제", x: 10, y: 20, delay: 0, color: "bg-pink-100 text-pink-700" },
//   { text: "불꽃축제", x: 80, y: 15, delay: 1, color: "bg-red-100 text-red-700" },
//   { text: "등불축제", x: 15, y: 70, delay: 2, color: "bg-yellow-100 text-yellow-700" },
//   { text: "머드축제", x: 85, y: 60, delay: 0.5, color: "bg-amber-100 text-amber-700" },
//   { text: "한지축제", x: 25, y: 45, delay: 1.5, color: "bg-blue-100 text-blue-700" },
//   { text: "탈춤축제", x: 75, y: 35, delay: 2.5, color: "bg-purple-100 text-purple-700" },
//   { text: "산천어축제", x: 5, y: 50, delay: 3, color: "bg-cyan-100 text-cyan-700" },
//   { text: "청자축제", x: 90, y: 80, delay: 1.8, color: "bg-emerald-100 text-emerald-700" },
//   { text: "전통문화축제", x: 70, y: 70, delay: 2.8, color: "bg-lime-100 text-lime-700" },
//   { text: "가을단풍축제", x: 35, y: 80, delay: 3.3, color: "bg-orange-100 text-orange-700" },
//   { text: "겨울얼음축제", x: 90, y: 30, delay: 3.7, color: "bg-slate-100 text-slate-700" },
// ]



interface HeroProps {
  setCurrentSeason: (index: number) => void
}

export default function Hero({ setCurrentSeason }: HeroProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [currentSeason, setCurrentSeasonProp] = useState(0) // 현재 계절을 나타내는 state
  const [prevSeason, setPrevSeason] = useState(3) // 이전 계절을 나타내는 state, 초기값은 겨울(3)
  // 현재 계절, 이전 계절초기값을 모두 0번index로 설정했었으나, 첫 useEffect발동 시 전환이 부자연스러웠음,
  // 초깃값을 각각 0,3으로 설정해 첫 배경전환 애니메이션이 자연스럽도록 함
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)

  // i18n에서 플로팅키워드 불러오기
  const floatingKeywords = t("main.floatingKeywords", { returnObjects: true }) as {
    text: string;
    x: number;
    y: number;
    delay: number;
    color: string;
  }[];

  const isInvalidQuery = (str: string) => {
    const trimmed = str.trim();
    // 1. 공백이 포함되어 있으면 무조건 불가능
    if (trimmed.includes(" ")) return true;
    // 2. 한글 자음/모음만 있을 때 불가능
    const onlyConsonantOrVowel = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
    if (onlyConsonantOrVowel.test(trimmed)) return true;
    // 3. 그 외(완성형 한글 등)는 가능
    return false;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSeason(currentSeason)
      const next = (currentSeason + 1) % Object.keys(styleMap).length
      setCurrentSeason(next)           // 기존 local state
      setCurrentSeasonProp(next)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentSeason, setCurrentSeason])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalidQuery(searchQuery)) {
      alert(t("main.alertInvalid")); // i18n으로 변경
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/festival?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleFloatingClick = (word: string) => {
    setSearchQuery(word)
    searchRef.current?.focus()
  }
  const seasonKeys = ["spring", "summer", "autumn", "winter"] as const;

  return (
    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.0 , ease : "easeInOut"}} // ← 여기로 지연을 주는 것
                      className="space-y-0"
                    
                    >
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 배경 gradient 레이어 2개 겹치기 */}
      <AnimatePresence>
        <motion.div
          key={`prev-${prevSeason}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 ${styleMap[seasonKeys[prevSeason]].color}`}
        />
      </AnimatePresence>
      <motion.div
        key={`curr-${currentSeason}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity:0 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${styleMap[seasonKeys[currentSeason]].color}`}
      />
      {/* Fade-out 추가 */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#fffefb]" />
      <div className="absolute inset-0">
        {floatingKeywords.map((k, i) => (
          <motion.div
  key={i}
  style={{ left: `${k.x}%`, top: `${k.y}%` }}
  className="absolute cursor-pointer"
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{
    delay: k.delay,
    duration: 0.8,
    ease: "easeOut",
  }}
  onClick={() => handleFloatingClick(k.text)}
>
  <motion.div
    animate={{ y: [0, -10, 10, -15, 0] }}
    transition={{
      delay: k.delay + 0.8, // 등장 끝난 뒤 float 시작
      repeat: Infinity,
      repeatType: "loop",
      duration: 5,
      ease: "easeInOut",
    }}
    whileHover={{
      scale: 1.1,
      y: 0,
      transition: { duration: 0.2, repeat: 0 },
    }}
  >
    <motion.div
              animate={isSearchFocused ? { scale: [1.05, 1, 1.05], opacity: [1, 0.7, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
            >
              <Badge
                className={`px-3 py-1 text-sm font-medium shadow-lg backdrop-blur-sm border-0 transition-all duration-300 z-50 ${k.color}`}
              >
                {k.text}
              </Badge>
            </motion.div>
  </motion.div>
</motion.div>

        ))}
      </div>
        <motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{
    delay: 1.2,
    duration: 0.7,
    ease: "easeInOut",
  }}
>
      <div className="relative z-10 w-full max-w-4xl px-4 text-center z-0">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
           {t("main.headline1")} <br />
          <span className={`${styleMap[seasonKeys[currentSeason]].accent} transition-colors duration-1000`}>
            {t("main.headline2")}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          {t("main.desc")}
        </p>

        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
          <motion.div
            animate={isSearchFocused ? { scale: 1.02, boxShadow: styleMap[seasonKeys[currentSeason]].shadow } : {}}
            className={`relative bg-white rounded-full ${styleMap[seasonKeys[currentSeason]].border} ${
              isSearchFocused ? `${styleMap[seasonKeys[currentSeason]].border} ` : "border-gray-200 shadow" //input컴포넌트와 겹치긴하는데 일단냅둠 이런것들 나중에 둘중하나로 단일화
            }`}
          >
            <Input
              ref={searchRef}
              type="text"
              placeholder={t("main.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="h-16 pl-6 pr-20 text-lg border-0 rounded-full focus:ring-0 focus:outline-none"
            />
            {/* <Button
              type="submit"
              className="absolute right-0 top-0 h-12 w-12 rounded-full bg-[#ff651b]/90 hover:bg-[#ff651b]"
            > */}
              <Button
              type="submit"
              className={`absolute right-0 top-0 h-12 w-12 rounded-full ${styleMap[seasonKeys[currentSeason]].accent}`}
            >
              
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        </form>
        {/* 빠른 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center z-10">
            <motion.div
              whileHover={{
                scale: 1.05,
              transition: { type: "spring", ease: "easeOut",duration: 0.3 }
              }}
            >
            <Button
              size="lg"
              className={`  ${styleMap[seasonKeys[currentSeason]].border} ${styleMap[seasonKeys[currentSeason]].accent}  transition-colors duration-1000 rounded-full px-8`}
              onClick={() => navigate("/festival")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {t("main.btnAll")}
            </Button></motion.div>
            <motion.div
              whileHover={{
                scale: 1.05,
              transition: { type: "spring", ease: "easeOut",duration: 0.3 }
              }}
            >
            <Button
              size="lg"
              variant="outline"
              className={` ${styleMap[seasonKeys[currentSeason]].border}   ${styleMap[seasonKeys[currentSeason]].accent} transition-colors duration-1000 rounded-full px-8`}
              onClick={() => navigate("/festivalperiod")}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              {t("main.btnPeriod")}
            </Button>
            </motion.div>
          </div>
      </div></motion.div>
    </section>
    </motion.div>
  )
}
