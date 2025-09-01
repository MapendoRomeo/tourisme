
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AttractionsPage from "./pages/AttractionsPage";
import AttractionDetailPage from "./pages/AttractionDetailPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import AccommodationsPage from "./pages/AccommodationsPage";
import TeamPage from "./pages/TeamPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/attractions/:id" element={<AttractionDetailPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/accommodations" element={<AccommodationsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
