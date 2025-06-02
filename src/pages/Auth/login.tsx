import { useState } from "react";
import { LogIn, Eye } from "lucide-react";
import Navbar from "../../components/Navbar";
import login from "../../apis/login";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const response = await login({ email, password });
      console.log("로그인 성공:", response);
      alert("로그인 성공했습니다!"); // 로그인 요청
      window.location.replace("/main"); // 🔁 여기서 페이지 이동!
    } catch (err) {
      setError("오류가 발생했습니다.");
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
              <LogIn className="h-7 w-7 text-gray-800" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-gray-900">로그인</h1>
          <p className="text-gray-500 text-base">
            계정에 로그인하여 축제 커뮤니티를 <br /> 이용해보세요
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="이메일 주소를 입력하세요"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="비밀번호를 입력하세요"
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center"
                tabIndex={-1}
                aria-label="비밀번호 보기"
              >
                <Eye className="h-5 w-5 text-gray-400" />
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
                로그인 상태 유지
              </label>
            </div>
            <a href="#" className="text-green-500 hover:underline font-medium">
              비밀번호를 잊으셨나요?
            </a>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full h-11 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition-colors text-base mt-1 text-center"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            아직 계정이 없으신가요?{" "}
            <span className="text-green-500 hover:underline font-medium cursor-pointer">
              회원가입
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
