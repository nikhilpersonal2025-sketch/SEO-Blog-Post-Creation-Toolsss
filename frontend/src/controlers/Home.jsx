import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, FileText } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const blogHeadlines = [
    "AI-Powered Blogs in One Click",
    "Instant Content for Every Niche",
    "Draft Full Articles in Seconds",
    "Your Personal AI Content Factory",
    "Smart Blogging Made Effortlessly Simple",
    "Generate High-Quality Blogs Instantly",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % blogHeadlines.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-300 to-primary/5 text-base-content">
      <Navbar />

      <div className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 ">
        {/* Hero badge */}
        <div className="animate-fade-in mb-6 bg-gray-600 rounded-xl ">
          <span className="badge badge-primary badge-lg gap-1.5 glass shadow-lg">
            <Zap className="w-4 h-4  " />
            AI-Powered
          </span>
        </div>

        {/* Animated headline with gradient */}
        <h1
          key={index}
          className="text-4xl md:text-6xl font-extrabold mb-6 transition-all duration-700 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          style={{ minHeight: "1.2em" }}
        >
          {blogHeadlines[index]}
        </h1>

        <p className="max-w-xl text-base-content/70 text-lg font-body mb-10 animate-slide-up stagger-1">
          Create SEO-optimized, high-quality blog posts instantly using AI. Save
          time. Scale faster. Publish smarter.
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-slide-up stagger-2">
          <button
            className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-smooth"
            onClick={() => navigate("/GenteratedProduct")}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            className="btn btn-outline btn-lg gap-2 hover:bg-base-200 transition-smooth"
            onClick={() => navigate("/GenteratedProduct")}
          >
            <FileText className="w-5 h-5" />
            View Demo
          </button>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap gap-4 justify-center opacity-90">
          {["Fetch Products", "SEO Keywords", "Generate Blog"].map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/80 shadow-md border border-base-300 transition-smooth hover:shadow-lg hover:border-primary/30"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
