import useConnectWallet, { LoginState } from "@/hooks/useConnectWallet";
import { useEffect, useState } from "react";
import s from "./index.module.scss";

export default function Home() {
  const { loginState, walletState, connectWalletHandler } = useConnectWallet();

  return (
    <>
      {loginState === LoginState.DONE ? (
        <div className={s.container}>
          <div className={s.text}>지갑 연결에 성공했어요.</div>
          <div className={s.text}>지갑 주소: {walletState}</div>
        </div>
      ) : (
        <div className={s.container}>
          <div className={s.text}>아래 버튼을 클릭하여 지갑을 연결하세요.</div>
          <button
            disabled={loginState === LoginState.PROGRESS}
            onClick={connectWalletHandler}
          >
            지갑 연결하기
          </button>
        </div>
      )}
    </>
  );
}
