pragma solidity ^0.8.11;

import "./IncentivePoolStorage.sol";

contract IncentivePool is IncentivePoolStorage {
    constructor(DeployIncentivePoolReq memory req) {
        IncentiveInfo memory info = req.incentiveInfo;

        factory = msg.sender;
        masterAdmin = req.deployer;
        incentiveInfo = info;
    }

    function addLeftTransactionNum(uint256 addedTransactionNum) external {
        require(msg.sender == factory || msg.sender == masterAdmin, "ACCESS_DENIED");

        uint256 addedIncentiveAmount = addedTransactionNum * incentiveInfo.incentiveAmountPerTransaction;
        incentiveInfo.incentiveToken.transferFrom(msg.sender, address(this), addedIncentiveAmount);

        incentiveInfo.leftTransactionNum += addedTransactionNum;

        emit AddLeftTransactionNum(addedTransactionNum, incentiveInfo.leftTransactionNum, addedIncentiveAmount);
    }
}
