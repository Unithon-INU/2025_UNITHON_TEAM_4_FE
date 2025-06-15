import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footerSection.aboutTitle")}</h3>
            <p className="text-sm text-gray-600">{t("footerSection.aboutDesc")}</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footerSection.linksTitle")}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Button variant="ghost" className="h-auto p-0 text-gray-600 hover:text-rose-500" onClick={() => navigate("/festival")}>
                  {t("footerSection.allFestivals")}
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="h-auto p-0 text-gray-600 hover:text-rose-500" onClick={() => navigate("/festivalperiod")}>
                  {t("footerSection.periodFestivals")}
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="h-auto p-0 text-gray-600 hover:text-rose-500" onClick={() => navigate("/community")}>
                  {t("footerSection.community")}
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="h-auto p-0 text-gray-600 hover:text-rose-500" onClick={() => navigate("/mypage")}>
                  {t("footerSection.mypage")}
                </Button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footerSection.subscribeTitle")}</h3>
            <p className="mb-4 text-sm text-gray-600">{t("footerSection.subscribeDesc")}</p>
            <form className="flex gap-2">
              <Input type="email" placeholder={t("footerSection.emailPlaceholder")} className="h-10" />
              <Button type="submit" className="absolute relative right-0 w-10 h-auto bg-[#ff651b]/90 hover:bg-[#ff651b] rounded-xl text-[#fffefb]">
                {t("footerSection.subscribeBtn")}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p dangerouslySetInnerHTML={{ __html: t("footerSection.copyright") }} />
        </div>
      </div>
    </footer>
  );
}
