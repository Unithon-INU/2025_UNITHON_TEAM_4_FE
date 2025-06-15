// src/components/search-bar.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { useTranslation } from 'react-i18next';
interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export function SearchBar({ onSearch, defaultValue = "" }: SearchBarProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(defaultValue);

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isInvalidQuery(query)) {
        alert(t("festivalSearchBar.invalid"));
        return;
      }
      onSearch(query);
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder={t("festivalSearchBar.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-9"
      />
    </div>
  );
}
