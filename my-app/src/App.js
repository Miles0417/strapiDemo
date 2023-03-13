import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";

import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home/Home";
import { Products } from "./pages/Products/Products";
import { Product } from "./pages/Product/Product";
import { Stories } from "./pages/Stories/Stories";
import { Story } from "./pages/Story/Story";
import { Order } from "./pages/Order/Order";
// require('dotenv').config()

const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      {/* <Footer/> */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/photography-prints",
        element: <Products />,
      },
      {
        path: "/photography-prints/:id",
        element: <Product />,
      },
      {
        path: "/stories",
        element: <Stories />,
      },
      {
        path: "/stories/:id",
        element: <Story />,
      },
      {
        path: "/order",
        element: <Order />,
      },
    ],
  },
]);
function App() {
  return (
    // <ApolloProvider client={client}>
    <div className="site-wrapper">
      {/* <header className="App-header"> */}
      <RouterProvider router={router} />
      {/* </header> */}
    </div>
    // </ApolloProvider>
  );
}

export default App;
