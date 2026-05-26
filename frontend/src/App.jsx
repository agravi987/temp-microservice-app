import { useEffect, useState } from "react";
import "./App.css";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Loading");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${apiBaseUrl}/products`);
        const data = await response.json();
        setProducts(data);
        setStatus("Connected");
      } catch (error) {
        setStatus("Gateway not running yet");
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="app-shell">
      <section className="toolbar">
        <div>
          <p className="eyebrow">Microservices Project</p>
          <h1>DevOps Store</h1>
        </div>
        <span className="status">{status}</span>
      </section>

      <section className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <h2>{product.name}</h2>
            <p>Price: Rs. {product.price}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
