import { StyledEngineProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../features/auth/model/AuthProvider";
import type { AppProvidersProps } from "../types";

function AppProviders({ children }: AppProvidersProps) {
  return (
    <StrictMode>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </StyledEngineProvider>
    </StrictMode>
  );
}

export default AppProviders;
