import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import LoginRegister from "./components/LoginRegister";
import PublicScanPage from "./components/PublicScanPage";

function App() {
  

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginRegister />}
        />

        <Route
          path="/scan/:productId"
          element={<PublicScanPage />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;