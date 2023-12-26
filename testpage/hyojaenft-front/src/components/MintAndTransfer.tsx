import { constants } from "../components/constants";
import { ethers } from "ethers";
import HyojaeNFTFactoryABI from "../abi/HyojaeNFT.json";
import { useState } from "react";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

const StyledInput = styled.input`
  font-size: 15px;
  color: #222222;
  width: 300px;
  border: none;
  border-bottom: solid #aaaaaa 1px;
  padding-bottom: 10px;
  padding-left: 10px;
  position: relative;
  background: none;
  z-index: 5;
  &:focus ~ span,
  input:valid ~ span {
    width: 100%;
  }
  margin-bottom: 1rem;
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

const abi = HyojaeNFTFactoryABI.abi;
interface MintTranProps {
  account: string;
  setAccount: (account: string) => void;
}

export const MintAndTransfer = ({ account, setAccount }: MintTranProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [gender, setGender] = useState("");
  const [exchangeTo, setExchangeTo] = useState("");

  const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

  const provider = new ethers.providers.JsonRpcProvider(
    constants.SeopoliaRPCUrl
  );
  let hyojaeNFTFactory = new ethers.Contract(
    constants.ContractAddress,
    abi,
    provider
  );
  hyojaeNFTFactory = hyojaeNFTFactory.connect(signer);

  const Register = async () => {
    const tx = await hyojaeNFTFactory.registerCard(
      name,
      age,
      email,
      website,
      gender
    );
    const txReceipt = await tx.wait();
    console.log(txReceipt);
  };

  const ExchangeTo = async () => {
    const tx = await hyojaeNFTFactory.exchangeCard(exchangeTo);
    const txReceipt = await tx.wait();
    console.log(txReceipt);
    console.log("exchange done");
  };

  return (
    <>
      <Container>
        <StyledInput
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <StyledInput
          type="text"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <StyledInput
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledInput
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <StyledInput
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />

        <StyledButton onClick={() => Register()}>Register My Info</StyledButton>
      </Container>

      <Container>
        <StyledInput
          type="text"
          placeholder="Exchange to"
          value={exchangeTo}
          onChange={(e) => setExchangeTo(e.target.value)}
        />
        <StyledButton onClick={() => ExchangeTo()}>Exchange </StyledButton>
      </Container>
    </>
  );
};
