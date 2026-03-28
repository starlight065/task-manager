import AppRouter from "./router/AppRouter";
import LanguageFooter from "../shared/components/LanguageFooter";

function App() {
  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <AppRouter />
      </div>
      <LanguageFooter />
    </div>
  );
}

export default App;
