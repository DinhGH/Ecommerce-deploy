import { FaShippingFast } from "react-icons/fa";
import { TbTruckReturn } from "react-icons/tb";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 relative">
      {product.thumbnail && (
        <ProductImage src={product.thumbnail} alt={product.title} />
      )}

      <h3 className="font-semibold text-2xl">{product.title}</h3>

      <div className="flex items-center gap-2 mt-2 text-xl">
        <span className="font-bold text-red-600">
          $
          {(
            product.price *
            (1 - (product.discountPercentage || 0) / 100)
          ).toFixed(2)}
        </span>

        {product.discountPercentage && (
          <span className="text-gray-500 line-through">${product.price}</span>
        )}
      </div>
      <div className="flex justify-start text-gray-700 gap-2">
        {product.tags &&
          product.tags.map((item) => (
            <div key={item} className="border border-[#ababab77] py-0.4 px-2 ">
              {item}
            </div>
          ))}
      </div>

      {product.discountPercentage && (
        <p className="text-md text-gray-700 absolute rounded-md top-0 right-0 px-2 py-1 bg-[#cdcdcd]">
          -{product.discountPercentage}%
        </p>
      )}

      {product.brand ? (
        <p className="text-md text-gray-800 my-1 italic font-semibold">
          Brand: {product.brand}
        </p>
      ) : (
        <p className="text-md text-gray-600 my-1 truncate">
          {product.description}
        </p>
      )}

      {product.shippingInformation && (
        <p className="text-sm text-[#26AA99] flex">
          <FaShippingFast className="text-lg mr-2 " />{" "}
          <span> {product.shippingInformation}</span>
        </p>
      )}

      {product.returnPolicy && (
        <p className="text-sm text-[#139451] flex">
          <TbTruckReturn className="text-lg mr-2" />
          <span> {product.returnPolicy}</span>
        </p>
      )}

      <div className="flex items-center gap-1 mt-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill={index < Math.round(product.rating) ? "gold" : "lightgray"}
            viewBox="0 0 24 24"
            stroke="none"
            className="w-4 h-4"
          >
            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.858 1.416 8.392L12 19.771l-7.416 4.229L6 15.608 0 9.75l8.332-1.595z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-2">
          {product.rating.toFixed(1)}/5
        </span>
      </div>
    </div>
  );
}
