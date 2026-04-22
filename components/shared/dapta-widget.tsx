"use client";

import Script from "next/script";

const DAPTA_AGENT_ID = "4a31e50f-778f-43a2-8113-74ee0ddfc47f";

export function DaptaWidget() {
  return (
    <Script
      src={`https://widget.dapta.ai/dapta_agent_min.js?agentId=${DAPTA_AGENT_ID}&env=`}
      strategy="lazyOnload"
    />
  );
}
