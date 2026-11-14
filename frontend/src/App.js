import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { gsap } from "gsap";
import mystore from "./redux/store";
import Login from "./Screens/Login";
import StudentHome from "./Screens/Student/Home";
import FacultyHome from "./Screens/Faculty/Home";
import AdminHome from "./Screens/Admin/Home";
import ForgetPassword from "./Screens/ForgetPassword";
import UpdatePassword from "./Screens/UpdatePassword";
import NotFound from "./Screens/NotFound";

const CURTAIN_FLAG = "deptease-curtain-seen";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const readSeen = () => {
  try {
    return sessionStorage.getItem(CURTAIN_FLAG) === "1";
  } catch (error) {
    return true;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(CURTAIN_FLAG, "1");
  } catch (error) {
    /* sessionStorage unavailable — curtain simply won't be re-suppressed */
  }
};

// First-visit curtain: full-screen ground plate with the DEPTEASE sign and a
// 2px amber route line drawing left -> right. Lifts on window load (max 1.2s),
// unmounts completely, and is skipped entirely under prefers-reduced-motion.
const Curtain = () => {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    markSeen();
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return undefined;

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
    const draw = gsap.to(line, {
      scaleX: 1,
      duration: 0.7,
      ease: "expo.out",
      delay: 0.1,
    });

    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      draw.kill();
      gsap.to(root, {
        yPercent: -100,
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => setVisible(false),
      });
    };

    const onLoad = () => lift();
    const timer = window.setTimeout(
      lift,
      document.readyState === "complete" ? 800 : 1200
    );
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
      draw.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#EFF0F2]"
    >
      <div className="flex flex-col items-center gap-5">
        <span className="rounded-2xl border border-[#E4E6EA] bg-white px-6 py-3 font-display text-2xl font-bold tracking-tight text-[#16181D] shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          DEPTEASE
        </span>
        <span
          ref={lineRef}
          className="block h-[2px] w-48 bg-[#FFB020]"
        />
      </div>
    </div>
  );
};

const App = () => {
  const [showCurtain] = useState(
    () => !prefersReducedMotion() && !readSeen()
  );

  return (
    <>
      {showCurtain && <Curtain />}
      <Provider store={mystore}>
        <Router>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#FFB020] focus:px-4 focus:py-2 focus:text-[#16181D]"
          >
            Skip to content
          </a>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/:type/update-password/:resetId"
              element={<UpdatePassword />}
            />
            <Route path="student" element={<StudentHome />} />
            <Route path="faculty" element={<FacultyHome />} />
            <Route path="admin" element={<AdminHome />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;
