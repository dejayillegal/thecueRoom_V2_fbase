import { revalidateTag } from "next/cache";

export type Ok<T> = { ok: true; data: T };
export type Fail = { ok: false; error: string };
export type Result<T> = Ok<T> | Fail;

export function ok<T>(data: T): Ok<T> { return { ok: true, data }; }
export function fail(error: unknown): Fail { return { ok: false, error: (error as Error).message ?? "Unknown error" }; }

export async function safe<T>(fn: () => Promise<T>, options: { tags?: string[] } = {}): Promise<Result<T>> {
  try {
    const data = await fn();
    for (const t of options.tags ?? []) revalidateTag(t);
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}
