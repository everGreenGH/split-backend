import { useConnect } from "wagmi";

export default function useConnectWallet() {
  const { connect, connectors, isLoading, error, pendingConnector } =
    useConnect();

  const connectWalletHandler = () => {
    // TODO: 커넥터 추가 시 수정
    const metamaskConnector = connectors[0];
    connect({ connector: metamaskConnector });
  };

  return { isLoading, connectWalletHandler };
}
