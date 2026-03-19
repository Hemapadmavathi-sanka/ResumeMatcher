import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import NotificationSystem from "./components/NotificationSystem";
import JobsPage from "./pages/JobsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import RecruiterJobsPage from "./pages/RecruiterJobsPage";
import PostJobPage from "./pages/PostJobPage";
import AllApplicantsPage from "./pages/AllApplicantsPage";
import "./App.css";

export default function App() {
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem("rm_token"),
    role:  localStorage.getItem("rm_role"),
    name:  localStorage.getItem("rm_name"),
    email: localStorage.getItem("rm_email"),
  }));
  const [page, setPage] = useState(() =>
    localStorage.getItem("rm_role") === "RECRUITER" ? "rec-jobs" : "jobs"
  );

  const handleLogin = (token, role, name, email) => {
    localStorage.setItem("rm_token", token);
    localStorage.setItem("rm_role",  role);
    localStorage.setItem("rm_name",  name || "");
    localStorage.setItem("rm_email", email || "");
    setAuth({ token, role, name, email });
    setPage(role === "RECRUITER" ? "rec-jobs" : "jobs");
  };

  const handleLogout = () => {
    localStorage.removeItem("rm_token");
    localStorage.removeItem("rm_role");
    localStorage.removeItem("rm_name");
    localStorage.removeItem("rm_email");
    setAuth({ token: null, role: null, name: null, email: null });
    setPage("jobs");
  };

  const renderPage = () => {
    const { token, role } = auth;
    if (role === "CANDIDATE") {
      if (page === "jobs")         return <JobsPage token={token} />;
      if (page === "applications") return <ApplicationsPage token={token} />;
      if (page === "profile")      return <ProfilePage token={token} />;
    }
    if (role === "RECRUITER") {
      if (page === "rec-jobs")        return <RecruiterJobsPage token={token} />;
      if (page === "post")            return <PostJobPage token={token} />;
      if (page === "all-applicants")  return <AllApplicantsPage token={token} />;
    }
    return null;
  };

  return (
    <>
      {!auth.token ? <AuthPage onLogin={handleLogin} /> : (
        <>
          <Navbar role={auth.role} page={page} setPage={setPage} onLogout={handleLogout} />
          {renderPage()}
          <NotificationSystem token={auth.token} userEmail={auth.email} />
        </>
      )}
    </>
  );
}
