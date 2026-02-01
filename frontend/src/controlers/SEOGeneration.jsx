import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import {
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Loader2,
  Tag,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

const API = "https://seo-blog-post-creation-tool-dackend.onrender.com";

export default function SEOGeneration() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [storedProduct, setStoredProduct] = useState(state?.storedProduct || null);
  const [error, setError] = useState("");

  // When arriving from "Back to SEO" (GenerateBlogPage), fetch product by id
  useEffect(() => {
    const productIdFromState = state?.productId;
    const storedFromState = state?.storedProduct;
    if (productIdFromState && !storedFromState) {
      setLoadingProduct(true);
      setError("");
      fetch(`${API}/productById/${productIdFromState}`)
        .then((res) => res.json())
        .then((data) => {
          if (data._id && !data.error) {
            setStoredProduct(data);
          } else {
            setError(data?.message || data?.error || "Failed to load product");
          }
        })
        .catch((err) => setError(err?.message || "Failed to load product"))
        .finally(() => setLoadingProduct(false));
    } else if (storedFromState) {
      setStoredProduct(storedFromState);
    }
  }, [state?.productId, state?.storedProduct]);

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-300 to-base-300/80">
        <Navbar />
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-14 h-14 text-primary animate-spin" />
          <p className="text-base-content/70 font-body">Loading product…</p>
          <progress className="progress progress-primary w-56" />
        </div>
      </div>
    );
  }

  if (!storedProduct || !storedProduct._id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-300 to-base-300/80">
        <Navbar />
        <div className="card bg-base-100 shadow-2xl max-w-md mx-4 animate-scale-in">
          <div className="card-body items-center text-center">
            <div className="rounded-full bg-error/10 p-4 mb-4">
              <AlertTriangle className="w-12 h-12 text-error" />
            </div>
            <h2 className="card-title text-xl">No product selected</h2>
            <p className="text-base-content/70">Choose a product from the list first.</p>
            <button
              className="btn btn-primary gap-2 mt-4"
              onClick={() => navigate("/GenteratedProduct")}
            >
              Choose Product
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const product = storedProduct;
  const mongoId = product._id;
  const productId = product.id;

  const handleGenerateKeywords = async () => {
    setError("");
    setLoadingKeywords(true);
    try {
      const res = await fetch(`${API}/SEOWord`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: product.title, _id: product._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Failed");
      setKeywords(data.SEO || data || []);
    } catch (err) {
      setError(err?.message || "Failed to generate keywords.");
    } finally {
      setLoadingKeywords(false);
    }
  };

  const handleGoToGenerateBlog = () => {
    navigate(`/seo/generate-blog/${mongoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-300 to-primary/5 px-4 sm:px-6 py-8 text-base-content">
      <Navbar />

 

      <div className="max-w-3xl mx-auto mb-10 text-center animate-slide-up">
      
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2 text-base-content mt-8">
          Generate SEO Keywords
        </h1>
      
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-6 alert alert-error shadow-lg animate-scale-in">
          <span>{error}</span>
        </div>
      )}

      {/* Product card */}
      <div className="max-w-3xl mx-auto card bg-base-100 shadow-2xl border border-base-300 overflow-hidden mb-8 animate-slide-up stagger-1">
        <div className="card-body sm:card-side gap-6 p-6 sm:p-8">
          <figure className="shrink-0">
            <img
              src={product.image}
              alt={product.title}
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-xl bg-base-200"
            />
          </figure>
          <div className="flex-1 space-y-3">
            <h2 className="font-display text-2xl font-bold text-base-content">
              {product.title}
            </h2>
            <p className="text-base-content/60 line-clamp-3 font-body">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="badge badge-outline">{product.category}</span>
              <span className="font-bold text-primary">${product.price}</span>
              <span className="text-base-content/60 text-sm flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-warning" />
                {product.rating?.rate ?? product.rating ?? "—"} ({product.rating?.count ?? 0})
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm gap-2 self-start -ml-2"
              onClick={() => navigate("/GenteratedProduct")}
            >
              <RefreshCw className="w-4 h-4" />
              Change Product
            </button>
          </div>
        </div>
      </div>

      {/* SEO Keywords section */}
      <div className="max-w-3xl mx-auto card bg-base-100 shadow-xl border border-base-300 p-6 sm:p-8 mb-8 animate-slide-up stagger-2">
        <h3 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Generate SEO Keywords
        </h3>
    
        <button
          className="btn btn-primary gap-2 transition-smooth hover:shadow-lg mt-5"
          onClick={handleGenerateKeywords}
          disabled={loadingKeywords}
        >
          {loadingKeywords ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Tag className="w-4 h-4" />
              Generate SEO Keywords
            </>
          )}
        </button>
        {keywords.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-2">
              {keywords.map((word, i) => (
                <span
                  key={i}
                  className="badge badge-lg badge-primary/20 text-primary border border-primary/30 gap-1 transition-smooth hover:badge-primary hover:text-primary-content"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {word}
                </span>
              ))}
            </div>
            <button
              className="btn btn-primary btn-wide gap-2 transition-smooth hover:gap-3"
              onClick={handleGoToGenerateBlog}
            >
              Next: Generate Blog
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
