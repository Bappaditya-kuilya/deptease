import React, { useEffect, useRef } from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { gsap } from "gsap";
import CustomButton from "./CustomButton";
const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const lineRef = useRef(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return undefined;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.7,
        ease: "expo.out",
        transformOrigin: "left center",
      }
    );
    return () => tween.kill();
  }, []);

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-[#E4E6EA] px-6 py-4 mb-6">
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <p
          className="font-display font-semibold text-2xl flex justify-center items-center cursor-pointer text-[#16181D] transition-colors hover:text-[#1A1D21]"
          onClick={() => navigate("/")}
        >
          <span className="mr-2 text-[#B45309]">
            <RxDashboard />
          </span>{" "}
          {router.state && router.state.type
            ? `${router.state.type} Dashboard`
            : "Dashboard"}
        </p>
        <CustomButton variant="primary" onClick={logouthandler}>
          Logout
          <span className="ml-2">
            <FiLogOut />
          </span>
        </CustomButton>
      </div>
      {/* Campus wayfinding signature: the amber route line draws in on mount */}
      <span
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[#FFB020]"
      />
    </div>
  );
};

export default Navbar;
