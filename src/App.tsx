import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./app/components/Layout";
import Home from "./app/pages/Home";
import { Toaster } from "sonner";
import WhatsAppButton from "./app/components/WhatsAppButton";
import FloatingSocialMenu from "./app/components/FloatingSocialMenu";
import { SeoHead } from "./app/components/SeoHead";

// Every navigation starts at the top of the new page (React Router does not
// reset scroll by default). Pages with #hash targets handle their own
// scrolling, so those are skipped here.
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    // Stop the browser from restoring stale scroll positions on navigation.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);
  return null;
}

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
const BuyAndShipPage = lazy(() => import("./app/pages/BuyAndShip"));
const OrderAndSendPage = lazy(() => import("./app/pages/OrderAndSend"));
const AdminRedirectPage = lazy(() => import("./app/admin/page"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SeoHead />
      <WhatsAppButton />
      <FloatingSocialMenu />

      <Toaster position="bottom-right" richColors closeButton />
      <Suspense
        fallback={
          <main className="min-h-screen bg-white" aria-label="Loading page" />
        }
      >
        <Routes>
          {/* Direct Admin Portal Redirect */}
          <Route path="/admin" element={<AdminRedirectPage />} />
          <Route path="/admin/*" element={<AdminRedirectPage />} />

          {/* Layout wrapper */}
          <Route path="/" element={<Layout />}>
            {/* Core pages */}
            <Route index element={<Home />} />
            <Route path="buy-and-ship" element={<BuyAndShipPage />} />
            <Route path="order-and-send" element={<OrderAndSendPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="nri" element={<NriPage />} />
            <Route path="track-shipment" element={<TrackShipmentPage />} />
            <Route
              path="shipping-estimate"
              element={<ShippingEstimatePage />}
            />
            <Route path="contact" element={<ContactPage />} />

            {/* Policy pages */}
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="prohibited" element={<ProhibitedItemsPage />} />
            <Route path="refund" element={<RefundPage />} />

            {/* Customer Account pages */}
            <Route path="cart" element={<Navigate to="/shop?cart=open" replace />} />
            <Route path="orders" element={<Orders />} />
            <Route path="transaction/:id" element={<TransactionDetail />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="profile" element={<Profile />} />

            {/* Fallback → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
