"use client";
import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  animate,
  useAnimate,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { money } from "@/lib/calc";
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      style={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.7 }}
    >
      {children}
    </m.div>
  );
}
export function AnimatedNumber({
  value,
  suffix = "",
  countOnView = false,
}: {
  value: number;
  suffix?: string;
  countOnView?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(countOnView ? 0 : value);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (countOnView && !inView) return;
    const control = animate(previous.current, value, {
      duration: reduced ? 0 : 0.7,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = money(Math.round(v));
      },
    });
    previous.current = value;
    return () => control.stop();
  }, [value, inView, reduced, countOnView]);
  return (
    <>
      <span ref={ref}>{money(value)}</span>
      {suffix}
    </>
  );
}
export function AnimatedPrice({ value }: { value: number }) {
  const [scope, animatePrice] = useAnimate();
  const reduced = useReducedMotion();
  useEffect(() => {
    const animation = animatePrice(
      scope.current,
      { scale: reduced ? [1, 1] : [1, 1.025, 1] },
      { duration: 0.35 },
    );
    return () => animation.stop();
  }, [value, animatePrice, scope, reduced]);
  return (
    <div ref={scope} className="total-price">
      <AnimatedNumber value={value} />
      <small>UZS</small>
    </div>
  );
}
export function Parallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className="parallax">
      <m.div style={{ y: reduced ? 0 : y }}>{children}</m.div>
    </div>
  );
}
