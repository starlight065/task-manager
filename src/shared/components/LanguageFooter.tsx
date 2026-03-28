import { MenuItem, TextField } from "@mui/material";
import type { ChangeEvent } from "react";
import { useI18n } from "../i18n/useI18n";
import type { SupportedLanguage } from "../i18n";

const LANGUAGE_OPTIONS: ReadonlyArray<{
  labelKey: string;
  value: SupportedLanguage;
}> = [
  {
    value: "en",
    labelKey: "footer.english",
  },
  {
    value: "uk",
    labelKey: "footer.ukrainian",
  },
];

const LANGUAGE_SELECT_ID = "footer-language-select";

function LanguageFooter() {
  const { language, setLanguage, t } = useI18n();

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as SupportedLanguage);
  };

  return (
    <footer className="language-footer">
      <div className="language-footer__content">
        <label className="language-footer__label" htmlFor={LANGUAGE_SELECT_ID}>
          {t("footer.label")}
        </label>
        <div className="language-footer__switcher">
          <TextField
            select
            size="small"
            id={LANGUAGE_SELECT_ID}
            className="language-footer__field"
            value={language}
            variant="outlined"
            aria-label={t("footer.switcherAriaLabel")}
            onChange={handleLanguageChange}
          >
            {LANGUAGE_OPTIONS.map((option) => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
      </div>
    </footer>
  );
}

export default LanguageFooter;
