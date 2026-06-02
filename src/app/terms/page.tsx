export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">
        PICK O PICK – Terms &amp; Conditions
      </h1>

      <div className="space-y-8 text-gray-700 leading-7">
        {/* General */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. General
          </h2>
          <p>
            By using Pick O Pick services, customers agree to comply with all
            shipping regulations, company policies, and the terms mentioned
            below.
          </p>
        </section>

        {/* Shipment Acceptance */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Shipment Acceptance
          </h2>
          <p>
            Pick O Pick reserves the right to refuse shipments containing
            prohibited, unsafe, restricted, or improperly packed items.
          </p>
        </section>

        {/* Pickup & Packing */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Pickup &amp; Packing
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Free pickup and free packing are available for selected shipments
              and locations only.
            </li>
            <li>
              Pickup timings are subject to operational availability.
            </li>
            <li>
              Customers must ensure parcels are ready before pickup.
            </li>
          </ul>
        </section>

        {/* Delivery Timelines */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Delivery Timelines
          </h2>
          <p>
            Estimated delivery timelines are approximate and may vary due to
            customs clearance, airline schedules, weather conditions, public
            holidays, or unforeseen operational delays.
          </p>
        </section>

        {/* Customs Duties & Taxes */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Customs Duties &amp; Taxes
          </h2>
          <p>
            International shipments may be subject to customs duties, taxes, or
            import charges imposed by destination countries. These charges must
            be paid by the receiver or customer.
          </p>
        </section>

        {/* Customer Responsibility */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Customer Responsibility
          </h2>

          <p className="mb-3">
            Customers must provide:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Accurate sender and receiver information</li>
            <li>Valid contact details</li>
            <li>Correct shipment declarations</li>
          </ul>

          <p className="mt-4">
            Additional charges may apply for incorrect or incomplete
            information.
          </p>
        </section>

        {/* Liability */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Liability
          </h2>

          <p className="mb-4">
            Pick O Pick’s liability is limited to the declared shipment value
            or courier partner liability limits, whichever is lower.
          </p>

          <p className="mb-3">
            The company is not responsible for:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Customs delays</li>
            <li>Confiscation by authorities</li>
            <li>Indirect losses</li>
            <li>Emotional or sentimental value of items</li>
            <li>Damages caused by poor packaging by the customer</li>
          </ul>
        </section>

        {/* Returned Shipments */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            8. Returned Shipments
          </h2>
          <p>
            If shipments are returned due to an incorrect address, unpaid
            customs charges, or receiver unavailability, additional charges may
            apply.
          </p>
        </section>

        {/* Insurance */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            9. Insurance
          </h2>
          <p>
            Shipment insurance is optional and subject to approval based on the
            shipment category and declared value.
          </p>
        </section>

        {/* Service Changes */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            10. Service Changes
          </h2>
          <p>
            Pick O Pick reserves the right to modify pricing, services, and
            policies without prior notice.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            11. Governing Law
          </h2>
          <p>
            These Terms &amp; Conditions shall be governed by the laws of India.
          </p>
        </section>
      </div>
    </div>
  );
}