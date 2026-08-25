"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" className="button button-primary print-button" onClick={() => window.print()}>
      Save as PDF <Download size={16} />
    </button>
  );
}

