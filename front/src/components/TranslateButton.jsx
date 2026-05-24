import { useEffect, useState } from "react";

export default function useGoogleTranslate() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prevent loading script twice
    if (window.google && window.google.translate) {
      setIsReady(true);
      return;
    }

    // Google callback
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      setIsReady(true);
    };

    // Load script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Change language
 const changeLanguage = (lang) => {
  if (!isReady) {
    alert("Translator is still loading...");
    return;
  }

  const select = document.querySelector(".goog-te-combo");

  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));

    // Hide Google top banner after translation
    setTimeout(() => {
      document.body.style.top = "0px";
  document.body.classList.remove("translated-ltr");
  document.body.classList.remove("translated-rtl");

  const banner = document.querySelector(".goog-te-banner-frame");
  if (banner) {
    banner.style.display = "none";
  }
}, 1000);
  }
};
  return { changeLanguage };
}