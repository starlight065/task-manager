import { StyledEngineProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../features/auth/model/AuthProvider";
import type { AppProvidersProps } from "../types";
import { store } from "../store/store";

function AppProviders({ children }: AppProvidersProps) {
  return (
    <StrictMode>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
          </BrowserRouter>
        </StyledEngineProvider>
      </Provider>
    </StrictMode>
  );
}

export default AppProviders;
