"use client";

import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import type { Variants } from "framer-motion";

export interface SwatchBookProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number | string;
  stroke?: string;
}

const swatchVariants: Variants = {
  normal: (i: number) => ({
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
  animate: (i: number) => {
    // Animation offsets for each swatch path
    const positions = [
      { x: 6, y: -2 },
      { x: 0, y: 5 },
      { x: -6, y: 0 },
    ];
    return {
      ...positions[i],
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    };
  },
};

export const SwatchBook = React.forwardRef<SVGSVGElement, SwatchBookProps>(
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
        {[
          "M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z",
          "M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7",
          "m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            variants={swatchVariants}
            animate={controls}
            initial="normal"
            custom={i}
          />
        ))}
        <motion.path
          d="M7 17h.01"
          variants={swatchVariants}
          animate={controls}
          initial="normal"
          custom={2}
        />
      </svg>
    );
  }
);

SwatchBook.displayName = "SwatchBook";