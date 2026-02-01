import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import {
  Home,
  RefreshCw,
  Package,
  Tag,
  DollarSign,
  Star,
  ArrowLeft,
  FileText,
  Loader2,
} from "lucide-react";

const API = "http://localhost:3000";

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API}/productById/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load blog");
        setProduct(data);
      } catch (err) {
        setError(err?.message || "Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-300 to-base-300/80">
        <Navbar />
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-14 h-14 text-primary animate-spin" />
          <p className="text-base-content/70 font-body">Loading blog…</p>
          <progress className="progress progress-primary w-56" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-300/80">
        <Navbar />
        <div className="card bg-base-100 shadow-2xl max-w-md mx-4 animate-scale-in">
          <div className="card-body items-center text-center">
            <p className="text-error font-medium">{error || "Blog not found."}</p>
            <button
              className="btn btn-primary gap-2 mt-4"
              onClick={() => navigate("/GenteratedProduct")}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const blogTitle = product.title;
  const blogContent = product.blog_post || product.description || "No content yet.";
  const keywords = product.SEO || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-300 to-primary/5 text-base-content">
      <Navbar />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden animate-scale-in">
          {product.image && (
            <figure className="w-full bg-base-200/80">
              <img
                src={product.image}
                alt={blogTitle}
                className="w-full h-56 sm:h-72 object-contain"
              />
            </figure>
          )}
          <div className="card-body p-6 sm:p-10 md:p-12">
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-outline gap-1">
                  <Package className="w-3 h-3" />
                  {product.category}
                </span>
                <span className="badge badge-primary gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${product.price}
                </span>
                {product.rating?.rate != null && (
                  <span className="badge badge-ghost gap-1">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    {product.rating.rate}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-base-content mb-6">
                {blogTitle}
              </h1>

              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag className="w-4 h-4 text-base-content/50 shrink-0" />
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="badge badge-ghost badge-sm border border-base-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="blog-content font-body text-base sm:text-lg text-base-content/85 leading-relaxed max-w-[65ch]">
              {blogContent.split(/\n\n+/).filter(Boolean).length > 1
                ? blogContent.split(/\n\n+/).map((paragraph, i) => (
                    <p key={i} className="mb-5 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  ))
                : <p className="whitespace-pre-wrap">{blogContent}</p>
              }
            </div>

            <footer className="mt-10 pt-6 border-t border-base-300 flex flex-wrap gap-3">
              <button
                className="btn btn-outline btn-sm gap-2 transition-smooth"
                onClick={() => navigate("/GenteratedProduct")}
              >
                <Package className="w-4 h-4" />
                New Product
              </button>
              <button
                className="btn btn-ghost btn-sm gap-2"
                onClick={() => navigate("/seo/generate-blog/" + id)}
              >
                <RefreshCw className="w-4 h-4" />
                Edit / Regenerate
              </button>
              <button
                className="btn btn-ghost btn-sm gap-2"
                onClick={() => navigate("/")}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
