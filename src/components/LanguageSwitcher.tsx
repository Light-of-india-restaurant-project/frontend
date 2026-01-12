import { useLanguage, Language } from "@/lib/i18n";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("nl")}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
          language === "nl"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to Dutch"
      >
        NL
      </button>
    </div>
  );
};

export default LanguageSwitcher;
