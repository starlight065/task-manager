import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isSupportedLanguage, type SupportedLanguage } from "../../shared/i18n";

export const LANGUAGE_STORAGE_KEY = "task-manager-language";

interface LanguageState {
  current: SupportedLanguage;
}

function getInitialLanguage(): SupportedLanguage {
  const storage = globalThis.window?.localStorage;

  if (!storage) {
    return "en";
  }

  const storedLanguage = storage.getItem(LANGUAGE_STORAGE_KEY);

  return isSupportedLanguage(storedLanguage) ? storedLanguage : "en";
}

const initialState: LanguageState = {
  current: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      state.current = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
