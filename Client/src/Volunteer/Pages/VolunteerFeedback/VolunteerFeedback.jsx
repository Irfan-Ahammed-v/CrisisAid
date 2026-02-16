import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

axios.defaults.withCredentials = true;

const VolunteerFeedback = () => {
    const { user } = useAuth();
    const { theme } = useVolunteerTheme();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const isDark = theme === "dark";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            await axios.post("http://localhost:5000/volunteer/feedback", {
                feedback_content: content
            });
            setSubmitted(true);
            setContent("");
        } catch (error) {
            console.error("Failed to submit feedback", error);
            alert("Failed to submit feedback. Please try again.");
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
                <div className={`border rounded-2xl p-10 text-center max-w-md w-full shadow-2xl transition-all duration-300 ${
                    isDark ? 'bg-[#161b22] border-emerald-500/30' : 'bg-white border-emerald-200'
                }`}>
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ✅
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Thank You!</h2>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
                        Your feedback has been received. We appreciate your contribution to improving our relief operations.
                    </p>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-8 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center mb-10">
                <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Volunteer Feedback</h1>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Share your experiences, report issues, or suggest improvements.<br/>
                    Your voice helps us save more lives.
                </p>
            </div>

            <div className={`border rounded-2xl p-8 shadow-xl transition-colors duration-300 ${
                isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
            }`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            Your Message
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Describe your experience or suggestion here..."
                            rows="6"
                            className={`w-full rounded-xl p-4 transition-all resize-none outline-none border ${
                                isDark 
                                    ? 'bg-[#0d1117] border-[#30363d] text-slate-200 placeholder-slate-600 focus:border-emerald-500' 
                                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                            }`}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            * Feedback is reviewed by Center Admins.
                        </p>
                        <button
                            type="submit"
                            disabled={submitting || !content.trim()}
                            className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] ${
                                submitting || !content.trim()
                                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                            }`}
                        >
                            {submitting ? "Sending..." : "Submit Feedback"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VolunteerFeedback;
