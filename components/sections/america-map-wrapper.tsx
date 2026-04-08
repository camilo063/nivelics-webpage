"use client";

import dynamic from "next/dynamic";

const AmericaMap = dynamic(
  () => import("@/components/sections/america-map").then((m) => m.AmericaMap),
  { ssr: false, loading: () => <div className="h-[400px]" /> },
);

export function AmericaMapWrapper() {
  return <AmericaMap />;
}
