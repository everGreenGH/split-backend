import { IncentivePoolFactory, TestToken } from "@typechains";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * @dev viction testnet 배포 스크립트
 * @deployer pengtoshi
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const { deploy } = deployments;
    const [admin] = await ethers.getSigners();

    const tomoBalanceBeforeDeploy = await admin.getBalance();
    console.log(`⛽️ 배포 이전 TOMO 잔고: ${tomoBalanceBeforeDeploy} TOMO`);

    const POOL_CREATION_FEE = ethers.utils.parseEther("0.0001"); // 0.0001 TOMO

    await deploy("IncentivePoolFactory", {
        from: admin.address,
        contract: "IncentivePoolFactory",
        proxy: {
            execute: {
                init: {
                    methodName: "initialize",
                    args: [admin.address, POOL_CREATION_FEE],
                },
            },
        },
        log: true,
        autoMine: true,
    });

    const incentivePoolFactory = await ethers.getContract<IncentivePoolFactory>("IncentivePoolFactory");
    console.log("=== (⌛️ 1/2 ⌛️) IncentivePoolFactory 배포 완료 🚀 : ", incentivePoolFactory.address);

    await deploy("USDC", {
        from: admin.address,
        contract: "TestToken",
        args: ["USDC coin", "USDC", 18],
        log: true,
        autoMine: true,
    });

    const testUSDC = await ethers.getContract<TestToken>("USDC");
    console.log("=== (⌛️ 2/2 ⌛️) Test USDC 배포 완료 🚀 : ", testUSDC.address);

    const tomoBalanceAfterDeploy = await admin.getBalance();
    console.log(`⛽️ 배포 완료 후 TOMO 잔고: ${tomoBalanceAfterDeploy} TOMO`);
    console.log(`🥹  가스비로 사용한 TOMO: ${tomoBalanceBeforeDeploy.sub(tomoBalanceAfterDeploy)} TOMO`);
};

export default func;
func.tags = ["001_deploy_contracts"];
