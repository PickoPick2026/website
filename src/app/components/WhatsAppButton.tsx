'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const phoneNumber = "919790361222"; // your number
  const message = "Hi! Which country do you need the items shipped to?\nI can share the Buy & Ship options with you.\n\nAlso, please send me your wishlist 😊";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 group">
      
      {/* Tooltip */}
      <span className="absolute right-14 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-sm px-3 py-1 rounded-md whitespace-nowrap shadow-md">
        Chat with us
      </span>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300"
      >
        {/* Pulse Animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>

        {/* Icon */}
        <FaWhatsapp size={26} className="relative z-10" />
      </a>
    </div>
  );
}