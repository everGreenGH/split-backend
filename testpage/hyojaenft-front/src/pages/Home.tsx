import React, { useState, useEffect } from "react";
import { Wallet } from "../components/Wallet";
import { Navbar } from "../components/Navbar";
import { styled } from "styled-components";
import { MintAndTransfer } from "../components/MintAndTransfer";

const Container = styled.div`
  margin-bottom: 2rem;
`;

export const Home = () => {
  const [account, setAccount] = useState("");

  return (
    <>
      <Container>
        <Navbar></Navbar>
        {/* <WalletName></WalletName> */}
        <Wallet account={account} setAccount={setAccount}></Wallet>
      </Container>
      <MintAndTransfer account={account} setAccount={setAccount} />
    </>
  );
};

// function WalletName() {
//   //어떤 wallet에 연결되었는지를 보여줌.
//   const { connect, connectors, error, isLoading, pendingConnector } =
//     useConnect();
//   return (
//     <div>
//       {connectors.map((connector) => (
//         <button
//           disabled={!connector.ready}
//           key={connector.id}
//           onClick={() => connect({ connector })}
//         >
//           {connector.name}
//           {!connector.ready && " (unsupported)"}
//           {isLoading &&
//             connector.id === pendingConnector?.id &&
//             " (connecting)"}
//         </button>
//       ))}

//       {error && <div>{error.message}</div>}
//     </div>
//   );
// }
