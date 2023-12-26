import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { setup } from "@test/setup";
import { IncentivePoolFactory } from "@typechains";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";

describe("테스트 그룹 이름", () => {
    /* Signer */
    let admin: SignerWithAddress;
    let user: SignerWithAddress[];

    /* 컨트랙트 객체 */
    let incentivePoolFactory: IncentivePoolFactory;

    /* 테스트 스냅샷 */
    let initialSnapshotId: number;
    let snapshotId: number;

    before(async () => {
        /* 테스트에 필요한 컨트랙트 및 Signer 정보를 불러오는 함수 */
        ({ admin, users: user, incentivePoolFactory } = await setup());
        initialSnapshotId = await network.provider.send("evm_snapshot");
    });

    beforeEach(async () => {
        snapshotId = await network.provider.send("evm_snapshot");
    });

    afterEach(async () => {
        await network.provider.send("evm_revert", [snapshotId]);
    });

    after(async () => {
        await network.provider.send("evm_revert", [initialSnapshotId]);
    });

    describe("새로운 테스트", () => {
        it("배포 되어있는지 테스트", async () => {
            console.log(incentivePoolFactory.address);
        });
    });
});
