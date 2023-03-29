import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Product/Product.scss";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { API_URL } from "../../constant";

export const Product = () => {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState();
  const [products, setProducts] = useState();
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}?populate=*`);
      const response = await axios.get(`${API_URL}/api/products/?populate=*`);
      setProduct(res?.data?.data);
      setProducts(response?.data?.data);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [window.location.href]);

  return (
    <div className="container">
      {product && (
        <div className="product">
          <div className="product-image">
            <img
              className="img"
              src={`${API_URL}${product?.attributes?.image?.data?.attributes?.formats?.medium?.url}`}
            />
          </div>
          <div className="product-info">
            <h2 className="title">{product?.attributes?.title}</h2>
            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev === 1 ? 1 : prev - 1))
                }
              >
                -
              </button>
              {quantity}
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>
            <p className="description">{product?.attributes?.description}</p>
            <span>
              <b className="price"> $ {product?.attributes?.price}</b>
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      id: product?.id,
                      title: product?.attributes?.title,
                      desc: product?.attributes?.description,
                      price: product?.attributes?.price,
                      img: product?.attributes?.image?.data?.attributes?.formats
                        ?.thumbnail?.url,
                      quantity,
                    })
                  )
                }
                className="button"
              >
                <AddShoppingCartIcon className="shopping-cart" />
                <p className="shopping-cart-text">add to shopping cart</p>
              </button>
            </span>
          </div>
        </div>
      )}
      <div className="suggested">
        <h3>You might also like ...</h3>
        {products &&
          products.map((prod, index) => {
            return (
              <div key={index} className="suggested-product">
                <Link
                  className="prodLink"
                  key={prod.id}
                  to={`/photography-prints/${prod.id}`}
                >
                  <div className="product-information" key={prod.id}>
                    <div className="product-image-container">
                      <img
                        className="product-image"
                        src={`${API_URL}${prod?.attributes?.image?.data?.attributes?.formats?.medium?.url}`}
                      />
                    </div>
                    <h3 className="prodTitle">{prod?.attributes?.title}</h3>
                    <p className="prodTitle">{prod?.attributes?.description}</p>
                    <p>${prod?.attributes?.price} EUR</p>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};
