import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import { AuthProvider } from "./context/AuthContext";

const LandingPage = () => (
  <>
    <Hero />
    <Benefits />
    <Collaboration />
    <Services />
    <Pricing />
    <Roadmap />
    <Footer />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <ButtonGradient />
    </AuthProvider>
  );
};

export default App;
