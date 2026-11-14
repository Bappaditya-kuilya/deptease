import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Count-up on reveal: ~900ms expo-out, tabular figures. Renders the final
// value immediately under prefers-reduced-motion (or when JS never runs).
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CountUp = ({ value = 0, className = "" }) => {
  const [display, setDisplay] = useState(value);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return undefined;
    }
    if (tweenRef.current) tweenRef.current.kill();
    const state = { v: 0 };
    setDisplay(0);
    tweenRef.current = gsap.to(state, {
      v: value,
      duration: 0.9,
      ease: "expo.out",
      onUpdate: () => setDisplay(Math.round(state.v)),
      onComplete: () => setDisplay(value),
    });
    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [value]);

  return <span className={className}>{display}</span>;
};

export default CountUp;
