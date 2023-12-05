import useConnectWallet from "@/hooks/useConnectWallet";
import useSiweSign from "@/hooks/useSiweSign";
import { useEffect, useState } from "react";
import s from "./index.module.scss";

export default function Home() {
  const { isLoading: isWalletConnectLoading, connectWalletHandler } =
    useConnectWallet();
  const {
    isLoading: isSiweSignLoading,
    address,
    signInHandler,
  } = useSiweSign();

  return (
    <>
      {address ? (
        <div className={s.container}>
          <div className={s.label}>Connected as {address}</div>
          <button disabled={isSiweSignLoading} onClick={signInHandler}>
            Sign In
          </button>
        </div>
      ) : (
        <div className={s.container}>
          <div className={s.label}>Click button and connect wallet</div>
          <button
            disabled={isWalletConnectLoading}
            onClick={connectWalletHandler}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
}
