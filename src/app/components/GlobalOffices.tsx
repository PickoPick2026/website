import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";

const offices = [
  { name: "Chennai, India", location: "Your India-side team", flag: null },
  { name: "Singapore", location: "Singapore Operations Desk", flag: "/images/flags/sg.svg" },
  { name: "United Kingdom", location: "London, United Kingdom", flag: "/images/flags/gb.svg" },
  { name: "Dubai / UAE", location: "Dubai, United Arab Emirates", flag: "/images/flags/ae.svg" },
];

export function GlobalOffices() {
  return (
    <section
      id="global-offices"
      aria-labelledby="global-offices-heading"
      className="relative isolate w-full scroll-mt-28 overflow-hidden bg-[#D9F1FF] lg:aspect-[3/1] lg:min-h-[560px]"
    >
      <img
        src="/images/global-offices-sea-freight-v4.png"
        alt="Pick O Pick-branded aircraft and a cargo ship travelling from Chennai across the sea toward Singapore, London and Dubai beneath a bright cloudy sky"
        width={2048}
        height={683}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 block h-[56vw] w-full object-cover object-bottom sm:h-auto sm:object-contain"
        loading="lazy"
        decoding="async"
      />
      <div className="grid gap-8 px-5 pt-8 pb-[62vw] sm:px-8 sm:pt-10 sm:pb-[38vw] lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-12 lg:pb-48 xl:pt-12">
        <header>
          <h2 id="global-offices-heading" className="max-w-lg text-3xl font-extrabold leading-tight tracking-tight text-[#07378A] sm:text-4xl xl:text-5xl">
            From Chennai,<br />closer to you.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#173A63] sm:text-base">
            Your team in India, with overseas support closer to home.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07378A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#052860] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#07378A]"
          >
            Contact our team <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        <div>
          <h3 className="text-lg font-bold text-[#07378A]">Our global offices</h3>
          <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 min-[400px]:grid-cols-2">
            {offices.map((office) => (
              <li key={office.name} className="flex items-start gap-3">
                {office.flag ? (
                  <img
                    src={office.flag}
                    alt=""
                    width={36}
                    height={24}
                    className="mt-0.5 h-6 w-9 shrink-0 rounded-sm object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="mt-0.5 flex h-6 w-9 shrink-0 items-center justify-center text-[#173A63]">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#07378A]">{office.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#173A63]">{office.location}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
