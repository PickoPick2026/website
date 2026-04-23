export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <br/>
      <br/>
      <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>

      <section className="space-y-6">

        <div>
          <h2 className="font-semibold text-xl mb-2">Trading Conditions, Insurance & Liability</h2>
          <p>All consignments are subject to the Standard Trading Conditions of PickOPick.</p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Customs Formalities</h2>
          <p>
            All Customs related charges will have to be paid by the client.
            All packages are subject to inspection and duty assessment by customs officials at the destination airport.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Additional Documentation</h2>
          <p>
            Additional documentation may be required on a case-to-case basis to facilitate clearance of consignments.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Chargeable Weight</h2>
          <p>
            The chargeable weight will be the greater of Gross Weight or Volumetric Weight (as per airline standards).
          </p>
          <p className="mt-2">
            <strong>Volumetric Weight (kg) = (Length × Breadth × Height in cm) / 5000</strong>
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Packing</h2>
          <p>PickOPick reserves the right to re-pack consignments to meet industry standards.</p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Clearance & Delivery Time</h2>
          <p>
            Clearance and delivery times depend on customs procedures and cannot be pre-determined.
            Delivery will occur once the package reaches the sorting facility.
          </p>
          <p>
            Upon arrival at PickOPick center, packages are logged, labeled, and stored securely in your mailbox.
          </p>
          <p>
            Notifications will be sent via Email, SMS, or WhatsApp upon arrival.
          </p>
          <p>
            Packages are shipped as per your selected shipping frequency and can be tracked end-to-end.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Limited Liability</h2>
          <p className="font-semibold">
            Liability is limited to the lesser of USD 10 or the value of the consignment in case of loss.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Duty Payment</h2>
          <p>Duty charges must be paid by the receiver.</p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Duty Charges (If Applied by Customs)</h2>
          <p>
            May require passport copy, valid visa, and national ID. All customs/admin charges must be paid by the consignee.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Communication</h2>
          <p>All routed collections are managed by PickOPick.</p>
          <p className="font-semibold">
            PickOPick will collect, verify, and share product images with clients via WhatsApp.
          </p>
          <p>
            Shipments are dispatched within 24–48 hours (excluding weekends and holidays).
          </p>
          <p>
            Delays may occur due to unavoidable circumstances. PickOPick is not responsible for deterioration due to delays.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Prohibited Commodities</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Ammunition</li>
            <li>Animals</li>
            <li>Antiques / Fine art</li>
            <li>Asbestos</li>
            <li>Bullion</li>
            <li>Currency</li>
            <li>Firearms</li>
            <li>Furs</li>
            <li>Hazardous materials (IATA)</li>
            <li>Human remains</li>
            <li>Jewellery / Precious metals</li>
            <li>Narcotics</li>
            <li>Pornography</li>
          </ul>
          <p className="mt-2">
            Any item prohibited by law in transit countries will not be accepted.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">Restricted Commodities</h2>
          <p>
            These items may be shipped subject to compliance with conditions. Contact support for details:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Alcoholic beverages</li>
            <li>Animal products</li>
            <li>Batteries</li>
            <li>Electronics</li>
            <li>Fresh flowers</li>
            <li>Industrial diamonds</li>
            <li>Ivory</li>
            <li>Liquids</li>
            <li>Medical samples</li>
            <li>Negotiable instruments</li>
            <li>Perishables</li>
            <li>Pharmaceuticals</li>
            <li>Plants / seeds</li>
          </ul>
        </div>

        <p className="mt-6 font-medium">
          For further information, please contact PickOPick.
        </p>

      </section>
    </div>
  );
}