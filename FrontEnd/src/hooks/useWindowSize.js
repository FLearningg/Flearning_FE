import { useState, useLayoutEffect } from "react";

export default function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize(); // Gọi 1 lần lúc đầu
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return { width: size[0], height: size[1] };
}
