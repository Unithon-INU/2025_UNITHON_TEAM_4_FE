import { create } from "zustand";

interface LangState {
  lang: "kor" | "eng" | "jpn";
  setLang: (lang: "kor" | "eng" | "jpn") => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: "kor", // 기본값: 한국어
  setLang: (lang) => set({ lang }),
}));