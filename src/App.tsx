import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app/components/Layout";
import Home from "./app/pages/Home";
import Cart from "./app/pages/Cart";
import Orders from "./app/pages/Orders";
import Addresses from "./app/pages/Adresses";
import Wallet from "./app/pages/Wallet";
import Profile from "./app/pages/Profile";
import { Toaster } from "sonner";


export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors closeButton />
      <Routes>
      
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          
          {/* Default page */}
          <Route index element={<Home />} />

          {/* After login pages */}
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="wallet" element={<Wallet />} />
           <Route path="profile" element={<Profile />} />
           
        </Route>
         
         
      

      </Routes>
    </BrowserRouter>
  );
}