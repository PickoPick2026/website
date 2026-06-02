export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">
        PICK O PICK – Privacy Policy
      </h1>

      <div className="space-y-8 text-gray-700 leading-7">
        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Information We Collect
          </h2>

          <p className="mb-3">
            Pick O Pick may collect:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Shipping address</li>
            <li>Payment details</li>
            <li>Shipment information</li>
          </ul>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. How We Use Information
          </h2>

          <p className="mb-3">
            Customer information is used for:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Shipment processing</li>
            <li>Customer support</li>
            <li>Delivery updates</li>
            <li>Payment verification</li>
            <li>Service improvements</li>
            <li>Promotional communication (optional)</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Data Protection
          </h2>

          <p>
            We take reasonable security measures to protect customer
            information from unauthorized access or misuse.
          </p>
        </section>

        {/* Sharing Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Sharing Information
          </h2>

          <p className="mb-3">
            Customer data may be shared only with:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Courier partners</li>
            <li>Payment gateways</li>
            <li>Customs authorities</li>
            <li>Logistics service providers</li>
          </ul>

          <p className="mt-4">
            As required for shipment processing.
          </p>
        </section>

        {/* Cookies & Website Usage */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Cookies &amp; Website Usage
          </h2>

          <p>
            Our website may use cookies and analytics tools to improve user
            experience and website performance.
          </p>
        </section>

        {/* Marketing Communication */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Marketing Communication
          </h2>

          <p>
            Customers may receive promotional offers or updates. Users can opt
            out at any time.
          </p>
        </section>

        {/* Third-Party Links */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Third-Party Links
          </h2>

          <p>
            Pick O Pick is not responsible for the privacy practices of
            third-party websites linked through our platform.
          </p>
        </section>

        {/* Policy Updates */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            8. Policy Updates
          </h2>

          <p>
            Pick O Pick may update this Privacy Policy without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
}