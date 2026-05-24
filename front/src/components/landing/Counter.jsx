import { useEffect, useState, useRef } from "react";

export default function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();

      let start = 0;
      const step = to / 60;

      const timer = setInterval(() => {
        start += step;
        if (start >= to) {
          setVal(to);
          clearInterval(timer);
        } else {
          setVal(Math.floor(start));
        }
      }, 16);
    });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}