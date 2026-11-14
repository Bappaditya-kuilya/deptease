import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// "Plate settle" reveal: y 14px -> 0, rotateX 4deg -> 0, opacity 0 -> 1,
// 500ms expo-out, staggered by index. Plays once when the element enters
// the viewport. Renders fully visible when JS is off or the user prefers
// reduced motion (initial state is only applied from the effect).
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Reveal = ({ children, index = 0, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    let played = false;
    let tween = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played) return;
          played = true;
          observer.disconnect();
          tween = gsap.from(el, {
            y: 14,
            rotateX: 4,
            opacity: 0,
            transformPerspective: 600,
            duration: 0.5,
            ease: "expo.out",
            delay: Math.min(index, 8) * 0.05,
          });
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (tween) {
        tween.kill();
        gsap.set(el, { clearProps: "all" });
      }
    };
  }, [index]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default Reveal;
