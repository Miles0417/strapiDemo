import axios from "axios";
import React, { useEffect, useState } from "react";
import { makeRequest } from "../../makeRequest";

import "../Order/Order.scss";

// const sdk = require('api')('@easyship/v2023.01#hatldcrss7o');

export const Order = () => {
  const [order, setOrder] = useState();
  const [shipment, setShipment] = useState();
  const [deliveryState, setDeliveryState] = useState();

  const testShippo = async () => {
    try {
      const res = await makeRequest.post("/stripe-update-hook");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const func = async (a) => {
    try {
      if (!a) {
        throw new Error("there's no a !");
      }
      console.log(a);
      return a;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1337/api/orders?populate[ordered_products][populate]=%2A"
      );
      console.log(res.data.data[0]);
      setOrder(res.data.data[0]);
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const getShipment = async (order) => {
    const options = {
      method: "GET",
      url: `https://api.easyship.com/2023-01/shipments/${order?.attributes?.easyShip_ID}`,
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer prod_9Upez/Wn/Z5NJeH5DD9dJU5Mt7u8/mRvAn7Wq7+CVHM=",
      },
    };
    try {
      const shipment = await (order && axios.request(options));
      // .then(({ data }) => console.log(data))
      // .catch(err => console.error(err));
      setShipment(shipment);
      // return setShipment(shipment)
    } catch (error) {
      console.log(error);
    }
  };

  const getDeliveryState = async (shipment) => {
    try {
      if (!shipment) {
        return;
      }
      setDeliveryState(shipment?.data?.shipment?.delivery_state);
      console.log(shipment?.data?.shipment?.delivery_state);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    getShipment(order);
  }, [order]);
  useEffect(() => {
    getDeliveryState(shipment);
  }, [shipment]);
  return (
    <div className="order">
      {order && (
        <div className="detail_wrapper">
          <h3>Order Info </h3>
          <div className="detail">
            <div className="product_detail">
              {order?.attributes?.ordered_products.map((prod) => {
                return (
                  <div key={prod.id} className="ordered_product">
                    <p className="ordered_product_name" key={prod.id}>
                      {prod.Product_name} :
                    </p>
                    <div className="ordered_product_detail">
                      <p className="product_price">${prod.unit_price}</p>
                      <p>X</p>
                      <p className="ordered_quantity">{prod.order_quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="shipping_detail">
              <div className="shipping_address">
                <p className="shipping_address_title">Shipping Address :</p>
                <p className="shipping_address_text">
                  {order?.attributes?.Shipping_address}
                </p>
              </div>
              <div className="shipment_tracking">
                <p className="shipment_tracking_title">Track Shipment :</p>
                <div className="tracking_action">
                  <button className="tracking_action_button">
                    <a
                      target="_blank"
                      href={`${order?.attributes?.shipment_tracking_link}`}
                    >
                      Track
                    </a>
                  </button>
                </div>
              </div>
              {deliveryState && (
                <div className="cancel_action">
                  {deliveryState === "not_created" && (
                    <button
                      // onClick={() => testShippo()}
                      onClick={() => func()}
                      className="cancel_action_button"
                    >
                      Cancel order
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
