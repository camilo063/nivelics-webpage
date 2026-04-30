"use client";

import { useState } from "react";

const HIDDEN_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  top: "auto",
  width: 1,
  height: 1,
  overflow: "hidden",
  opacity: 0,
};

/**
 * Anti-bot hidden fields. Renders:
 * - `website` honeypot input (real users never fill it; bots fill every field).
 * - `_ts` hidden input set to mount time, used for time-based bot detection
 *   on the server.
 *
 * Place inside a `<form>` so the values get submitted with FormData.
 */
export function HoneypotFields() {
  const [ts] = useState<number>(() => Date.now());
  return (
    <div aria-hidden="true" style={HIDDEN_STYLE}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
      <input type="hidden" name="_ts" defaultValue={ts} />
    </div>
  );
}
