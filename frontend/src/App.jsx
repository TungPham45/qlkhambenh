import { RouterProvider } from "react-router-dom";
import { appRouter } from "./routes/AppRouter.jsx";
import { ErrorBoundary } from "./components/feedback/ErrorBoundary.jsx";

export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={appRouter} />
    </ErrorBoundary>
  );
}
