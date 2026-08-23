import { useState, useEffect } from "react";
import { getAllResolutions, logoutUser } from "../../api";
import ThemeToggle from "../ThemeToggle";
import "../../styles/AgentModule.css";
import { motion } from "framer-motion";

export default function AgentResolutions({ user, onNavigate }) {
    const [resolutions, setResolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: ""
    });

    useEffect(() => {
        if (user) {
            fetchResolutions();
        }
    }, [user, filters]);

    const fetchResolutions = async () => {
        setLoading(true);
        try {
            const data = await getAllResolutions(user?.email || "admin@telecomiq.com", { search: filters.search });
            setResolutions(data.resolutions || []);
        } catch (error) {
            console.error("Failed to fetch resolutions", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agent-module">
            {/* Unified Clean Header */}
            <header className="landing-header-clean">
                <div className="header-left">
                    <div className="brand-logo" onClick={() => onNavigate("landing")}>
                        <div className="brand-logo-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                <polyline points="2 17 12 22 22 17" />
                                <polyline points="2 12 12 17 22 12" />
                            </svg>
                        </div>
                        <div className="logo-text-stack">
                            <span className="logo-main-text">TelecomIQ</span>
                            <span className="logo-sub-text">Support Agent</span>
                        </div>
                    </div>

                    <nav className="nav-links">
                        <button onClick={() => onNavigate("landing")}>Home</button>
                        <button onClick={() => onNavigate("agent-queue")}>Agent Queue</button>
                        <button className="active" onClick={() => onNavigate("agent-resolutions")}>Resolution Log</button>
                    </nav>
                </div>

                <div className="header-right">
                    <button className="btn-nav-ghost" onClick={() => onNavigate("admin")}>
                        Dashboard
                    </button>
                    <button className="btn-nav-primary" onClick={() => onNavigate("form")}>
                        File Complaint
                    </button>
                </div>
            </header>

            <div className="agent-banner" style={{ padding: '3rem 2rem' }}>
                <motion.h1
                    className="agent-title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    Agent Verified Resolutions
                </motion.h1>
                <p className="agent-subtitle">Database of all human-verified and AI-validated solutions</p>
            </div>

            <div className="agent-content">
                <div className="agent-controls">
                    <div className="search-wrapper">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by Agent Name, User Email, or Content..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                </div>

                <div className="queue-table-container">
                    <table className="queue-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Support Agent</th>
                                <th>Customer</th>
                                <th>Resolution Strategy</th>
                                <th>AI Validation</th>
                                <th>Sent Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}><div className="loader" style={{ margin: '0 auto' }}></div></td></tr>
                            ) : resolutions.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>No archived resolutions found.</td></tr>
                            ) : (
                                resolutions.map(res => (
                                    <tr key={res.id} className="queue-row">
                                        <td><span className="ticket-id">{res.ticket_id}</span></td>
                                        <td>
                                            <div className="user-info">
                                                <span className="user-name">{res.agent_name}</span>
                                                <span className="user-email">Verification Specialist</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-info">
                                                <span className="user-name">{res.user_name}</span>
                                                <span className="user-email">{res.user_email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="resolution-text-preview" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{res.final_solution}</p>
                                                {res.steps && res.steps.length > 0 && (
                                                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.8rem', color: 'var(--agent-text-dim)' }}>
                                                        {res.steps.map((step, i) => (
                                                            <li key={i}>{step}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <span className="badge badge-positive" style={{ justifyContent: 'center' }}>
                                                    {(res.confidence_score * 100).toFixed(1)}% Consensus
                                                </span>
                                                <span className="validation-status-text">
                                                    {res.validation_status}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="user-email">
                                                {new Date(res.sent_at).toLocaleDateString()}<br />
                                                {new Date(res.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
