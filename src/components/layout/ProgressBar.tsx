"use client";

import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBar() {
  return (
    <>
      <AppProgressBar
        height="5px"
        color="#1d4ed8"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
