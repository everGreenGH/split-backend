import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useEffect, useState } from "react";

export interface SignInButtonProps {
  setAddress: (address: string) => void;
}

export default function useSiweSign() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nonce, setNonce] = useState<string>("");

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const createWallet = async () => {
    try {
      await fetch("http://localhost:8000/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNonce = async () => {
    try {
      if (!address) throw Error();

      const nonceRes = await fetch(
        `http://localhost:8000/auth/nonce?address=${address}`
      );

      const nonce = (await nonceRes.json()).nonce;
      return nonce;
    } catch (error) {
      console.log(error);
    }
  };

  const sign = async (message: SiweMessage, signature: string) => {
    try {
      const signRes = await fetch("http://localhost:8000/auth/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });

      const tokens = (await signRes.json()).authTokens;
      console.log(tokens);
    } catch (error) {
      console.log(error);
    }
  };

  const signInHandler = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      setIsLoading(true);

      // 1. 지갑 데이터베이스에 등록
      await createWallet();

      // 2. 논스 받아옴
      const nonce = await fetchNonce();
      setNonce(nonce);

      // 3. 메시지 및 서명 생성
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to SPLIT",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // 4. 해당 메시지 및 서명으로 서버에 인증, JWT 토큰 가져옴
      await sign(message, signature);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      fetchNonce();
    }
  };

  return { isLoading, address, chain, nonce, signInHandler };
}
