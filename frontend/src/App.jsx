import { useState, useCallback } from "react";
import Landing from "./components/Landing";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintCard from "./components/ComplaintCard";
import SideChatBot from "./components/SideChatBot";
import Feedback from "./components/Feedback";
import NotificationCenter from "./components/NotificationCenter";
import AdminDashboard from "./components/AdminDashboard";
import AgentModule from "./components/Agent/AgentModule";
import AgentResolutions from "./components/Agent/AgentResolutions";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import "./styles/Profile.css";
import "./styles/ButtonReset.css";

export default function App() {
  const [page, setPage] = useState("landing");
  const [user] = useState({
    name: "TelecomIQ Operator",
    email: "admin@telecomiq.com",
    role: "Admin"
  });
  const [result, setResult] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const navigateTo = useCallback((newPage) => {
    setPage(newPage);
    if (newPage === "landing") {
      setResult(null);
    }
  }, []);

  const handleComplaintSubmit = async (data) => {
    setResult(data);
  };

  const renderPage = () => {
    if (page === "landing") {
      return (
        <Landing
          user={user}
          onStart={() => navigateTo("form")}
          onFeedback={() => setFeedbackOpen(true)}
          onNavigate={navigateTo}
        />
      );
    }

    if (page === "admin") {
      return (
        <AdminDashboard
          user={user}
          onNavigate={navigateTo}
        />
      );
    }

    if (page === "agent-queue") {
      return (
        <AgentModule
          user={user}
          onNavigate={navigateTo}
        />
      );
    }

    if (page === "agent-resolutions") {
      return (
        <AgentResolutions
          user={user}
          onNavigate={navigateTo}
        />
      );
    }

    // Default: "form" (File Complaint page)
    return (
      <div className="landing-page-clean">
        <header className="landing-header-clean">
          <div className="header-left">
            <div className="brand-logo" onClick={() => navigateTo("landing")}>
              <div className="brand-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div className="logo-text-stack">
                <span className="logo-main-text">TelecomIQ</span>
                <span className="logo-sub-text">AI Intelligence</span>
              </div>
            </div>

            <nav className="nav-links">
              <button onClick={() => navigateTo("landing")}>Home</button>
              <button onClick={() => navigateTo("agent-queue")}>Agent Queue</button>
              <button onClick={() => navigateTo("agent-resolutions")}>Resolution Log</button>
              <button onClick={() => navigateTo("admin")}>Admin Dashboard</button>
            </nav>
          </div>

          <div className="header-right">
            <button className="btn-nav-ghost" onClick={() => navigateTo("agent-queue")}>
              Agent Queue
            </button>
            <button className="btn-nav-ghost" onClick={() => navigateTo("admin")}>
              Admin
            </button>
            <button className="btn-nav-primary" onClick={() => navigateTo("form")}>
              File Complaint
            </button>
          </div>
        </header>

        <main className="form-content-wrapper" style={{ padding: "40px 20px 80px", maxWidth: "1200px", margin: "0 auto" }}>
          <ComplaintForm onResult={handleComplaintSubmit} user={user} />
          
          {/* Analysis Result Popup Modal */}
          <AnimatePresence>
            {result && (
              <div className="analysis-popup-overlay" onClick={() => setResult(null)}>
                <motion.div
                  className="analysis-popup-modal"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="analysis-popup-header">
                    <div className="popup-title-group">
                      <span className="popup-badge">TELECOMIQ TRIAGE RESULT</span>
                      <h3 className="popup-title">Incident Analysis &amp; Resolution</h3>
                    </div>
                    <button className="popup-close-btn" onClick={() => setResult(null)} aria-label="Close modal">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="analysis-popup-body">
                    <ComplaintCard data={result} />
                  </div>

                  <div className="analysis-popup-footer">
                    <button className="btn-nav-primary" onClick={() => setResult(null)}>
                      Done / Close Analysis
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  };

  return (
    <>
      <NotificationCenter />

      {renderPage()}

      <motion.button
        className="chatbot-toggle"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChatbot(!showChatbot)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        aria-label="Open AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className="chatbot-badge"></span>
      </motion.button>
      <SideChatBot open={showChatbot} onClose={() => setShowChatbot(false)} />

      {feedbackOpen && (
        <Feedback onClose={() => setFeedbackOpen(false)} />
      )}
    </>
  );
}
