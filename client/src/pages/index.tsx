import useConnectWallet, { LoginState } from "@/hooks/useConnectWallet";
import { useEffect, useState } from "react";
import s from "./index.module.scss";
import axios from 'axios';


export default function Home() {
  const { loginState, walletState, connectWalletHandler } = useConnectWallet();
  const [productId, setProductId] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg3NDc2NDk0YWFkODBhNTA0MTczMzY0ZThlZDBiYzFjNjViZDg2NjBiIiwiaWF0IjoxNzAzNDg2MzcxLCJleHAiOjE3MDM1ODYzNzF9._aDmHaLCPvTQt8w6ZBI_CA-EISCJ0wg-RZqDvKXbXGM"; 

  const productHandler = async () => {
    const productData = {
      name: "dokite_product2",
      webLink: "dokite_link",
      twitterLink: "dokite_link",
      network: "Arbitrum",
      description: "This is a dokite product.",
      transactions: [{
        txNetwork: "Arbitrum",
        targetAddress: "0x19fa1a0029E8de872B915220a85E36a392D57c51",
        txData: "sample_tx_data_1",
        incentiveNetwork: "Arbitrum",
        incentiveTokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        incentiveTokenAmountPerTx: 0.1
      }, {
        txNetwork: "Arbitrum",
        targetAddress: "0x19fa1a0029E8de872B915220a85E36a392D57c51",
        txData: "sample_tx_data_2",
        incentiveNetwork: "Arbitrum",
        incentiveTokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        incentiveTokenAmountPerTx: 0.1
      }]
    };

    try {
      const response = await axios.post('http://localhost:8000/product', productData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      console.log('Product registration successful:', response.data);
      setProductId(response.data.id);
    } catch (error) {
      console.error('Error registering product:', error);
    }
  };

  const deployHandler = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/product/deploy?id=${productId}`,null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
  
      console.log('Deploy successful:', response.data);
      setApiKey(response.data.apiKey);
  
    } catch (error) {
      console.error('Error deploying product:', error);
    }
  };
  

  return (
    <>
      {loginState === LoginState.DONE ? (
        <div className={s.container}>
          <div className={s.text}>지갑 연결에 성공했어요.</div>
          <div className={s.text}>지갑 주소: {walletState}</div>
          <button onClick={productHandler}>product 등록</button>
          <button onClick={deployHandler}>deploy 버튼</button>
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
