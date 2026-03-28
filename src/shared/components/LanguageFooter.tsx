import usaFlag from "../../assets/flag-usa.svg";
import ukraineFlag from "../../assets/flag-ukraine.svg";
import { useI18n } from "../i18n/useI18n";
import type { SupportedLanguage } from "../i18n";

const LANGUAGE_OPTIONS: ReadonlyArray<{
  icon: string;
  labelKey: string;
  value: SupportedLanguage;
}> = [
  {
    value: "en",
    labelKey: "footer.english",
    icon: usaFlag,
  },
  {
    value: "uk",
    labelKey: "footer.ukrainian",
    icon: ukraineFlag,
  },
];

function LanguageFooter() {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer className="language-footer">
      <div className="language-footer__content">
        <span className="language-footer__label">{t("footer.label")}</span>
        <div
          className="language-footer__switcher"
          role="group"
          aria-label={t("footer.switcherAriaLabel")}
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.value === language;

            return (
              <button
                key={option.value}
                type="button"
                className={`language-footer__button${
                  isActive ? " language-footer__button--active" : ""
                }`}
                aria-pressed={isActive}
                aria-label={
                  option.value === "en"
                    ? t("footer.switchToEnglish")
                    : t("footer.switchToUkrainian")
                }
                onClick={() => setLanguage(option.value)}
              >
                <img src={option.icon} alt="" width="24" height="24" aria-hidden="true" />
                <span>{t(option.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

export default LanguageFooter;
