import React, { useState, useEffect } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [accept, setAccept] = useState(0);
  const [reject, setReject] = useState(0);
  const [request, setRequest] = useState(0);
  const navigate = useNavigate();

  const logOut = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Successfully logout", {
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log("error while loggin out", error);
    }
  };

  const countsRequests = async(token) => {
    try {
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const {id, role} = decodedToken;

        const response = await fetch(`${process.env.REACT_APP_API_PRODUCT}/requests/user/count/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({role: role})
        });
        const data = await response.json();
        if(data) {
          setRequest(data.request)
          setAccept(data.countAccept)
          setReject(data.countReject)
        }
      }
    } catch (error) {
      console.log("error while getting user role", error);
    }
    return null;
  }

  const productsList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_PRODUCT}/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      if (data.list && data.list.length > 0) {
        setProducts(data.list);
      } else {
        setProducts([]);
      }
      await countsRequests(token)
    } catch (error) {
      console.log("error", error);
    }
  };

  const getUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.role;
      }
    } catch (error) {
      console.log("error while getting user role", error);
    }
    return null;
  };

  useEffect(() => {
    productsList();
  }, []);

  return (
    <div className="relative">
      <h1></h1>
      <div className="flex flex-row-reverse mt-2">
      {getUserRole() === "admin" ? (
          <Link to="/product/pending-review" className="top-5 mx-10 bg-yellow-600 text-white px-4 py-2 rounded shadow-lg">
            Pending Reviews
          </Link>
        ) : (
          <Link to="/product/review" className="top-5 mx-10 bg-blue-600 text-white px-4 py-2 rounded shadow-lg">
            Reviews
          </Link>
        )}
        <button
          className="top-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg"
          onClick={logOut}
        >
          Logout
        </button>
      </div>

      <div className="overflow-y-auto pt-10 mx-auto w-11/12">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12}>No products found.</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {products.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  <Link to={`/product/${row._id}`} className="no-underline">
                    <TableCell>{row.productName}</TableCell>
                  </Link>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>INR.{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex flex-row mt-2 justify-end">
          <span className="bg-blue-600 text-white mr-4 px-4 py-2 rounded shadow-lg">
            No. of request : {request}
          </span>
          <span className="bg-blue-600 text-white mr-4 px-4 py-2 rounded shadow-lg">
            No. of approved request : {accept}
          </span>
          <span className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg">
            No. of reject request : {reject}
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default ProductList;
