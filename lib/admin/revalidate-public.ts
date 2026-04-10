"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidate public site pages after CMS changes.
 * Revalidates both ES and EN versions.
 */
export async function revalidatePublicPages(paths: string[]) {
  for (const path of paths) {
    try {
      revalidatePath(path);
      // Also revalidate the EN version
      if (!path.startsWith("/en")) {
        revalidatePath(`/en${path}`);
      }
    } catch (e) {
      console.error(`Revalidation error for ${path}:`, e);
    }
  }
}
