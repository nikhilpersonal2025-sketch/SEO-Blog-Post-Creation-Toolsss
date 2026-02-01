import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./controlers/Home";
import GenteratedProduct from "./controlers/GenteratedProduct";
import SEOGeneration from "./controlers/SEOGeneration";
import BlogView from "./controlers/BlogView";
import GenerateBlogPage from "./controlers/GenerateBlogPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/GenteratedProduct" element={<GenteratedProduct />} />
        <Route path="/seo" element={<SEOGeneration />} />
        <Route path="/seo/generate-blog/:id" element={<GenerateBlogPage />} />
        <Route path="/blog/:id" element={<BlogView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
