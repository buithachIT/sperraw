import { isMswEnabled } from "@/consts/msw";

if (isMswEnabled()) {
  void import("@/mocks/browser").then(({ startWorker }) => {
    void startWorker();
  });
}
