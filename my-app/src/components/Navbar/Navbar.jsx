import React, { useState } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useLocation, useParams } from "react-router-dom";
import "./Navbar.scss";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState();
  const { id } = useParams();
  const location = useLocation();
  useEffect(() => {
    setPath(window.location.pathname);
  }, [location]);
  const products = useSelector((state) => state.cart.products);
  console.log(location);
  return (
    <div
      className={`navbar ${
        location.pathname === "/photography-prints"
          ? "photographs"
          : location.pathname === "/stories"
          ? "stories-nb"
          : location.pathname === `/photography-prints/${id}`
          ? "photograph"
          : ""
      }`}
    >
      <div className="wrapper">
        <div className="item">
          <Link className="link logo" to="/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 335 24">
              <title>Picture This</title>
              <g fill-rule="evenodd">
                <path d="M5.663 4.898v6.847h3.392c2.112 0 4.672-.064 4.672-3.551 0-3.296-2.848-3.296-4.48-3.296H5.663zM0 .738h9.087c3.712 0 7.008 0 8.992 2.848.863 1.279 1.279 3.104 1.279 4.639 0 1.248-.256 2.464-.768 3.52-1.951 4.032-6.111 4.128-9.183 4.192H5.663v7.391H0V.738zM32.616 5.6h5.631V.738h-5.631zM72.55 18.176c-.832 1.312-1.632 2.593-3.424 3.84-.96.672-3.168 1.984-6.304 1.984-5.983 0-10.815-4.351-10.815-11.999C52.007 5.314 56.551.034 62.95.034c2.592 0 4.896.896 6.592 2.24 1.568 1.248 2.304 2.496 2.944 3.615l-4.48 2.241c-.32-.737-.704-1.504-1.696-2.336-1.088-.864-2.176-1.12-3.104-1.12-3.648 0-5.567 3.392-5.567 7.167 0 4.96 2.527 7.424 5.567 7.424 2.944 0 4.128-2.048 4.896-3.36l4.448 2.271M82 1h19v4.554858h-6.711584V24h-5.545501V5.554858H82V1m49 0v12.551338c-.031503 2.166392-.063006 4.332785-1.291616 6.370747C127.314169 23.808848 122.36921 24 121.424125 24c-1.66965 0-3.654328-.413168-5.166464-1.210631-4.284384-2.23011-4.284384-6.179595-4.252881-9.238031V1h5.607503v14.016838c0 1.146914.031503 2.102676.409537 2.803567.693062 1.178773 2.205197 1.529218 3.591322 1.529218 3.780339 0 3.780339-2.612414 3.810858-4.364643V1H131m21.682468 4.300664v6.221912h4.68623c.802609-.03258 3.40306-.097742 3.40306-3.160336 0-2.931253-2.086782-3.028995-3.274642-3.061576h-4.814648zM147 1h10.208177c2.375721.03258 5.32932.065162 7.416102 2.345817 1.059443 1.205489 1.797843 3.030013 1.797843 5.115183 0 4.625454-3.114121 5.765782-4.655129 6.352236L167 24h-6.260346l-4.494608-8.20934h-3.562578V24H147V1zm33 0h16.990958v4.463568h-11.262206v4.169323h10.512545v4.365825h-10.512545v5.473573H198V24h-18V1m48 0h19v4.554858h-6.712217V24h-5.544237V5.554858H228V1m51 0v23h-5.775172v-9.805799H264.8078V24H259V1h5.8078v8.307083h8.417028V1H279m16 5h6V1h-6zm23.375766 10.595788c.587926.649581 1.077865 1.169246 2.221055 1.786349 1.535142.811976 3.102946 1.104288 4.441091 1.104288 2.287402 0 4.247157-1.07181 4.247157-2.663284 0-1.818827-2.319044-2.111139-4.017498-2.338492-1.273841-.162396-2.547682-.324791-3.78886-.584624-1.404491-.292311-6.205891-1.299162-6.205891-6.23598C315.27282 1.75387 320.565179 0 324.548994 0c5.324001 0 8.197288 2.565846 10.189705 4.352195l-4.246136 3.019538c-.718576-.713524-1.371828-1.330627-2.28536-1.851307-.816564-.453692-2.286381-1.005836-3.756197-1.005836-2.286381 0-3.429571 1.299163-3.429571 2.402436 0 1.75387 1.959755 2.013702 2.939632 2.143619 2.449694.292311 5.748615.909413 7.055118 1.36412C333.661855 11.399137 335 13.445318 335 16.043644c0 1.656432-.620589 3.47526-1.829105 4.87186C331.08049 23.31794 327.749927 24 324.516331 24c-6.499854 0-9.080198-2.98706-10.516331-4.643491l4.375766-2.760721"></path>
              </g>
            </svg>
          </Link>
        </div>
        <div className="item">
          <Link
            className={`link ${
              location.pathname === "/photography-prints" ? "decorate" : ""
            }`}
            to="/photography-prints"
          >
            All photo art
          </Link>
        </div>
        <div className="item">
          <Link
            className={`link ${
              location.pathname === "/stories" ? "decorate" : ""
            }`}
            to="/stories"
          >
            Stories
          </Link>
        </div>
        {/* <div className="item">
          <Link className="link" to="/order">
            Order
          </Link>
        </div> */}
        <div className="right">
          <div className="icons">
            <div className="cartIcon" onClick={() => setOpen(!open)}>
              <ShoppingCartOutlinedIcon />
              <span>{products.length}</span>
            </div>
          </div>
        </div>
      </div>
      {open && <Cart />}
    </div>
  );
};
