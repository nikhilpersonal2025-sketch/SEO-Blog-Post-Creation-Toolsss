import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { Package, Search, Star, Loader2, ArrowRight, ShoppingBag } from "lucide-react";

const API = "http://localhost:3000";

export default function GenteratedProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storingId, setStoringId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelectProduct = async (product) => {
    setError("");
    setStoringId(product.id);
    try {
      const payload = {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating,
        id: product.id,
      };
      const res = await fetch(`${API}/storeProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to store product");
      navigate("/seo", { state: { storedProduct: data } });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to save product.");
    } finally {
      setStoringId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-300 to-base-300/80">
        <Navbar />
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <Loader2 className="w-14 h-14 text-primary animate-spin" />
          <p className="text-lg text-base-content/70 font-body">Loading products...</p>
          <progress className="progress progress-primary w-56" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-300 to-primary/5 text-base-content px-4 sm:px-6 py-8">
      <Navbar />

      <div className="max-w-4xl mx-auto mb-12 text-center animate-fade-in">
   
       
        <p className="text-base-content/70 font-body max-w-2xl mx-auto mt-8 text-xl">
          Select a product and, then generate SEO keywords and blogs.
        </p>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 alert alert-error shadow-lg animate-scale-in">
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="card bg-base-100 shadow-xl card-hover overflow-hidden border border-base-300 opacity-0 animate-slide-up"
            style={{
              animationFillMode: "forwards",
              animationDelay: `${i * 0.07}s`,
            }}
          >
            <figure className="p-6 bg-base-200/50">
              <img
                src={product.image}
                alt={product.title}
                className="h-48 object-contain transition-transform duration-300 hover:scale-105"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title text-lg font-display line-clamp-2 text-base-content">
                {product.title}
              </h2>

              <p className="text-sm text-base-content/60 line-clamp-3 font-body">
                {product.description}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="badge badge-outline badge-sm gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  {product.category}
                </span>
                <span className="font-bold text-primary text-lg">
                  ${product.price}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-base-content/60">
                <div className="rating rating-sm">
                  {[...Array(5)].map((_, j) => (
                    <input
                      key={j}
                      type="radio"
                      className="mask mask-star-2 bg-warning"
                      checked={j < Math.round(product.rating?.rate ?? 0)}
                      readOnly
                    />
                  ))}
                </div>
                <span className="text-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  ({product.rating?.count ?? 0})
                </span>
              </div>

              <div className="card-actions mt-5">
                <button
                  className="btn btn-primary btn-block gap-2 transition-smooth hover:gap-3"
                  onClick={() => handleSelectProduct(product)}
                  disabled={storingId === product.id}
                >
                  {storingId === product.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Select & Generate SEO
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
