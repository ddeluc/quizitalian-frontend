// THEME TEST
export const slideIn = (direction, delay = 0) => {
  return {
    hidden: { 
      x: direction === "left" ? "-150%" : direction === "right" ? "150%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: { 
      x: 0, 
      transition: { 
        duration: 0.5, 
        type: "spring",
        delay: delay,
      },
    },
  };
};

export const logoSlideIn = (duration) => {
  return {
    hidden: { 
      x: "-1200%",
      opacity: 0,
    },
    show: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        type: "spring",
        delay: duration,
      },
    },
  };
};



