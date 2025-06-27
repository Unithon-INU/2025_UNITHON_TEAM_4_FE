import { createBrowserRouter, RouteObject } from "react-router-dom";
import RoutePath from "./routePath";
import MainPage from "../pages/Main";
// import OnboardingPage from "@/pages/Onboarding";
import FestivalPage from "../pages/Festival/festivals";
import FestivalPeriodPage from "../pages/Festival/festivalperiod";
import CommunityPage from "../pages/Community";
import LoginPage from "../pages/Auth/login";
import SignupPage from "../pages/Auth/signup";
import MyPage from "../pages/Mypage";
import PostPage from "../pages/Community/post";
import CreatePostPage from "../pages/Community/create";
import PostModifyPage from "../pages/Mypage/postModify";
import FestivalDetailPage from "../pages/Festival/festivalDetail";
import AccountSettingPage from "../pages/Mypage/accountSetting";
const routes: RouteObject[] = [
  { path: RoutePath.Main, element: <MainPage /> },
  // { path: RoutePath.Onboarding, element: <OnboardingPage /> },
  { path: RoutePath.Festival, element: <FestivalPage /> },
  { path: RoutePath.FestivalPeriod, element: <FestivalPeriodPage /> },
  { path: RoutePath.FestivalDetail, element: <FestivalDetailPage /> },
  { path: RoutePath.Community, element: <CommunityPage /> },
  { path: RoutePath.Login, element: <LoginPage /> },
  { path: RoutePath.Signup, element: <SignupPage /> },
  { path: RoutePath.MyPage, element: <MyPage /> },
  { path: RoutePath.PostPage, element: <PostPage /> },
  { path: RoutePath.CreatePostPage, element: <CreatePostPage /> },
  { path: RoutePath.PostModifyPage, element: <PostModifyPage /> },
  { path: RoutePath.AccountSettingPage, element: <AccountSettingPage /> },
];

const Router = createBrowserRouter(routes);
export default Router;
