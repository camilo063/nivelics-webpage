"use client";

import Script from "next/script";

const DAPTA_AGENT_ID = "463a5205-6aa8-4a6c-8b24-049010381128";

export function DaptaWidget() {
  return (
    <Script
      src={`https://widget-v2.dapta.ai/agent.min.js?agentId=${DAPTA_AGENT_ID}`}
      strategy="lazyOnload"
    />
  );
}
