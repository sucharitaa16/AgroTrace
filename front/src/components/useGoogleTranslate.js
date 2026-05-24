import { useEffect, useState } from "react";

export default function useGoogleTranslate() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If already loaded, just init
    if (window.google?.translate) {
      initWidget();
      return;
    }

    window.googleTranslateElementInit = () => {
      initWidget();
      setIsReady(true);
    };

    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      // ✅ No cleanup — removing the script breaks re-init on re-render
    } else {
      window.googleTranslateElementInit?.();
    }
  }, []);

  function initWidget() {
    // ✅ Guard against double-init (GT throws if element already has a widget)
    const container = document.getElementById("google_translate_element");
    if (!container || container.innerHTML.trim() !== "") return;

    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "hi,bn,en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
    setIsReady(true);
  }

  const changeLanguage = (lang) => {
    // Poll until the widget's <select> is available
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 300);

    // Safety timeout — stop polling after 5s
    setTimeout(() => clearInterval(interval), 5000);
  };

  return { isReady, changeLanguage };
}