import { wagmiConfig } from "@/common/wagmi.config";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
