if (process.env.NODE_ENV === "development") {
  void import("@/mocks/browser").then(({ startWorker }) => {
    void startWorker();
  });
}
