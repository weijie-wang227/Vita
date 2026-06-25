import { AppStateProvider } from "../state";
import { AuthGate } from "./AuthGate";

export default function App() {
  return (
    <AppStateProvider>
      <AuthGate />
    </AppStateProvider>
  );
}
