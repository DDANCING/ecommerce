"use client";

import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import type { Variants } from "framer-motion";

const userVariants: Variants = {
  normal: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
  animate: (i: number) => ({
    scale: 1.12,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
};

export interface UserProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number | string;
  stroke?: string;
}

export const User = React.forwardRef<SVGSVGElement, UserProps>(
  (
    {
      size = 28,
      strokeWidth = 2,
      stroke = "currentColor",
      className,
      ...props
    },
    ref
  ) => {
    const controls = useAnimation();

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        onMouseEnter={() => controls.start("animate")}
        onMouseLeave={() => controls.start("normal")}
        {...props}
      >
        <motion.circle
          cx="12"
          cy="8"
          r="5.5"
          variants={userVariants}
          animate={controls}
          initial="normal"
          custom={0}
        />
        <motion.path
          d="M20 21a8 8 0 0 0-16 0"
          variants={userVariants}
          animate={controls}
          initial="normal"
          custom={1}
        />
      </svg>
    );
  }
);

User.displayName = "User";