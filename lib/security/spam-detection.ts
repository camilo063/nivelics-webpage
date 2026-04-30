// Heuristic content-based spam detection. Designed to catch the bot signature
// we've been seeing (random-string names/companies, gmail dot-stuffed emails,
// no-space messages, link-spam) without rejecting real Spanish/English copy.

export type SpamReason =
  | "name_no_vowels"
  | "email_excessive_dots"
  | "company_no_vowels"
  | "message_no_spaces"
  | "message_random_string"
  | "message_multiple_urls";

export interface SpamCheckPayload {
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
}

export interface SpamCheckResult {
  spam: boolean;
  reason?: SpamReason;
}

const VOWEL_RE = /[aeiouáéíóúAEIOUÁÉÍÓÚ]/g;

function looksLikeRandomString(value: string): boolean {
  if (value.length <= 8) return false;
  if (!/^[a-zA-Z]+$/.test(value)) return false;
  return !/[aeiouáéíóú]/i.test(value);
}

export function isLikelySpam(payload: SpamCheckPayload): SpamCheckResult {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const company = (payload.company ?? "").trim();
  const message = (payload.message ?? "").trim();

  // 1. Name with almost no vowels (e.g. "omtyDOEbdtnBzHZKfZGLy")
  if (name.length > 8) {
    const vowels = name.match(VOWEL_RE)?.length ?? 0;
    if (vowels / name.length < 0.15) return { spam: true, reason: "name_no_vowels" };
  }

  // 2. Gmail dot-stuffed local part (typical bot signature)
  const localPart = email.split("@")[0] ?? "";
  const dotCount = (localPart.match(/\./g) ?? []).length;
  if (dotCount >= 4) return { spam: true, reason: "email_excessive_dots" };

  // 3. Company that is a random string with no vowels
  if (company && looksLikeRandomString(company)) {
    return { spam: true, reason: "company_no_vowels" };
  }

  // 4 / 5 / 6 only apply when the message is non-trivial
  if (message.length > 15) {
    if (!message.includes(" ")) return { spam: true, reason: "message_no_spaces" };

    const words = message.split(/\s+/).filter(Boolean);
    const avgWordLen = message.length / Math.max(words.length, 1);
    if (avgWordLen > 15) return { spam: true, reason: "message_random_string" };

    const urlCount = (message.match(/https?:\/\//gi) ?? []).length;
    if (urlCount >= 2) return { spam: true, reason: "message_multiple_urls" };
  }

  return { spam: false };
}
