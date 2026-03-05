"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-2xl border border-card-border bg-card p-6 ${
        hover ? "transition-colors hover:border-accent/30" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
