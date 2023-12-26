import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import Web3 from "web3";
import HyojaeNFTFactoryABI from "../abi/HyojaeNFT.json";
import { constants } from "../components/constants";
import { ethers } from "ethers";
import { styled } from "styled-components";

import { useAddressStore } from "../stores/store";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  gap: 3rem;
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

  font-family: "Montserrat", sans-serif;
  font-weight: 700;

  &:hover,
  &:focus {
    color: red;
    outline: 0;
  }
`;

const StyledText = styled.p`
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 20px;
`;

const StyledTitle = styled.h1`
  position: relative;
  padding: 0;
  margin: 0;
  font-family: "Raleway", sans-serif;
  font-weight: 400;
  font-size: 40px;
  color: #080808;
  -webkit-transition: all 0.4s ease 0s;
  -o-transition: all 0.4s ease 0s;
  transition: all 0.4s ease 0s;
  text-align: center;
  padding-bottom: 5px;
  margin-bottom: 8rem;
  &:before {
    width: 28px;
    height: 5px;
    display: block;
    content: "";
    position: absolute;
    bottom: 3px;
    left: 50%;
    margin-left: -14px;
    background-color: #b80000;
    &:after {
      width: 100px;
      height: 1px;
      display: block;
      content: "";
      position: relative;
      margin-top: 25px;
      left: 50%;
      margin-left: -50px;
      background-color: #b80000;
    }
    &:span {
      display: block;
      font-size: 0.5em;
      line-height: 1.3;
    }
    &:em {
      font-style: normal;
      font-weight: 600;
    }
  }
`;
const StyledTitle1 = styled.h1`
  position: relative;
  padding: 0;
  margin: 0;
  font-family: "Raleway", sans-serif;
  font-weight: 400;
  font-size: 40px;
  color: #080808;
  -webkit-transition: all 0.4s ease 0s;
  -o-transition: all 0.4s ease 0s;
  transition: all 0.4s ease 0s;
  text-align: center;
  }
`;

const StyledTitle2 = styled.h1`
  position: relative;
  padding: 0;
  margin: 0;
  font-family: "Raleway", sans-serif;
  font-weight: 400;
  font-size: 20px;
  color: #080808;
  -webkit-transition: all 0.4s ease 0s;
  -o-transition: all 0.4s ease 0s;
  transition: all 0.4s ease 0s;
  text-align: center;
  }
`;

declare global {
  interface Window {
    web3: Web3;
  }
}

interface CardObject {
  name: string;
  age: number;
  email: string;
  website: string;
  gender: string;
}

const abi = HyojaeNFTFactoryABI.abi;

export const Mypage = () => {
  const [contract, setContract] = useState<any>(null);
  const [mappingInfos, setMappingInfos] = useState<string | null>(null);
  const [mappingIds, setMappingIds] = useState<string | null>(null);
  const [cardInfos, setCardInfos] = useState<CardObject[]>([]);
  const [cardIds, setCardIds] = useState<string[]>([""]);
  const { address } = useAddressStore();

  console.log("zustand", address);

  const provider = new ethers.providers.JsonRpcProvider(
    constants.SeopoliaRPCUrl
  );

  const getCardInfosData = async () => {
    // 스마트 계약 함수 호출 및 결과 업데이트
    let hyojaeNFTFactory = new ethers.Contract(
      constants.ContractAddress,
      abi,
      provider
    );
    setContract(hyojaeNFTFactory);
    console.log("hi", hyojaeNFTFactory);
    try {
      cardIds.map(async (id) => {
        const result = await hyojaeNFTFactory.getCardInfos(id);
        console.log(result);
        let newarray = result.toString().split(",");
        let newObject: CardObject = {
          name: newarray[0],
          age: newarray[1],
          email: newarray[2],
          website: newarray[3],
          gender: newarray[4],
        };
        setCardInfos((cardInfos) => [...cardInfos, newObject]);

        console.log("cardIds : ", cardIds);
        console.log("cardInfos : ", cardInfos);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTokenIdsData = async () => {
    // 스마트 계약 함수 호출 및 결과 업데이트
    let hyojaeNFTFactory = new ethers.Contract(
      constants.ContractAddress,
      abi,
      provider
    );
    setContract(hyojaeNFTFactory);
    console.log("hi", hyojaeNFTFactory);
    try {
      const result = await hyojaeNFTFactory.getTokenIds(address);
      console.log(result);
      setCardIds(result.toString().split(","));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div>
        <StyledTitle1>HELLO</StyledTitle1>
        <StyledTitle2>{address}</StyledTitle2>
        <StyledTitle>Owner </StyledTitle>
        <Container>
          <StyledText>name</StyledText>
          <StyledText>age</StyledText>
          <StyledText>email</StyledText>
          <StyledText>website</StyledText>
          <StyledText>gender</StyledText>
        </Container>
        {cardInfos.map((info: CardObject, index) => (
          <Container id="index">
            <StyledText>{info.name}</StyledText>
            <StyledText>{info.age}</StyledText>
            <StyledText>{info.email}</StyledText>
            <StyledText>{info.website}</StyledText>
            <StyledText>{info.gender}</StyledText>
          </Container>
        ))}
        <Container>
          <StyledButton
            style={{ margin: "3rem" }}
            onClick={() => getTokenIdsData()}
          >
            getTokenIds{" "}
          </StyledButton>
          <StyledButton onClick={() => getCardInfosData()}>
            getCardInfos{" "}
          </StyledButton>
        </Container>
      </div>
    </>
  );
};
