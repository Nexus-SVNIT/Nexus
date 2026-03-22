import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for Intersection Observer.
 * Returns [ref, isVisible] — attach `ref` to the element you want to observe.
 *
 * @param {Object} options - IntersectionObserver options
 * @param {string} options.rootMargin - Margin around root (default: "0px")
 * @param {number} options.threshold - Visibility threshold 0-1 (default: 0.1)
 * @param {boolean} options.triggerOnce - Only trigger once (default: true)
 */
const useIntersectionObserver = ({
  rootMargin = "0px 0px -60px 0px",
  threshold = 0.1,
  triggerOnce = true,
} = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return [ref, isVisible];
};

export default useIntersectionObserver;
