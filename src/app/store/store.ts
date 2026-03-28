import { configureStore } from "@reduxjs/toolkit";
import {
  setI18nLanguage,
  type SupportedLanguage,
} from "../../shared/i18n";
import languageReducer, { LANGUAGE_STORAGE_KEY } from "./languageSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

function persistLanguage(language: SupportedLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

setI18nLanguage(store.getState().language.current);
persistLanguage(store.getState().language.current);

store.subscribe(() => {
  const language = store.getState().language.current;

  setI18nLanguage(language);
  persistLanguage(language);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
