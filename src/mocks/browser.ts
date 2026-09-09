import { setupWorker, type SetupWorker } from "msw/browser";

import { handlers } from "@/mocks/handlers";

type MswWindow = Window & {
  __MSW_WORKER__?: SetupWorker;
  __MSW_STARTED__?: boolean;
  __MSW_STARTING__?: Promise<void>;
};

function getWindow(): MswWindow | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window as MswWindow;
}

export async function startWorker() {
  const mswWindow = getWindow();
  if (!mswWindow) {
    return;
  }

  if (mswWindow.__MSW_STARTED__ && mswWindow.__MSW_WORKER__) {
    mswWindow.__MSW_WORKER__.resetHandlers();
    mswWindow.__MSW_WORKER__.use(...handlers);
    return;
  }

  if (mswWindow.__MSW_STARTING__) {
    return mswWindow.__MSW_STARTING__;
  }

  const worker = mswWindow.__MSW_WORKER__ ?? setupWorker(...handlers);
  mswWindow.__MSW_WORKER__ = worker;

  mswWindow.__MSW_STARTING__ = worker
    .start({
      onUnhandledRequest: "bypass",
      quiet: true,
    })
    .then(() => {
      mswWindow.__MSW_STARTED__ = true;
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (
        message.includes("already enabled") ||
        message.includes("redundant")
      ) {
        mswWindow.__MSW_STARTED__ = true;
        return;
      }
      mswWindow.__MSW_STARTING__ = undefined;
      throw error;
    });

  return mswWindow.__MSW_STARTING__;
}
