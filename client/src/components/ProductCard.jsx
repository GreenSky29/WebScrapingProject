// client/src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product, onClick }) => {
  return (
    // Setiap kartu adalah area yang bisa diklik untuk melihat detail
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
      onClick={() => onClick(product)}
    >
      {/* Gambar Produk */}
      <div className="flex-shrink-0">
        <img
          src={product.imgProduk}
          alt={product.namaProduk}
          className="w-full h-64 object-contain" /* object-contain menjaga rasio aspek gambar */
        />
      </div>
      {/* Informasi Produk (Judul, Harga) */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.namaProduk}
          </h3>{" "}
          {/* line-clamp-2 memotong teks judul jika terlalu panjang */}
          <p className="text-blue-600 font-bold mt-1">{product.hargaProduk}</p>
          {/* Tidak ada rating, tidak ada status stock, tidak ada tombol "Add to basket" */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
