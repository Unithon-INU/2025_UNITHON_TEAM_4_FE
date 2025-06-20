import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import routePath from "../../routes/routePath";
import GlobeIcon from "./components/GlobeIcon";
import ChevronDownIcon from "./components/ChevronDownIcon";
import MenuIcon from "./components/MenuIcon";
import UserIcon from "./components/UserIcon";
import { LANG_MAP, LANG_LABEL_MAP } from "../../constants/lang";
import { useLangStore } from "../../libraries/stores/langStore";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

// 네비게이션 아이템 key는 kor.json/eng.json/... 파일의 key와 맞추기
const leftNavItems = [
  { name: "home", to: routePath.Main },
  { name: "festival", to: routePath.Festival },
  { name: "period", to: routePath.FestivalPeriod },
  { name: "community", to: routePath.Community },
];

const languages = [
  "한국어",
  "English",
  "日本語",
  "中文",
  "Français",
  "Español",
  "Русский",

  // 필요시 추가
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const { lang, setLang } = useLangStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };
  // 언어 선택 핸들러
  const handleLangSelect = (label: string) => {
    const code = LANG_MAP[label];
    setLang(code as "kor" | "eng" | "jpn" | "chn" | "fra" | "spa" | "rus");
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  // 현재 언어 라벨
  const currentLangLabel = LANG_LABEL_MAP[lang] || "한국어";

  return (
    <nav className="fixed top-0 z-30 w-full h-[90px] bg-white border-b shadow-sm ">
      <div className="w-full px-20">
        <div className="flex h-[90px] items-center justify-between">
          {/* 왼쪽 네비게이션 (PC) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {leftNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="relative px-3 py-2 text-lg font-medium text-gray-700 transition-colors hover:text-[#ff651b] group"
              >
                {t(`navbar.${item.name}`)}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#ff651b] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-700 p-2 rounded hover:bg-orange-50"
              aria-label="메뉴 열기"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            {/* 모바일 메뉴 Drawer */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 bg-black/40">
                <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg p-6 flex flex-col">
                  <div className="flex items-center justify-between pb-4">
                    <h2 className="text-lg font-semibold text-[#ff651b]">{t("navbar.menu") || "축제 메뉴"}</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-500 hover:text-[#ff651b] text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 space-y-4">
                    {leftNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-[#ff651b] rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(`navbar.${item.name}`)}
                      </Link>
                    ))}
                    <div className="border-t pt-4 space-y-4">
                      {/* 언어 선택 (모바일) */}
                      <div className="relative">
                        <button
                          onClick={() => setIsLangOpen((v) => !v)}
                          className="w-full flex items-center text-gray-700 hover:text-[#ff651b] px-3 py-2 rounded-md transition-colors"
                        >
                          <GlobeIcon className="mr-2 h-4 w-4" />
                          {currentLangLabel}
                          <ChevronDownIcon className="ml-auto h-4 w-4" />
                        </button>
                        {isLangOpen && (
                          <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-20 border border-gray-100">
                            {languages.map((langLabel) => (
                              <div
                                key={langLabel}
                                className="px-4 py-2 rounded cursor-pointer hover:bg-orange-50 hover:text-[#ff651b] transition-colors"
                                onClick={() => handleLangSelect(langLabel)}
                              >
                                {langLabel}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Link
                        to={routePath.MyPage}
                        className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-[#ff651b] rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        {t("navbar.mypage")}
                      </Link>
                      <div className="space-y-2">
                        <Link
                          to={routePath.Login}
                          className="block w-full border border-[#ff651b] text-[#ff651b] rounded-md px-4 py-2 text-center hover:bg-[#ff651b] hover:text-white transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {t("navbar.login")}
                        </Link>
                        <Link
                          to={routePath.Signup}
                          className="block w-full bg-[#ff651b] hover:bg-[#e55a18] text-white rounded-md px-4 py-2 text-center transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {t("navbar.signup")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽 네비게이션 (PC) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* 언어 선택 (PC) */}
            <div className="relative group">
              <button
                className="flex items-center text-gray-700 hover:text-[#ff651b] hover:bg-orange-50 px-3 py-2 rounded-md transition-colors"
                onClick={() => setIsLangOpen((v) => !v)}
                type="button"
              >
                <GlobeIcon className="mr-2 h-4 w-4" />
                {currentLangLabel}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-20 border border-gray-100">
                  {languages.map((langLabel) => (
                    <div
                      key={langLabel}
                      className="px-4 py-2 rounded cursor-pointer hover:bg-orange-50 hover:text-[#ff651b] transition-colors"
                      onClick={() => handleLangSelect(langLabel)}
                    >
                      {langLabel}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isLoggedIn ? (
          <>
            {/* 마이페이지 */}
            <Link
              to={routePath.MyPage}
              className="flex items-center text-gray-700 hover:text-[#ff651b] hover:bg-orange-50 px-3 py-2 rounded-md transition-colors"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              {t("navbar.mypage")}
            </Link>
            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="bg-[#ff651b] hover:bg-[#e55a18] text-white rounded-md px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("navbar.logout")}
            </button>
          </>
        ) : (
          <>
            {/* 로그인 */}
            <Link
              to={routePath.Login}
              className="border border-[#ff651b] text-[#ff651b] rounded-md px-4 py-2 hover:bg-[#ff651b] hover:text-white transition-colors"
            >
              {t("navbar.login")}
            </Link>
            {/* 회원가입 */}
            <Link
              to={routePath.Signup}
              className="bg-[#ff651b] hover:bg-[#e55a18] text-white rounded-md px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("navbar.signup")}
            </Link>
          </>
        )}
          </div>
        </div>
      </div>
    </nav>
  );
}
