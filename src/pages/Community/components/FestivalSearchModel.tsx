import { X, Search, Globe } from "lucide-react";

interface FestivalSearchModalProps {
  onClose: () => void;
}

export default function FestivalSearchModal({ onClose }: FestivalSearchModalProps) {
  // 예시 데이터
  const modalLanguage = "ko";
  const searchTerm = "진주";
  const selectedRegion = "all";
  const regions = [
    { code: "all", name: "전체 지역" },
    { code: "서울", name: "서울" },
    { code: "경상남도", name: "경상남도" },
    { code: "부산", name: "부산" },
  ];
  const languages = [
    { code: "ko", name: "한국어" },
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
  ];
  const uiText = {
    title: "축제 검색",
    searchPlaceholder: "축제 이름 검색...",
    searchButton: "검색",
    loading: "검색 중...",
    noResults: "검색 결과가 없습니다.",
    searchPrompt: "축제 이름을 검색해주세요.",
    period: "기간",
  };
  const searchResults = [
    {
      id: 1,
      name: { ko: "진주 남강유등축제" },
      region: { ko: "경상남도" },
      period: "2023-10-01 ~ 2023-10-15",
    },
    {
      id: 2,
      name: { ko: "진해 벚꽃축제" },
      region: { ko: "경상남도" },
      period: "2023-04-01 ~ 2023-04-10",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{uiText.title}</h3>
          <div className="flex items-center gap-2">
            {/* 언어 선택 드롭다운 (기본 select) */}
            <div className="flex items-center gap-1">
              <Globe className="h-5 w-5 text-[#ff651b]" />
              <select
                value={modalLanguage}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-gray-300 focus:border-gray-300 "
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            {/* 지역 선택 */}
            <select
              value={selectedRegion}
              className="border border-gray-300 rounded-md p-2  md:w-1/3 focus:outline-none focus:ring-gray-300 focus:border-gray-300"
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>

            {/* 검색창 */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={uiText.searchPlaceholder}
                value={searchTerm}
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-gray-300 focus:border-gray-300"
                readOnly
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* 검색 버튼 */}
            <button
              type="button"
              className="bg-[#ff651b] text-white px-4 py-2 rounded-md hover:bg-[#ff651b] transition-colors"
            >
              {uiText.searchButton}
            </button>
          </div>

          {/* 검색 결과 */}
          <div className="overflow-y-auto max-h-[50vh]">
            <ul className="divide-y">
              {searchResults.map((festival) => (
                <li key={festival.id} className="py-3 px-2 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-gray-900">{festival.name.ko}</div>
                  <div className="text-sm text-gray-500 flex justify-between mt-1">
                    <span>{festival.region.ko}</span>
                    <span>{festival.period}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
