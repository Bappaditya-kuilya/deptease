import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { resetId, type } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!resetId) {
      toast.error("Invalid or expired reset link.");
      navigate("/");
    }
  }, [resetId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!type) {
      toast.error("Invalid Reset Password Link.");
      return;
    }
    setIsLoading(true);
    toast.loading("Resetting your password...");

    try {
      const response = await axiosWrapper.post(
        `/${type}/update-password/${resetId}`,
        { password: newPassword, resetId }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Password reset successfully.");
        navigate("/");
      } else {
        toast.error(response.data.message || "Error resetting password.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF0F2] text-[#16181D] relative flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,244,229,0.7),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.9),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(228,230,234,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(228,230,234,0.9)_1px,transparent_1px)] bg-[length:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

      <div className="fade-up w-full max-w-md relative z-10 px-6 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#6E7178]">
            Reset credentials
          </p>
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-bold mt-2 text-[#16181D]">
            Update Password
          </h1>
        </div>
        <form
          className="w-full rounded-2xl border border-[#E4E6EA] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.06)] space-y-5"
          onSubmit={onSubmit}
        >
          <div>
            <label
              className="block text-sm font-medium text-[#6E7178] mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
              className="w-full bg-white border border-[#E4E6EA] rounded-2xl px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/60 transition"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#6E7178] mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              className="w-full bg-white border border-[#E4E6EA] rounded-2xl px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/60 transition"
            />
          </div>

          <CustomButton
            type="submit"
            disabled={isLoading}
            className="w-full !rounded-full !px-5 !py-3 !bg-[#1A1D21] !text-white font-medium hover:!bg-[#16181D] active:scale-95 !shadow-[0_8px_24px_rgba(16,24,40,0.18)] transition"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </CustomButton>
        </form>
        <p className="mt-6 text-center text-xs text-[#6E7178]">
          Choose a strong password you haven't used before.
        </p>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default UpdatePassword;
