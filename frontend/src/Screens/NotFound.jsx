import React from "react";
import { Link } from "react-router-dom";

// Campus wayfinding 404: a destination plate for a stop that does not exist.
// The amber route line runs up to a dead stop; the way back is the primary CTA.
const NotFound = () => (
  <main
    id="main-content"
    tabIndex={-1}
    className="min-h-screen bg-[#EFF0F2] text-[#16181D] flex items-center justify-center px-4 py-16"
  >
    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#E4E6EA] bg-white p-10 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      {/* Enamel sign top edge; delayed half a pulse cycle so its idle-dead
          moment never coincides with the route line below. */}
      <span
        aria-hidden="true"
        style={{ animationDelay: "0.75s" }}
        className="idle-pulse-line absolute inset-x-0 top-0 h-1 bg-[#FFB020]"
      />

      <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E6EA] bg-white px-4 py-1.5 text-xs uppercase tracking-widest text-[#6E7178]">
        <span className="idle-pulse h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
        Destination not found
      </span>

      <h1 className="mt-8 font-['Plus_Jakarta_Sans'] text-8xl font-bold leading-[0.95] tracking-tight text-[#16181D]">
        404
      </h1>

      <div className="mt-8 flex items-center" aria-hidden="true">
        <span className="idle-pulse-line block h-[4px] w-80 max-w-[70%] rounded-full bg-[#FFB020]" />
        <span className="block h-6 w-[6px] shrink-0 bg-[#FFB020]" />
      </div>

      <p className="mt-8 text-[#6E7178] leading-relaxed">
        This address is not on any route. The page may have moved, or the sign
        was never put up. Head back to the entrance and pick your destination
        from there.
      </p>

      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#1A1D21] px-5 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#16181D] active:scale-95"
      >
        Return to campus →
      </Link>
    </div>
  </main>
);

export default NotFound;
