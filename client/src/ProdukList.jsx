// client/src/ProdukList.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";

function ProdukList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ganti URL ini dengan URL API backend scraping Anda
        const response = await fetch("http://localhost:3001/scrape");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Pastikan setiap produk memiliki ID unik
        const productsWithId = data.map((item, index) => ({
          id: item.id || `prod-${index}`, // fallback ID jika backend tidak menyediakan
          ...item,
        }));
        setProducts(productsWithId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return <div className="text-center p-8 text-xl">Memuat data produk...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 text-xl">
        Error: {error}. Pastikan server backend Anda berjalan.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Produk</h1>

      {/* Grid untuk menampilkan produk.
          Anda bisa sesuaikan jumlah kolom di sini (misal: xl:grid-cols-5 jika ingin 5 kolom)
          Sesuai contoh gambar Anda yang menampilkan 3 kolom, saya pertahankan xl:grid-cols-3
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default ProdukList;
