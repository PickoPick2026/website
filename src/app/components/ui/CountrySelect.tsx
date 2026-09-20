import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
  { code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { code: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "LK", name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
  { code: "MU", name: "Mauritius", dialCode: "+230", flag: "🇲🇺" },
  { code: "MV", name: "Maldives", dialCode: "+960", flag: "🇲🇻" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { code: "IN", name: "India (Domestic)", dialCode: "+91", flag: "🇮🇳" },
];

interface CountrySelectProps {
  value: string;
  onChange: (countryName: string, country: CountryOption) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function CountrySelect({
  value,
  onChange,
  label = "Destination Country",
  placeholder = "Select destination country",
  className = "",
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry =
    COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === value.toLowerCase() ||
        c.code.toLowerCase() === value.toLowerCase()
    ) || COUNTRIES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} <span className="text-[#FF6321]">*</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
            alt={`${selectedCountry.name} flag`}
            className="w-5 h-3.5 object-cover rounded-xs shrink-0 border border-slate-200"
            onError={(e) => {
              // fallback to emoji flag if network fails
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-base select-none mr-0.5">
            {selectedCountry.flag}
          </span>
          <span className="text-sm font-semibold text-[#0A1931] truncate">
            {selectedCountry.name}
          </span>
          <span className="text-xs font-medium text-slate-400 shrink-0">
            ({selectedCountry.dialCode})
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#0B56D9]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or dial code..."
                className="w-full h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9]"
              />
            </div>
          </div>

          {/* Quick Popular Chips */}
          {!search && (
            <div className="p-2 border-b border-slate-100 bg-slate-50/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1.5">
                Popular Destinations
              </div>
              <div className="flex flex-wrap gap-1">
                {COUNTRIES.slice(0, 6).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.name, c);
                      setIsOpen(false);
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCountry.code === c.code
                        ? "bg-[#0B56D9] text-white"
                        : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Countries List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 p-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = selectedCountry.code === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.name, country);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 text-[#0B56D9] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                        alt={`${country.name} flag`}
                        className="w-4 h-3 object-cover rounded-xs border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="text-sm select-none shrink-0">
                        {country.flag}
                      </span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {country.dialCode}
                      </span>
                      {isSelected && (
                        <Check size={14} className="text-[#0B56D9]" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                No matching country found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
