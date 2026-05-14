import { useState, useEffect } from "react";
import { getProducts, deleteProduct, placeOrder } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} added to cart! 🛒`);
  };

 const handlePlaceOrder = async () => {
  try {
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity
    }));
    const res = await placeOrder(orderItems);
    alert("Order placed successfully! 🎉");
    setCart([]);
  } catch (err) {
    console.error("Order error:", err.response?.data);
    alert("Error: " + JSON.stringify(err.response?.data));
  }
};

  // ✅ Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🛍️ E-Commerce Store</h1>
        <div>
          <span>Welcome, {username}! </span>
          <span style={{ marginLeft: "10px", background: "orange", padding: "5px 10px", borderRadius: "4px" }}>
            🛒 Cart: {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
          <button
            onClick={handleLogout}
            style={{ marginLeft: "10px", padding: "8px 16px", background: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Products Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px" }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p style={{ color: "green", fontWeight: "bold", fontSize: "18px" }}>₹{product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category}</p>
            <button
              onClick={() => addToCart(product)}
              style={{ width: "100%", padding: "8px", background: "blue", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "8px" }}
            >
              Add to Cart 🛒
            </button>
            {role === "Admin" && (
              <button
                onClick={() => handleDelete(product.id)}
                style={{ width: "100%", padding: "8px", background: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Delete ❌
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div style={{ marginTop: "30px", border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
          <h2>🛒 Your Cart</h2>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span style={{ color: "green" }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <span>Total:</span>
            <span style={{ color: "green" }}>₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            style={{ width: "100%", padding: "10px", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}
          >
            Place Order 🚀
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;