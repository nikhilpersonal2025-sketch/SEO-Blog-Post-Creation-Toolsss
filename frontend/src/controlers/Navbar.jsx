import { Link, useLocation } from "react-router-dom";
import { FileText, Home, Package, Sparkles } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  return (
    <header className="navbar bg-base-100/95 backdrop-blur-md shadow-md border-b border-base-300 sticky top-0 z-50 transition-smooth">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost gap-2 text-xl font-display font-bold hover:bg-primary/10 hover:text-primary transition-smooth"
        >
          <Sparkles className="w-6 h-6 text-primary" strokeWidth={2} />
          <span className="hidden sm:inline">SEO Blog Generator</span>
        </Link>
      </div>
      <nav className="flex-none gap-1">
        <Link
          to="/"
          className={`btn btn-ghost btn-sm gap-2 transition-smooth ${isActive("/") ? "btn-active text-primary" : ""}`}
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link
          to="/GenteratedProduct"
          className={`btn btn-ghost btn-sm gap-2 transition-smooth ${isActive("/GenteratedProduct") ? "btn-active text-primary" : ""}`}
        >
          <Package className="w-4 h-4" />
          <span className="hidden sm:inline">Fetch Products</span>
        </Link>
      </nav>
    </header>
  );
}
