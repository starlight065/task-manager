import { ThemeProvider } from "@mui/material/styles";
import { type ReactNode, StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../features/auth/model/AuthProvider";
import muiTheme from "../../theme/muiTheme";

interface AppProvidersProps {
  children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <StrictMode>
      <ThemeProvider theme={muiTheme}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
}

export default AppProviders;
