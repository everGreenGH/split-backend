pragma solidity ^0.8.11;

import "./IncentivePoolStorage.sol";

contract IncentivePool is IncentivePoolStorage {
    constructor(DeployIncentivePoolReq memory req) {
        IncentiveInfo memory info = req.incentiveInfo;

        factory = msg.sender;
        masterAdmin = req.deployer;
        incentiveToken = info.incentiveToken;
        incentiveAmountPerTransaction = info.incentiveAmountPerTransaction;
        affiliateAmountPerTransaction = info.affiliateAmountPerTransaction;
        userAmountPerTransaction = info.userAmountPerTransaction;
        leftTransactionNum = info.leftTransactionNum;
        maxTransactionNumPerWallet = info.maxTransactionNumPerWallet;
        endTimeStamp = info.endTimeStamp;
    }

    function addLeftTransactionNum(uint256 addedTransactionNum) external {
        require(msg.sender == factory || msg.sender == masterAdmin, "ACCESS_DENIED");

        uint256 addedIncentiveAmount = addedTransactionNum * incentiveAmountPerTransaction;
        incentiveToken.transferFrom(msg.sender, address(this), addedIncentiveAmount);

        leftTransactionNum += addedTransactionNum;

        emit AddLeftTransactionNum(addedTransactionNum, leftTransactionNum, addedIncentiveAmount);
    }
}
