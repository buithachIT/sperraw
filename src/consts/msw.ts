/**
 * Browser MSW mocks. Homework has no real backend, so mocks stay on
 * unless explicitly turned off at build time.
 *
 * NEXT_PUBLIC_ENABLE_MSW=false → gọi API thật
 * NEXT_PUBLIC_ENABLE_MSW=true  → bật mock (mặc định nếu không set)
 */
export function isMswEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MSW !== "false";
}
