// client/src/components/ProductDetailModal.jsx
import React from "react";

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null; // Jangan render jika tidak ada produk

  return (
    // Overlay modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* Konten modal */}
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times; {/* Simbol 'x' */}
        </button>

        {/* Tata Letak Gambar dan Detail Deskripsi */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex justify-center items-center">
            <img
              src={product.imgProduk}
              alt={product.namaProduk}
              className="max-w-full h-auto rounded-md object-contain max-h-80" /* Gambar di modal */
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.namaProduk}
            </h2>
            <p className="text-3xl font-extrabold text-blue-700 mb-4 mt-2">
              {product.hargaProduk}
            </p>
            {/* Hanya deskripsi yang ditampilkan di sini */}
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {product.deskripsiProduk}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
