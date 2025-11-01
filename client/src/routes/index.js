import {
  About,
  Achievements,
  AchievementsForm,
  AlumniMenu,
  Events,
  Forms,
  Home,
  NotFound,
  RegisterForm,
  Teams,
} from "../components";


import SignUpForm from "../components/SignUpForm/SignUpForm.jsx";
import UserProfile from "../components/Profile/ProfilePage.jsx";
import LoginForm from "../components/LogInForm/LogInForm.jsx";
import ShowProject from "../components/Project/showProject.jsx";
import ForgotPasswordForm from "../components/ForgotPasswordForm/ForgotPasswordForm.jsx";
import cp from "../components/coding/cp.jsx";

import CreatePost from "../components/Post/CreatePost.jsx";
import InterviewExperiencePage from "../components/Post/InterviewExperiencePage.jsx";
import InterviewPost from "../components/Post/InterviewPost.jsx";
import EditPost from "../components/Post/EditPost.jsx";

import AlumniSignUpForm from "../components/AlumniSignUpForm/AlumniSignUpForm.jsx";
import Alumni from "../pages/Alumni/Alumni.jsx";

import StudyMaterialPage from "../pages/StudyMaterialPage.jsx";
import SubjectDetailPage from "../pages/SubjectDetailPage.jsx";



export const DefaultRoutes = [
  { path: "/", title: "Home", component: Home },
  { path: "team", title: "Teams", component: Teams },
  { path: "achievements", title: "Achievements", component: Achievements },
  { path: "achievements/add-new", title: "Add New Achievement", component: AchievementsForm },
  { path: "events", title: "Events", component: Events },
  { path: "forms", title: "Forms", component: Forms },
  { path: "about", title: "About", component: About },
  { path: "register/:formId", title: "Register Form", component: RegisterForm },
  { path: "alumni-network", title: "Alumni Network", component: Alumni },
  { path: "alumni-network/alumni", title: "Alumni Menu", component: AlumniMenu },
  { path: "login", title: "Login", component: LoginForm },
  { path: "signup", title: "Signup", component: SignUpForm },
  { path: "profile", title: "Profile", component: UserProfile },
  { path: "projects", title: "Projects", component: ShowProject },
  { path: "forgot-password", title: "Reset Password", component: ForgotPasswordForm },
  { path: "coding", title: "Coding", component: cp },
  { path: "interview-experiences/create", title: "Create Interview Experience", component: CreatePost },
  { path: "interview-experiences", title: "Interview Experiences", component: InterviewExperiencePage },
  { path: "interview-experiences/post/:id", title: "Interview Experience", component: InterviewPost },
  { path: "post/edit/:id", title: "Edit Post", component: EditPost },
  { path: "alumni/signup", title: "Alumni SignUp", component: AlumniSignUpForm },
  { path: "study-material", title: "Study Material", component: StudyMaterialPage },
  { path: "study-material/:id", title: "Subject Details", component: SubjectDetailPage },
  { path: "*", title: "Not Found", component: NotFound },
];
