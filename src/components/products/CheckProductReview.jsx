import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckProductReview= () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [originalProduct, setOriginalProduct] = useState({});
  const [changedFields, setChangedFields] = useState({});

  const fetchOriginalProductById = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API_PRODUCT}/products/review/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        if (data.list && data.list.length > 0) {
          setOriginalProduct(data.list[0]);
        } else {
          setProduct([]);
        }
      } catch (error) {
        console.log("Error fetching product:", error);
      }
    };

  useEffect(() => {
    const fetchProductById = async (reviewId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API_PRODUCT}/reviews/${reviewId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        if (data.list && data.list.length > 0) {
          setProduct(data.list[0]);
          fetchOriginalProductById(data.list[0].productId)
        } else {
          setProduct([]);
        }
      } catch (error) {
        console.log("Error fetching product:", error);
      }
    };

    
    fetchProductById(productId);
  }, [productId]);


  return (
    <div>
      <div className="flex md:flex-row p-10">
        <div className="md:w-1/2 flex flex-col items-center space-y-4">
          <div className="border w-64 h-64 flex items-center justify-center text-gray-500">
            <img src={product.image} alt={product.image}/>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col space-y-4 pl-10">
          <input
            type="text"
            placeholder="Product Name"
            className="py-2 px-4 w-full border border-gray-300"
            value={product.productName || ''}
            onChange={(e) => setProduct({...product, productName: e.target.value})}
            disabled
          />
          <textarea
            placeholder="Product Description"
            className="py-2 px-4 w-full border border-gray-300"
            rows="4"
            value={product.productDescription || ''}
            onChange={(e) => setProduct({ ...product, productDescription: e.target.value })}
            disabled
          ></textarea>
          <input
            type="text"
            placeholder="Product Price"
            className="py-2 px-4 w-full border border-gray-300"
            value={product.price || ''}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            disabled
          />
        </div>
      </div>
        <div className="flex justify-center mt-[10rem]">
          <Link
            to={`/product/pending-review`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </Link>
        </div>
    </div>
  );
};

export default CheckProductReview;
