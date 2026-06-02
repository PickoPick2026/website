export default function RefundPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">
        PICK O PICK – Refund Policy
      </h1>

      <div className="space-y-8 text-gray-700 leading-7">
        {/* Booking Cancellation */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Booking Cancellation
          </h2>
          <p>
            Shipment cancellations are allowed only before dispatch.
          </p>
        </section>

        {/* Refund Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Refund Eligibility
          </h2>
          <p className="mb-3">
            Refunds may be approved for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Duplicate payments</li>
            <li>Failed pickups</li>
            <li>Cancelled shipments before dispatch</li>
          </ul>
        </section>

        {/* Non-Refundable Charges */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Non-Refundable Charges
          </h2>
          <p className="mb-3">
            The following charges are non-refundable:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Customs duties &amp; taxes</li>
            <li>Completed shipment charges</li>
            <li>Used packaging charges</li>
            <li>Failed delivery attempts due to customer error</li>
          </ul>
        </section>

        {/* Buy & Ship Wallet Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Buy &amp; Ship Wallet Policy
          </h2>
          <p>
            Customers must maintain sufficient wallet balance for Buy &amp; Ship
            orders. Any unused balance after successful delivery will be
            refunded upon final invoice settlement.
          </p>
        </section>

        {/* Refund Processing Time */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Refund Processing Time
          </h2>
          <p>
            Approved refunds may take 7–21 business days based on the payment
            method and banking process.
          </p>
        </section>

        {/* Partial Refunds */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Partial Refunds
          </h2>
          <p>
            Partial refunds may be issued after deducting operational or courier
            partner charges.
          </p>
        </section>

        {/* Delayed Shipments */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Delayed Shipments
          </h2>
          <p>
            Delays caused by customs, airlines, weather conditions, floods,
            storms, or third-party logistics partners are not eligible for
            refunds.
          </p>
        </section>
      </div>
    </div>
  );
}