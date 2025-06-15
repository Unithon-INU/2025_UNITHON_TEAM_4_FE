import { useState } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import signup from "../../apis/signup";
import { useTranslation } from "react-i18next";

const NAVBAR_HEIGHT = 90;

const SignupPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !name || !password || !confirmPassword) {
      setError(t("signup.required"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("signup.pwMismatch"));
      return;
    }

    try {
      setError("");
      await signup({ name, email, password });
      alert(t("signup.success"));
      window.location.replace("/login");
    } catch (err) {
      setError(t("signup.fail"));
      console.error("회원가입 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <main
        className="flex justify-center items-center"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginTop: NAVBAR_HEIGHT,
        }}
      >
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16  rounded-full flex items-center justify-center border border-gray-200">
                <UserPlus className="h-8 w-8 text-[#ff651b]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("signup.title")}</h1>
            <p className="text-gray-600 mt-2">
              {t("signup.desc1")}
              <br />
              {t("signup.desc2")}
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("signup.email")} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3"
                placeholder={t("signup.emailPlaceholder")}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                {t("signup.nickname")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3"
                placeholder={t("signup.nicknamePlaceholder")}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("signup.password")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10"
                  placeholder={t("signup.passwordPlaceholder")}
                  autoComplete="off"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  aria-label={showPassword ? t("signup.hidePassword") : t("signup.showPassword")}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t("signup.passwordCheck")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10"
                  placeholder={t("signup.passwordCheckPlaceholder")}
                  autoComplete="off"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  aria-label={showConfirmPassword ? t("signup.hidePassword") : t("signup.showPassword")}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="button"
              onClick={handleSignup}
              className="w-full h-11 rounded-lg font-bold text-white bg-[#ff651b] hover:bg-[#ff651b] transition-colors text-base mt-2 text-center"
            >
              {t("signup.signupBtn")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t("signup.alreadyAccount")}{" "}
              <a
                href="/login"
                className="text-[#ff651b] hover:text-[#ff651b] font-medium underline"
              >
                {t("signup.login")}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
