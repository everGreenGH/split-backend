// import { ethers } from "hardhat";

// async function main() {
//   const HyojaeNFTFactory = await ethers.getContractFactory("HyojaeNFT");
//   const hyojaeNFT = await HyojaeNFTFactory.deploy();

//   console.log("HyojaeNFT deployed to:", hyojaeNFT.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });

require("dotenv").config();
import { ethers } from "hardhat";
import { HyojaeNFT } from "../typechain-types";

async function main() {
  const HyojaeNFTFactory = await ethers.getContractFactory("HyojaeNFT");
  const HyojaeNFT: HyojaeNFT = (await HyojaeNFTFactory.deploy()) as HyojaeNFT;

  const temp = await HyojaeNFT;

  console.log("HyojaeNFT deployed to:", await temp.getAddress());
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// 정상적으로 sepolia network에 배포가 되었다면 아래와 같이 출력됨. 배포 주소는 다 다른 것이 정상.
// HyojaeNFT deployed to: 0x806E846858E752eb9f709e9EB3803b9217fbe4d0
