import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

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

const ForgetPassword = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [selected, setSelected] = useState(USER_TYPES.STUDENT);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userToken) {
      navigate(`/${localStorage.getItem("userType")}`);
    }
  }, [userToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Sending reset mail...");
    if (email === "") {
      toast.dismiss();
      toast.error("Please enter your email");
      return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const resp = await axiosWrapper.post(
        `/${selected.toLowerCase()}/forget-password`,
        { email },
        {
          headers: headers,
        }
      );

      if (resp.data.success) {
        toast.dismiss();
        toast.success(resp.data.message);
      } else {
        toast.dismiss();
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending reset mail");
    } finally {
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF0F2] text-[#16181D] relative flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,244,229,0.7),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.9),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(228,230,234,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(228,230,234,0.9)_1px,transparent_1px)] bg-[length:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

      <div className="fade-up w-full max-w-lg relative z-10 px-6 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#6E7178]">
            Account recovery
          </p>
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-bold mt-2 text-[#16181D]">
            {selected} Forget Password
          </h1>
        </div>
        <div className="rounded-2xl border border-[#E4E6EA] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          <UserTypeSelector selected={selected} onSelect={setSelected} />
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
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
              />
            </div>
            <CustomButton
              type="submit"
              className="w-full !rounded-lg !px-5 !py-3 bg-[#FFB020] text-[#16181D] font-medium hover:opacity-90 active:scale-95 transition"
            >
              Send Reset Link
            </CustomButton>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-[#6E7178]">
          A secure reset link will be mailed to your registered address.
        </p>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default ForgetPassword;
