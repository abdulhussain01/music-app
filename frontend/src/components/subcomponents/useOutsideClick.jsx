import { useEffect } from "react";

// Custom hook for detecting outside click
const useOutsideClick = (ref, callbacks) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callbacks.forEach((callback) => callback()); // Trigger callback when clicked outside
      }
    };

    // Attach event listener to detect outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callbacks]);
};

export default useOutsideClick;
