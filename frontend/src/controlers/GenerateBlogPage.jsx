import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import {
  Database,
  Loader2,
  FileText,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Star,
  Tag,
  Hash,
} from "lucide-react";

const API = "http://localhost:3000";

export default function GenerateBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/productById/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load");
        setProduct(data);
      } catch (err) {
        setError(err?.message || "Failed to load product from DB.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleGenerateBlog = async () => {
    setError("");
    setGenerating(true);
    try {
      const res = await fetch(`${API}/script/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Failed to generate blog");
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err?.message || "Failed to generate blog.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-300 to-base-300/80">
        <Navbar />
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-14 h-14 text-primary animate-spin" />
          <p className="text-base-content/70 font-body">Loading data from DB…</p>
          <progress className="progress progress-primary w-56" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-300/80">
        <Navbar />
        <div className="card bg-base-100 shadow-2xl max-w-md mx-4 animate-scale-in">
          <div className="card-body items-center text-center">
            <p className="text-error font-medium">{error}</p>
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

  if (!product) return null;

  const rating = product.rating;
  const rate = typeof rating === "object" ? rating?.rate : rating;
  const count = typeof rating === "object" ? rating?.count : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-300 to-primary/5 px-4 sm:px-6 py-8 text-base-content">
      <Navbar />

      <div className="max-w-3xl mx-auto mb-8 text-center animate-fade-in">
      
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2 text-base-content mt-5">
          Generate Blog
        </h1>
      
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-6 alert alert-error shadow-lg animate-scale-in">
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto card bg-base-100 shadow-2xl border border-base-300 overflow-hidden mb-8 animate-slide-up">
        <div className="card-body p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2 text-base-content">
            <Database className="w-5 h-5 text-primary" />
            Cart
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-xl bg-base-200 shrink-0"
              />
            )}
            <div className="flex-1 grid gap-3 text-left font-body text-sm">
              <p className="flex items-start gap-2 flex-wrap">
              
              
              </p>
              <p className="flex items-center gap-2">
              
              </p>
              <p className="flex items-center gap-2">
                <span className="text-base-content/60">Product:</span>
                <span className="font-medium">{product.title}</span>
              </p>
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-base-content/50" />
                <span className="text-base-content/60">price:</span>
                <span className="text-primary font-semibold">${product.price}</span>
              </p>
              <p className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-base-content/50" />
                <span className="text-base-content/60">category:</span>
                <span>{product.category}</span>
              </p>
              <p className="flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" />
                <span className="text-base-content/60">rating:</span>
                <span>{rate != null ? `${rate}` : "—"} {count != null ? `(${count} reviews)` : ""}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-base-content/60 shrink-0">Details:</span>
                <span className="text-base-content/80 line-clamp-2">{product.description || "—"}</span>
              </p>
              {product.SEO?.length > 0 && (
                <p className="flex items-start gap-2 flex-wrap">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-base-content/60 shrink-0">SEO:</span>
                  <span className="text-primary/90">{product.SEO.join(", ")}</span>
                </p>
              )}
        
            </div>
          </div>

          <div className="divider my-2" />

          <div className="flex flex-wrap gap-3">
            <button
              className="btn btn-ghost gap-2"
              onClick={() => navigate("/seo", { state: { productId: id } })}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to SEO
            </button>
            <button
              className="btn btn-primary gap-2 transition-smooth hover:shadow-lg"
              onClick={handleGenerateBlog}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating blog…
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Blog
                </>
              )}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
