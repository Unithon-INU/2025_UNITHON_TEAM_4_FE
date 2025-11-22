import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import kor from "./locales/kor.json";
import eng from "./locales/eng.json";
import jpn from "./locales/jpn.json";
import chn from "./locales/chn.json";
import fra from "./locales/fra.json";     // 프랑스어
import spa from "./locales/spa.json";     // 스페인어
import rus from "./locales/rus.json";     // 러시아어
// ...필요한 언어 추가

i18n
  .use(initReactI18next)
  .init({
    resources: {
      kor: { translation: kor },
      eng: { translation: eng },
      jpn: { translation: jpn },
      chn: { translation: chn },
      fra: { translation: fra }, // 프랑스어
      spa: { translation: spa }, // 스페인어
      rus: { translation: rus }, // 러시아어
      // ...필요한 언어 추가
    },
    lng: "kor", // 기본 언어
    fallbackLng: "kor", // 없으면 한글
    interpolation: { escapeValue: false },
  });

export default i18n;
