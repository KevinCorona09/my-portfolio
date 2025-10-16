// react/AnimatedShowcase.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function AnimatedSection({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  const variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, delay }}
      variants={variants}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedProjectsGrid({ projects = [] }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <motion.a
          key={p.id || i}
          href={p.href || "#"}
          target={p.target || "_blank"}
          rel="noreferrer"
          className="block rounded-2xl p-4"
          style={{ background: "#121418", border: "1px solid #252932" }}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
          whileHover={reduce ? {} : { y: -4 }}
        >
          <div className="text-lg font-semibold mb-2">{p.title}</div>
          <p className="text-sm opacity-80 mb-3">{p.description}</p>
          <div className="text-xs opacity-60">{p.tags?.join(" • ")}</div>
        </motion.a>
      ))}
    </div>
  );
}

export function AnimatedSkillBars({ skills = [] }) {
  const reduce = useReducedMotion();
  return (
    <div className="space-y-4">
      {skills.map((s, i) => (
        <div key={s.name || i}>
          <div className="flex justify-between text-sm mb-1">
            <span>{s.name}</span>
            <span>{s.level}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "#141821" }}>
            <motion.div
              className="h-full"
              style={{ background: "linear-gradient(90deg,#7c4dff,#f4c04e)" }}
              initial={{ width: 0 }}
              whileInView={{ width: `${s.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 1.2, ease: "easeInOut", delay: i * 0.05 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
