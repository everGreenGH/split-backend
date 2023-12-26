import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WagmiConfig, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
//as를 붙여야 타입 체크가 되는듯

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

root.render(
  <WagmiConfig config={config}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </WagmiConfig>
);
