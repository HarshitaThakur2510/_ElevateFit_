import React, { useEffect, useState } from "react";

/**
 * Full React conversion of shopping.html
 * - Uses same Tailwind classes & inline styles as original
 * - Uses same localStorage key: elevatefit_cart_v1
 * - Checkout redirects to payment.html (unchanged)
 */

const CART_KEY = "elevatefit_cart_v1";

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Shopping() {
  // products: replicate the supplements you provided + placeholder products for Apparel/Footwear/Equipment
  const initialProducts = [
    // Supplements (from your HTML)
    {
      id: "p1",
      name: "Biozyme Performance Whey 4.4 lb Rich Chocolate",
      price: 5499,
      img: "shopping_images/MuscleBlaze Biozyme Performance Whey.png",
      category: "supplements",
      discount: "12% OFF",
    },
    {
      id: "p2",
      name: "Biozyme Whey PR 4.4 lb Chocolate Fudge",
      price: 6299,
      img: "shopping_images/Biozyme Whey PR 4.4 lb Chocolate Fudge.png",
      category: "supplements",
      discount: "10% OFF",
    },
    {
      id: "p3",
      name: "Biozyme Iso-Zero 4.4 lb Low Carb Ice Cream Chocolate",
      price: 8199,
      img: "shopping_images/Biozyme Iso-Zero 4.4 lb Low Carb Ice Cream Chocolate.png",
      category: "supplements",
      discount: "13% OFF",
    },
    {
      id: "p4",
      name: "Biozyme Gold 100% Whey 4.4 lb Double Rich Chocolate",
      price: 6899,
      img: "shopping_images/Biozyme Performance why 4.4lb rich chocolate.png",
      category: "supplements",
      discount: "14% OFF",
    },
    {
      id: "p5",
      name: "Biozyme Performance Whey 8.8 lb Chocolate Hazelnut",
      price: 10799,
      img: "shopping_images/Biozyme Iso-Zero 4.4 lb Low Carb Ice Cream Chocolate.png",
      category: "supplements",
      discount: "10% OFF",
    },

    // Apparel (placeholders — visually identical; you can replace images/text later)
    {
      id: "a1",
      name: "ElevateFit Performance Tee - Black",
      price: 899,
      img: "shopping_images/apparel-tee-black.png",
      category: "apparel",
      discount: "5% OFF",
    },
    {
      id: "a2",
      name: "ElevateFit Training Shorts - Grey",
      price: 799,
      img: "shopping_images/apparel-shorts-grey.png",
      category: "apparel",
      discount: "8% OFF",
    },

    // Footwear (placeholders)
    {
      id: "f1",
      name: "ElevateFit Training Shoes - White",
      price: 3499,
      img: "shopping_images/footwear-white.png",
      category: "footwear",
      discount: "7% OFF",
    },

    // Equipment (placeholders)
    {
      id: "e1",
      name: "ElevateFit Adjustable Dumbbell (Single)",
      price: 2999,
      img: "shopping_images/equipment-dumbbell.png",
      category: "equipment",
      discount: "10% OFF",
    },
  ];

  // state
  const [products] = useState(initialProducts); // static list for now
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // load cart from localStorage on mount
  useEffect(() => {
    console.log("React: Shopping page mounted");
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        setCart(JSON.parse(raw));
      } catch (e) {
        console.error("Cart parse error", e);
        setCart([]);
      }
    }
  }, []);

  // sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // update cart badge in DOM (to keep parity with non-React header if present)
  useEffect(() => {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = count;
  }, [cart]);

  // toast auto-clear
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // helpers
  function findProductById(id) {
    return products.find((p) => p.id === id);
  }

  function addToCart(product, qty = 1) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.name === product.name);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { id: Date.now() + Math.random(), name: product.name, price: product.price, qty }];
    });
    setToast(`${product.name} added to cart (x${qty})`);
  }

  function increaseQty(index) {
    setCart((prev) => {
      const copy = [...prev];
      copy[index].qty++;
      return copy;
    });
  }

  function decreaseQty(index) {
    setCart((prev) => {
      const copy = [...prev];
      if (copy[index].qty > 1) {
        copy[index].qty--;
      } else {
        copy.splice(index, 1);
      }
      return copy;
    });
  }

  function removeItem(index) {
    setCart((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }

  function clearCart() {
    setCart([]);
    setToast("Cart cleared");
  }

  function openCart() {
    setIsCartOpen(true);
  }
  function closeCart() {
    setIsCartOpen(false);
  }

  function buyNow(product) {
    // add item then open cart
    addToCart(product, 1);
    setIsCartOpen(true);
  }

  function checkout() {
    if (cart.length === 0) {
      setToast("Your cart is empty");
      return;
    }
    // keep cart in localStorage (already synced), redirect to payment.html
    window.location.href = "payment.html";
  }

  // totals
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // wishlist: shows products by category on tab
  const [activeCategory, setActiveCategory] = useState("supplements");

  // render helpers
  function renderProductCard(p) {
    return (
      <div
        key={p.id}
        className="product-card bg-gray-800 rounded-lg overflow-hidden flex flex-col"
        data-product-name={p.name}
        data-product-price={p.price}
      >
        <img src={p.img} alt={p.name} className="w-full h-56 object-cover" />
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 flex-grow">{p.name}</h3>
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-bold text-orange-500">₹{formatNumber(p.price)}</p>
            <span className="text-sm text-green-400">{p.discount}</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => addToCart(p, 1)}
              className="btn-secondary w-full py-2 rounded-md font-semibold"
            >
              Add to Cart
            </button>
            <button
              onClick={() => buyNow(p)}
              className="buy-now btn-primary w-full py-2 rounded-md font-bold"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // categories listing (same display as original)
  const categories = [
    { key: "supplements", title: "Supplements", icon: "fas fa-pills" },
    { key: "apparel", title: "Apparel", icon: "fas fa-tshirt" },
    { key: "footwear", title: "Footwear", icon: "fas fa-shoe-prints" },
    { key: "equipment", title: "Equipment", icon: "fas fa-weight-hanging" },
  ];

  return (
    <div className="antialiased">
      {/* Header (keeps same HTML structure) */}
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-white">
            <i className="fas fa-dumbbell text-orange-500"></i> ElevateFit
          </a>

          <div className="hidden md:flex space-x-8 items-center">
            <a onClick={() => setActiveCategory("supplements")} className="text-gray-300 hover:text-orange-500 transition cursor-pointer">Supplements</a>
            <a onClick={() => setActiveCategory("apparel")} className="text-gray-300 hover:text-orange-500 transition cursor-pointer">Apparel</a>
            <a onClick={() => setActiveCategory("footwear")} className="text-gray-300 hover:text-orange-500 transition cursor-pointer">Footwear</a>
            <a onClick={() => setActiveCategory("equipment")} className="text-gray-300 hover:text-orange-500 transition cursor-pointer">Equipment</a>
          </div>

          <div className="flex items-center space-x-4">
            <button id="cart-button" onClick={openCart} className="relative text-gray-300 hover:text-orange-500 transition" title="Cart">
              <i className="fas fa-shopping-cart fa-lg"></i>
              <span id="cart-count" className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((s,i) => s + i.qty, 0)}
              </span>
            </button>

            <button className="md:hidden text-white">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-section h-[70vh] flex items-center justify-center text-center" style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=2670&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">Unleash Your Potential</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">Premium supplements and elite gear designed to fuel your fitness journey. Elevate your performance, starting today.</p>
            <button onClick={() => setActiveCategory("supplements")} className="btn-primary font-bold py-3 px-8 rounded-lg text-lg uppercase">Shop Now</button>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {categories.map((c) => (
                <div key={c.key} onClick={() => setActiveCategory(c.key)} className="category-card bg-gray-900 p-6 rounded-lg cursor-pointer">
                  <i className={`${c.icon} text-orange-500 text-4xl mb-4`}></i>
                  <h3 className="text-xl font-semibold">{c.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products grid - by category */}
        <section id={activeCategory} className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="section-title text-3xl text-center mb-12">{activeCategory === "supplements" ? "Featured Supplements" : activeCategory === "apparel" ? "Apparel" : activeCategory === "footwear" ? "Footwear" : "Equipment"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {products.filter(p => p.category === activeCategory).map(renderProductCard)}
            </div>
          </div>
        </section>

        {/* Placeholder for other sections if any (keeps page length) */}
      </main>

      {/* Cart Modal */}
      <div id="cart-modal" className={`fixed inset-0 z-60 ${isCartOpen ? "flex" : "hidden"} items-center justify-center bg-black/50 p-4`}>
        <div className="bg-gray-900 w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Your Cart</h3>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400" id="cart-items-count">{cart.reduce((s,i) => s + i.qty, 0)} items</div>
              <button id="close-cart" onClick={closeCart} className="text-gray-400 hover:text-white"><i className="fas fa-times"></i></button>
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto" id="cart-items-list">
            {cart.length === 0 ? (
              <div className="text-gray-400 text-center py-8">Your cart is empty.</div>
            ) : cart.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-700">
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-400">₹{formatNumber(item.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => decreaseQty(idx)} className="decrease text-gray-300 px-2 py-1 rounded bg-gray-800">-</button>
                  <div className="px-3 font-medium">{item.qty}</div>
                  <button onClick={() => increaseQty(idx)} className="increase text-gray-300 px-2 py-1 rounded bg-gray-800">+</button>
                  <button onClick={() => removeItem(idx)} className="remove text-red-500 ml-3" title="Remove"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-400">Subtotal</div>
              <div className="text-xl font-bold text-orange-500" id="cart-subtotal">₹{formatNumber(subtotal)}</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { clearCart(); }} id="clear-cart" className="btn-secondary w-full py-2 rounded-md font-semibold">Clear Cart</button>
              <button onClick={checkout} id="checkout" className="btn-primary w-full py-2 rounded-md font-bold">Checkout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (keeps same structure) */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <a href="#" className="text-2xl font-bold text-white">
                <i className="fas fa-dumbbell text-orange-500"></i> ElevateFit
              </a>
              <p className="text-sm text-gray-400 mt-2">Elevating your fitness journey.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><i className="fab fa-facebook-f fa-lg"></i></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><i className="fab fa-youtube fa-lg"></i></a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            &copy; 2025 ElevateFit. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

