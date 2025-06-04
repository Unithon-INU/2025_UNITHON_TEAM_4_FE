import { useState } from "react";
import { UserPlus, Eye } from "lucide-react";
import Navbar from "../../components/Navbar";
import signup from "../../apis/signup";

const NAVBAR_HEIGHT = 90;

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!email || !name || !password || !confirmPassword) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setError("");
      await signup({ name, email, password });
      alert("회원가입이 완료되었습니다!");
      window.location.replace("/login");
    } catch (err) {
      setError("회원가입 중 문제가 발생했습니다.");
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
              <div className="w-16 h-16 bg-[#ff651b]/10 rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-[#ff651b]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
            <p className="text-gray-600 mt-2">
              축제 커뮤니티에 가입하고
              <br />
              다양한 경험을 공유해보세요
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3"
                placeholder="이메일 주소를 입력하세요"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3"
                placeholder="닉네임을 입력하세요"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="off"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  aria-label="비밀번호 보기"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10"
                  placeholder="비밀번호를 다시 입력하세요"
                  autoComplete="off"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  aria-label="비밀번호 보기"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="button"
              onClick={handleSignup}
              className="w-full h-11 rounded-lg font-bold text-white bg-[#ff651b] hover:bg-[#ff651b] transition-colors text-base mt-2 text-center"
            >
              회원가입
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <a
                href="/login"
                className="text-[#ff651b] hover:text-[#ff651b] font-medium underline"
              >
                로그인
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
