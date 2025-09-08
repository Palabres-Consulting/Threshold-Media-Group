"use client";

import { motion } from "framer-motion";

import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

interface MotionWrapperProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
}

const variants = {
  hidden: (direction: Direction) => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -50 };
      case "right":
        return { opacity: 0, x: 50 };
      case "up":
        return { opacity: 0, y: 50 };
      case "down":
        return { opacity: 0, y: -50 };
      default:
        return { opacity: 0, y: 30 };
    }
  },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6 } },
  exit: (direction: Direction) => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -50 };
      case "right":
        return { opacity: 0, x: 50 };
      case "up":
        return { opacity: 0, y: -50 };
      case "down":
        return { opacity: 0, y: 50 };
      default:
        return { opacity: 0, y: -30 };
    }
  },
};

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  direction = "up",
  delay = 0,
}) => {
  return (
    <motion.div
      custom={direction}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      variants={variants}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
