import React, { useState, useEffect } from "react";
import { FiLogIn, FiGrid, FiShield, FiBarChart2 } from "react-icons/fi";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import CustomButton from "../components/CustomButton";
import Reveal from "../components/Reveal";
import axiosWrapper from "../utils/AxiosWrapper";
const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const LoginForm = ({ selected, onSubmit, formData, setFormData }) => (
  <form className="w-full space-y-5" onSubmit={onSubmit}>
    <div>
      <label
        className="block text-sm font-medium text-[#6E7178] mb-2"
        htmlFor="email"
      >
        {selected} Email
      </label>
      <input
        type="email"
        id="email"
        required
        className="w-full bg-white border border-[#E4E6EA] rounded-2xl px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/60 transition"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div>
      <label
        className="block text-sm font-medium text-[#6E7178] mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        required
        className="w-full bg-white border border-[#E4E6EA] rounded-2xl px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/60 transition"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
    <div className="flex items-center justify-between">
      <Link
        className="text-sm text-[#6E7178] underline underline-offset-4 hover:text-[#B45309] transition"
        to="/forget-password"
      >
        Forgot Password?
      </Link>
    </div>
    <CustomButton
      type="submit"
      className="w-full !rounded-full !px-5 !py-3 !bg-[#1A1D21] !text-white font-medium hover:!bg-[#16181D] active:scale-95 !shadow-[0_8px_24px_rgba(16,24,40,0.18)] transition flex justify-center items-center gap-2"
    >
      Login
      <FiLogIn className="text-lg" />
    </CustomButton>
  </form>
);

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-3 gap-1 rounded-full border border-[#E4E6EA] bg-white p-1 mb-6">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
          selected === type
            ? "bg-[#1A1D21] text-white shadow hover:-translate-y-px"
            : "text-[#6E7178] hover:text-[#16181D] hover:bg-[#EFF0F2] hover:-translate-y-px"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const FEATURES = [
  {
    icon: FiGrid,
    title: "Unified records",
    text: "Students, faculty, branches and subjects in one connected graph.",
  },
  {
    icon: FiShield,
    title: "Role-based access",
    text: "Student, faculty and admin dashboards with scoped permissions.",
  },
  {
    icon: FiBarChart2,
    title: "Exams & notices",
    text: "Timetables, marks, results and circulars — always current.",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);

  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-[#EFF0F2] text-[#16181D] flex items-stretch"
    >
      {/* Left brand panel */}
      <div className="hidden lg:flex relative flex-1 flex-col justify-between overflow-hidden p-12 border-r border-[#E4E6EA]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,176,32,0.30),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(242,244,245,0.18),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

        <div className="fade-up relative z-10 flex items-center gap-4">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#E4E6EA] bg-white px-4 py-1.5 text-xs uppercase tracking-widest text-[#6E7178]">
            <span className="idle-pulse h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
            College Management System
          </span>
          {/* Live route leaving the sign. Delayed half a pulse cycle so its
              idle-dead moment never coincides with the rule under the wordmark. */}
          <span
            aria-hidden="true"
            style={{ animationDelay: "0.75s" }}
            className="idle-pulse-line h-[4px] min-w-0 flex-1 rounded-full bg-[#FFB020]"
          />
        </div>

        <div className="fade-up-1 relative z-10 max-w-xl">
          <h1 className="font-['Plus Jakarta Sans'] text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight text-[#B45309]">
            DeptEase
          </h1>
          <span
            aria-hidden="true"
            className="idle-pulse-line mt-6 block h-[4px] w-80 max-w-full rounded-full bg-[#FFB020]"
          />
          <p className="mt-6 text-lg text-[#6E7178] leading-relaxed">
            The editorial control room for your department — students, faculty,
            exams and notices in one dark, focused workspace.
          </p>
          <ul className="mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E4E6EA] bg-white text-[#B45309]">
                  <Icon className="text-lg" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-[#16181D]">
                    {title}
                  </span>
                  <span className="block text-sm text-[#6E7178]">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fade-up-2 relative z-10 text-sm text-[#6E7178]">
          DeptEase © {new Date().getFullYear()} — built for modern departments
        </div>
      </div>

      {/* Right auth side */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[#FFB020]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#FFB020]/15 blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <div className="fade-up lg:hidden mb-8 text-center">
            <h1 className="font-['Plus Jakarta Sans'] text-5xl font-bold text-[#B45309]">
              DeptEase
            </h1>
          </div>

          <Reveal index={0}>
            <div className="rounded-lg border border-[#E4E6EA] bg-white p-8 shadow-2xl shadow-[0_4px_16px_rgba(22,24,29,0.10)]">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-[#6E7178]">
                  Welcome back
                </p>
                <h2 className="font-['Plus Jakarta Sans'] text-3xl font-bold mt-1 text-[#16181D]">
                  {selected} Login
                </h2>
              </div>
              <UserTypeSelector
                selected={selected}
                onSelect={handleUserTypeSelect}
              />
              <LoginForm
                selected={selected}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </Reveal>

          <p className="fade-up-2 mt-6 text-center text-xs text-[#6E7178]">
            Secure access for students, faculty and administrators.
          </p>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </main>
  );
};

export default Login;
