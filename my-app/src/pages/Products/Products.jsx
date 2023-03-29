import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Products/Products.scss";
import { API_URL } from "../../constant";

export const Products = () => {
  const [products, setProduct] = useState();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products?populate=*`);
      setProduct(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="products">
      {products?.map((product) => {
        return (
          <Link
            className="prodLink"
            key={product?.id}
            to={`/photography-prints/${product?.id}`}
          >
            <div className="product-info" key={product?.id}>
              <div className="product-image-container">
                <img
                  className="product-image"
                  src={`${API_URL}${product?.attributes?.image?.data?.attributes?.formats.medium.url}`}
                />
              </div>
              <h4 className="prodTitle">{product?.attributes?.title}</h4>
              <p className="prodTitle">{product?.attributes?.description}</p>
              <p>${product?.attributes?.price} EUR</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
