import { SetStateAction, useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import login from "../../apis/login";
import { useTranslation } from "react-i18next";
const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      const response = await login({ email, password });
      console.log("로그인 성공:", response);
      window.location.replace("/"); // 🔁 여기서 페이지 이동!
    } catch (err) {
      setError(t("login.fail"));
      console.error("로그인 실패:", err);
    } //나중에 response status에 따라 에러 메시지 다르게 처리하기
  };

  return (
    <div
      className="fixed left-0 top-0 w-screen h-screen flex items-center justify-center bg-white z-50"
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <Navbar />
      <div className="w-[400px] bg-white border border-gray-200 rounded-2xl shadow p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-white">
              <LogIn className="h-7 w-7 text-[#ff651b]" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-gray-900">{t("login.title")}</h1>
          <p className="text-gray-500 text-base">
            {t("login.desc1")} <br /> {t("login.desc2")}
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
              {t("login.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder={t("login.emailPlaceholder")}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
              {t("login.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setPassword(e.target.value)
                }
                className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                placeholder={t("login.passwordPlaceholder")}
                autoComplete="off"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-700">
                {t("login.remember")}
              </label>
            </div>
            <a href="#" className="text-[#ff651b] hover:underline font-medium">
              {t("login.forgotPassword")}
            </a>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full h-11 rounded-lg font-bold text-white bg-[#ff651b] hover:bg-[#ff651b] transition-colors text-base mt-1 text-center"
          >
            {t("login.loginBtn")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t("login.noAccount")}{" "}
            <Link to="/signup">
              <span className="text-[#ff651b] hover:underline font-medium cursor-pointer">
                {t("login.signup")}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
