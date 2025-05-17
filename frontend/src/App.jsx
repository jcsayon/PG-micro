import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ErrorBoundary } from "./pages/ErrorBoundary";
const App = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <AppRoutes />
      </div>
    </ErrorBoundary>
  );
};

export default App;
