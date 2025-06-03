import { Filter } from "lucide-react";

interface LanguageFilterProps {
  selectedLanguage: string;
  onLanguageChange?: (language: string) => void;
}

export default function LanguageFilter({ selectedLanguage }: LanguageFilterProps) {
  const languages = [
    { code: "all", name: "전체 언어" },
    { code: "ko", name: "한국어" },
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ru", name: "Русский" },
  ];

  return (
    <div className="flex items-center gap-2bg-[#fffefb] rounded-full shadow-lg border border-gray-200 px-4 py-2 bg-white">
      <Filter className="h-5 w-5 text-gray-500" />
      <select
        value={selectedLanguage}
        className="bg-transparent outline-none border-none text-gray-700"
        disabled // 퍼블리싱 용: 선택 불가, 실제 동작 없음
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
