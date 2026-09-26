export type Result<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: Error };
