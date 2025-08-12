import React from "react";
import { useParams } from "react-router-dom";
import products from "../../assets/product.list.js";

const ViewProduct = () => {
  const { url } = useParams();
  const product = products.find((item) => item.url === url);

  if (!product) {
    return <p className="p-8 text-red-500">Product not found.</p>;
  }

  return (
    <div className="w-full p-8 overflow-y-auto">
      <div className="border shadow-md border-gray-200 p-6 rounded-2xl flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <img
            src={product.image_header}
            alt={product.name}
            className="w-12 h-12 rounded-md object-cover"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-black">
              {product.name}
            </h1>
            <p className="text-gray-500">{product.category}</p>
            <span
              className={`text-sm font-medium ${
                product.status === "In Stock"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Preview ${index + 1}`}
              className="w-28 h-28 rounded-md object-cover border border-gray-200"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Detail label="Price" value={`$${product.price}`} />
          <Detail label="Stock" value={product.stock} />
          <Detail label="Category" value={product.product_type} />
          <Detail label="Date Added" value={product.dateAdded} />
          <Detail label="Rating" value={`${product.rating} / 5`} />
          <Detail label="Reviews" value={`${product.review} reviews`} />
        </div>
        {product.tags?.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Product Description
          </h2>
          <p className="text-sm text-gray-600">{product.brief_description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Detail Description
          </h2>
          <p className="text-sm text-gray-600">{product.detail_description}</p>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="font-medium text-black">{value}</span>
  </div>
);

export default ViewProduct;
