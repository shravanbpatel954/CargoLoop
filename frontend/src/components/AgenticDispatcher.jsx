import { useState } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AgenticDispatcher({ onCreated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Assuming api connects to the backend base URL
      const { data } = await api.post("/loads/agentic", { prompt });
      setPrompt("");
      setSuccess(true);
      
      if (onCreated) onCreated(data);
      
      // Give user 1.5 seconds to see the success message before redirecting to Matches
      setTimeout(() => {
        navigate('/app/matches');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to process request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Bot size={120} />
      </div>
      
      <h2 className="text-2xl font-bold heading-font text-white mb-2 flex items-center gap-2">
        <Bot className="text-brand-400" />
        Agentic Dispatch
      </h2>
      <p className="text-slate-300 text-sm mb-6 max-w-lg relative z-10">
        Type or dictate your logistics needs in natural language. Our AI will automatically configure the load, classify cargo, and dispatch the best backhaul match.
      </p>

      <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col justify-end">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="e.g. 'I need to move 5 tons of temperature-sensitive vaccines from Delhi to Mumbai tomorrow...'"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 pr-16 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none shadow-inner"
            rows={4}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute bottom-4 right-4 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:hover:bg-brand-500 text-white p-2 rounded-lg transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && <p className="text-brand-400 text-sm mt-2 font-medium flex items-center gap-2">✨ Load successfully processed & matched by AI!</p>}
      </form>
    </motion.div>
  );
}
