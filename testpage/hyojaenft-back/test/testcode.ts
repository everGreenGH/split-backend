const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HyojaeNFT", function() {
  let HyojaeNFT, hyojaeNFT, owner, addr1, addr2;

beforeEach(async () => {
  console.log("Getting contract factory");
  HyojaeNFT = await ethers.getContractFactory("HyojaeNFT");
  
  console.log("Getting signers");
  [owner, addr1, addr2] = await ethers.getSigners();
  
  console.log("Deploying contract");
  hyojaeNFT = await HyojaeNFT.deploy();
  // 여기서 await hyojaeNFT.deployed(); 를 삭제합니다.
});


  describe("registerCard", () => {
    it("Should register and mint 10 cards for new user without fee", async () => {
      await hyojaeNFT
        .connect(addr1)
        .registerCard("hyoyoung", 30, "jhy_2301@naver.com", "naver.com", "male");

      expect(await hyojaeNFT.balanceOf(addr1.address)).to.equal(10);
    });

    it("Should require fee for existing user", async () => {
      await hyojaeNFT
        .connect(addr1)
        .registerCard("hyoyoung", 30, "jhy_2301@naver.com", "naver.com", "male");

      await expect(
        hyojaeNFT
          .connect(addr1)
          .registerCard(
            "hyoyoung",
            31,
            "jhy_2301@naver.com",
            "naver.com",
            "male"
          )
      ).to.be.revertedWith("Pay the issuance fee");
    });
  });

  describe("exchangeCard", () => {
    beforeEach(async () => {
      await hyojaeNFT
        .connect(addr1)
        .registerCard("hyoyoung", 30, "jhy_2301@naver.com", "naver.com", "male");
      await hyojaeNFT
        .connect(addr2)
        .registerCard("Bob", 25, "bob@example.com", "bob.com", "Male");
    });

    it("Should exchange cards between two addresses", async () => {
      const tokenIdAddr1Before = await hyojaeNFT.tokenOfOwnerByIndex(
        addr1.address,
        0
      );
      const tokenIdAddr2Before = await hyojaeNFT.tokenOfOwnerByIndex(
        addr2.address,
        0
      );

      await hyojaeNFT.connect(addr1).exchangeCard(addr2.address);

      const tokenIdAddr1After = await hyojaeNFT.tokenOfOwnerByIndex(
        addr1.address,
        0
      );
      const tokenIdAddr2After = await hyojaeNFT.tokenOfOwnerByIndex(
        addr2.address,
        0
      );

      expect(tokenIdAddr1Before).to.not.equal(tokenIdAddr1After);
      expect(tokenIdAddr2Before).to.not.equal(tokenIdAddr2After);
    });
  });
});
