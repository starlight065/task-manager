import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { setLanguage } from "../../app/store/languageSlice";
import { getI18nLocale, t, type SupportedLanguage } from "./index";

export function useI18n() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);

  function updateLanguage(nextLanguage: SupportedLanguage) {
    dispatch(setLanguage(nextLanguage));
  }

  return {
    language,
    locale: getI18nLocale(language),
    setLanguage: updateLanguage,
    t: (key: string, params?: Record<string, boolean | number | string | undefined>) =>
      t(key, params, language),
  };
}
