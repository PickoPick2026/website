export default function ProhibitedItemsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">
        PICK O PICK – Prohibited Items
      </h1>

      <div className="space-y-8 text-gray-700 leading-7">
        {/* Prohibited Items */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Prohibited Items
          </h2>
          <p className="mb-3">
            Pick O Pick does not accept shipments containing:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Explosives &amp; fireworks</li>
            <li>Flammable liquids &amp; gas cylinders</li>
            <li>Alcohol &amp; tobacco products</li>
            <li>Narcotics or illegal drugs</li>
            <li>Weapons &amp; ammunition</li>
            <li>Counterfeit items</li>
            <li>Live animals</li>
            <li>Human remains</li>
            <li>Currency, cash, or gold bullion</li>
            <li>Hazardous or radioactive materials</li>
            <li>Toxic substances</li>
            <li>Adult or illegal content</li>
          </ul>
        </section>

        {/* Restricted by Certain Countries */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Restricted by Certain Countries
          </h2>

          <p className="mb-3">
            Some destinations may restrict:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Medicines</li>
            <li>Food items</li>
            <li>Cosmetics</li>
            <li>Batteries</li>
            <li>Perfumes &amp; liquids</li>
            <li>Seeds or plants</li>
          </ul>

          <p className="mt-4">
            Customers are responsible for verifying destination country import
            regulations before shipping.
          </p>
        </section>

        {/* Important Note */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Important Note
          </h2>

          <p>
            Pick O Pick reserves the right to inspect, reject, hold, or report
            suspicious shipments as required by law.
          </p>
        </section>
      </div>
    </div>
  );
}