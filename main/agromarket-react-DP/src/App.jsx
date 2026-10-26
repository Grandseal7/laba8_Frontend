
import { useState, useEffect } from "react";
import "./App.css";

import ProductCard from "./components/ProductCard";
import LoginForm from "./components/LoginForm.jsx";
import AddProductForm from "./components/AddProductForm.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";
import { apiFetch } from "./api.js";

function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  function handleLogin(user, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await apiFetch("/products");
        setProducts(Array.isArray(result) ? result : result.products ?? []);
      } catch (error) {
        console.error("Не удалось загрузить товары:", error);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    apiFetch("/auth/me")
      .then((currentUser) => {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      })
      .catch(() => {});
  }, []);

  const handleAddToCart = () => {
    setCartCount((count) => count + 1);
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="catalog">
        <div className="auth-bar">
          {user ? (
            <>
              <span>
                Вы вошли как <b>{user.name}</b> ({user.role})
              </span>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
        </div>

        <Header />

        <main className="page">
          {user?.role === "admin" && (
            <AddProductForm
              onAdded={(product) =>
                setProducts((current) => [...current, product])
              }
            />
          )}

          <section id="catalog" className="catalog">
            <div className="catalog-toolbar">
              <h2>Каталог</h2>
              <p>Товаров в корзине: {cartCount}</p>
              <input
                type="search"
                placeholder="Поиск товара..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  onAdd={handleAddToCart}
                  key={product.id}
                  product={product}
                  featured={String(product.id) === "1"}
                />
              ))}
            </div>
          </section>

          <aside id="delivery" className="sidebar">
            <h3>Доставка</h3>
            <ul>
              <li>Астана — на следующий день</li>
              <li>Акмолинская область — 2–3 дня</li>
              <li>Бесплатно от 20 000 тг</li>
            </ul>
          </aside>

          <section id="contact">
            <ContactForm />
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default App;
