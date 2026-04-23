import { createBrowserRouter } from "react-router";
import Layout from "./app/components/Layout";

import Products from "./app/pages/Products";
import Cart from "./app/pages/Cart";
import Orders from "./app/pages/Orders";

import Addresses from "./app/pages/Adresses";
import Wallet from "./app/pages/Wallet";
import TransactionDetails from "./app/pages/TransactionDetail";

// ✅ ADD THESE IMPORTS
import Terms from "./app/terms/page";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Products },

      { path: "cart", Component: Cart },
      { path: "orders", Component: Orders },
      { path: "addresses", Component: Addresses },
      { path: "wallet", Component: Wallet },
      { path: "transaction/:id", Component: TransactionDetails },

      // ✅ ADD THESE ROUTES
      { path: "terms", Component: Terms },
      
    ],
  },
]);