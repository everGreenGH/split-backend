import { SocketAddress } from "net";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useAddressStore } from "../stores/store";
import useReferralRequest from '../hooks/useReferralRequest';
import Split from '../../public/splitsdk/splitsdk';
import { SplitSnackBar } from "./SplitSnackBar";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledButton = styled.button`
  margin-left: 10px;
  box-sizing: border-box;
  appearance: none;
  background-color: transparent;
  border: 2px solid $red;
  border-radius: 0.6em;
  color: $red;
  cursor: pointer;
  padding: 10px;
  align-self: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  margin: 20px;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;

  &:hover,
  &:focus {
    color: red;
    outline: 0;
  }
`;

declare global {
  interface Window {
    split: any;
  }
}

interface WalletProps {
  account: string;
  setAccount: (account: string) => void;
}

export const Wallet = ({ account, setAccount }: WalletProps) => {
  const { setAddress } = useAddressStore();
  const [affiliateAddress, setAffiliateAddress] = useState<string | null>(null);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false); // Add state


  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { disconnect } = useDisconnect();
  setAccount(address!);


  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const affiliateParam = urlParams.get("affiliate");

      if (affiliateParam) {
        setAffiliateAddress(affiliateParam);
      }

      try {
        const split = window.split;
        const res = await split.referral("c92f5b322d6d76d4981df4ce164e2151", address, affiliateParam);

        if (res === 'true' || 'false') {
          setShowSnackBar(true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (isConnected) {
      fetchData();
    }
  }, [isConnected,]);


  return (
    <Container>
      {isConnected ? (
        <>
          <div>
            Connected to {address}
            <StyledButton onClick={() => disconnect()}>Disconnect</StyledButton>
          </div>
        </>
      ) : (
        <StyledButton onClick={() => connect()}>Connect Wallet</StyledButton>
      )}
      {showSnackBar && <SplitSnackBar />}
    </Container>
  );

};
