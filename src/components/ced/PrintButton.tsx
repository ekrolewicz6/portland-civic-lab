"use client";
import { Printer } from "lucide-react";
export default function PrintButton() {
  return (
    <button
      className="ced-button ced-print-button"
      onClick={() => window.print()}
    >
      <Printer size={16} />
      Print / save PDF
    </button>
  );
}
