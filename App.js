import { AuthProvider } from "./contexts/AuthContext";
import { AppNavigator } from "./navigation/AppNavigator";
import "./firebase/config";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
