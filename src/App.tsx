import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./app/components/Layout";
import Home from "./app/pages/Home";
import { Toaster } from "sonner";
import WhatsAppButton from "./app/components/WhatsAppButton";
import { SeoHead } from "./app/components/SeoHead";

const Cart = lazy(() => import("./app/pages/Cart"));
const Orders = lazy(() => import("./app/pages/Orders"));
const TransactionDetail = lazy(() => import("./app/pages/TransactionDetail"));
const Addresses = lazy(() => import("./app/pages/Adresses"));
const Wallet = lazy(() => import("./app/pages/Wallet"));
const Profile = lazy(() => import("./app/pages/Profile"));
const TermsPage = lazy(() => import("./app/terms/page"));
const PrivacyPolicyPage = lazy(() => import("./app/privacy/page"));
const ProhibitedItemsPage = lazy(() => import("./app/prohibited/page"));
const RefundPage = lazy(() => import("./app/refund/page"));
const NriPage = lazy(() => import("./app/pages/Nri"));
const ShippingEstimatePage = lazy(() => import("./app/pages/ShippingEstimate"));
const ContactPage = lazy(() => import("./app/pages/Contact"));
const ShopPage = lazy(() => import("./app/pages/Shop"));
const TrackShipmentPage = lazy(() => import("./app/pages/TrackShipment"));


export default function App() {
  return (
    <BrowserRouter>
      <SeoHead />
      <WhatsAppButton />
    
      <Toaster position="bottom-right" richColors closeButton />
      <Suspense fallback={<main className="min-h-screen bg-white" aria-label="Loading page" />}>
      <Routes>
      
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          
          {/* Default page */}
          <Route index element={<Home />} />
           <Route path="terms" element={<TermsPage />} />
           <Route path="privacy" element={<PrivacyPolicyPage />} />
           <Route path="prohibited" element={<ProhibitedItemsPage />} />
           <Route path="refund" element={<RefundPage />} />
           <Route path="nri" element={<NriPage />} />
           <Route path="shipping-estimate" element={<ShippingEstimatePage />} />
           <Route path="contact" element={<ContactPage />} />
           <Route path="shop" element={<ShopPage />} />
           <Route path="track-shipment" element={<TrackShipmentPage />} />

          {/* After login pages */}
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="transaction/:id" element={<TransactionDetail />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="wallet" element={<Wallet />} />
           <Route path="profile" element={<Profile />} />

          {/* Unknown routes → home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
         
         
      

      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
