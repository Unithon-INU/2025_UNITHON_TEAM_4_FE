import { UserPlus, Eye } from "lucide-react";
import Navbar from "../../components/Navbar";

const NAVBAR_HEIGHT = 90; // 네비게이션 바 높이(px)

const SignupPage = () => {
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

          {/* 폼 영역 */}
          <form className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일 (아이디로 사용) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-base placeholder:text-gray-400 focus:outline-none"
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
                name="nickname"
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-base placeholder:text-gray-400 focus:outline-none"
                placeholder="커뮤니티에서 사용할 닉네임을 입력하세요"
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
                  name="password"
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10 text-base placeholder:text-gray-400 focus:outline-none"
                  placeholder="8자 이상의 비밀번호를 입력하세요"
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
                  name="confirmPassword"
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 pr-10 text-base placeholder:text-gray-400 focus:outline-none"
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

            <div>
              <div className="flex items-start">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  className="h-4 w-4 text-[#ff651b] border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                  <span className="text-red-500 mr-1">*</span>
                  <a href="#" className="text-[#ff651b] hover:text-[#ff651b] underline">
                    이용약관
                  </a>
                  과{" "}
                  <a href="#" className="text-[#ff651b] hover:text-[#ff651b] underline">
                    개인정보 처리방침
                  </a>
                  에 동의합니다
                </label>
              </div>
            </div>

            <button
              type="button"
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
