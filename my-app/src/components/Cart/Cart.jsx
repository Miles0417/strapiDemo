import React, { useEffect, useState } from "react";
import "./Cart.scss";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useSelector } from "react-redux";
import { removeItem, resetCart } from "../../redux/cartReducer";
import { useDispatch } from "react-redux";
import { makeRequest } from "../../makeRequest";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const [price, setPrice] = useState();
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();

  const totalPrice = () => {
    let total = 0;
    products.forEach((item) => {
      // setPrice(total += item.quantity * item.price)
      total += item.quantity * item.price;
    });
    return total.toFixed(2);
  };

  // useEffect(() => {
  //   totalPrice()
  // }, [price])
  const loadingStripe = async (loadStripe) => {
    try {
      const stripePromise = await loadStripe(
        "pk_test_51MO9V9JmTVjhXnqYYHhPnlcJLHBdD5ttwsEmfTHn2TsmJ1a7MPlCNtUWmQIlbMbMnsejxTKgbAe3ehMRiu31LXl600GvWhbUS3"
      );
      return stripePromise;
    } catch (error) {
      console.log(error);
    }
  };

  const stripePromise = loadingStripe(loadStripe);

  const handlePayment = async (products, stripePromise) => {
    console.log(products, "PRODUCTS");
    try {
      if (products.length === 0 || !products) {
        throw new Error("No product in the cart");
      }
      const stripe = await stripePromise;
      const res = await makeRequest.post("/api/checkout-session", {
        products,
      });

      return await stripe.redirectToCheckout({
        sessionId: await res.data.id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cart">
      <h1>Products in your cart</h1>
      {products?.map((item) => (
        <div className="item" key={item.id}>
          <img src={`${process.env.REACT_APP_API_URL}${item.img}`} alt="" />
          <div className="details">
            <h1>{item.title}</h1>
            <p>
              {item.desc?.substring(0, 45)}
              <span>...</span>
            </p>
            <div className="price">
              {item.quantity} x ${item.price}
            </div>
          </div>
          <DeleteOutlinedIcon
            className="delete"
            onClick={() => dispatch(removeItem(item.id))}
          />
        </div>
      ))}
      <div className="total">
        <span>SUBTOTAL</span>
        <span>
          ${totalPrice()}
          {/* {price} */}
        </span>
      </div>
      <button
        onClick={async () => await handlePayment(products, stripePromise)}
        // onClick={() => {
        //   // Send a post request to the Strapi route
        //   axios.post('/stripe/pay', {
        //     products
        //   })
        //     .then((response) => {
        //       // Your code to handle the response
        //     })
        //     .catch((error) => {
        //       // Your code to handle the error
        //     });
        // }}
      >
        PROCEED TO CHECKOUT
      </button>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  );
};

export default Cart;
