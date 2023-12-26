pragma solidity ^0.8.11;

import "./IncentivePoolStorage.sol";
import "hardhat/console.sol";

contract IncentivePool is IncentivePoolStorage {
    modifier nonReentrant() {
        require(_notEntered, "ALREADY_ENTERED");
        _notEntered = false;
        _;
        _notEntered = true; // get a gas-refund post-Istanbul
    }

    constructor(DeployIncentivePoolReq memory req) {
        IncentiveInfo memory info = req.incentiveInfo;

        factory = msg.sender;
        poolAdmin = req.deployer;
        incentiveInfo = info;

        isClaimPaused = false;
        isUpdatePaused = false;

        _notEntered = true;
    }

    function addLeftTransactionNum(uint256 addedTransactionNum) external {
        require(msg.sender == factory || msg.sender == poolAdmin, "ACCESS_DENIED");

        uint256 addedIncentiveAmount = addedTransactionNum * incentiveInfo.incentiveAmountPerTransaction;
        incentiveInfo.incentiveToken.transferFrom(msg.sender, address(this), addedIncentiveAmount);

        // msg.sender가 factory인 경우, 생성자에서 leftTransactionNum을 설정
        if (msg.sender != factory) {
            incentiveInfo.leftTransactionNum += addedTransactionNum;
        }

        emit AddLeftTransactionNum(addedTransactionNum, incentiveInfo.leftTransactionNum, addedIncentiveAmount);
    }

    function updatePool(Referral[] memory referrals) external {
        require(isUpdatePaused == false, "CLAIM_PAUSED");
        require(msg.sender == factory, "ACCESS_DENIED");

        for (uint256 i = 0; i < referrals.length; i++) {
            ConnectedUserData storage userData = affiliateToLeftTransactionNum[referrals[i].affiliate];

            bool isRegisteredUser = userData.userToIsRegisteredUser[referrals[i].user];
            if (!isRegisteredUser) {
                userData.userToIsRegisteredUser[referrals[i].user] = true;
                userData.users.push(referrals[i].user);
            }

            userData.leftTransactionNum++;
        }
    }

    function claimAffiliateIncentive() external nonReentrant {
        require(isClaimPaused == false, "CLAIM_PAUSED");

        ConnectedUserData storage userData = affiliateToLeftTransactionNum[msg.sender];
        uint256 claimTransactionNum = userData.leftTransactionNum;
        userData.leftTransactionNum = 0;

        require(claimTransactionNum > 0, "NO_TRANSACTION");

        uint256 claimValue = claimTransactionNum * incentiveInfo.incentiveAmountPerTransaction;
        incentiveInfo.incentiveToken.transfer(msg.sender, claimValue);

        emit ClaimIncentive(msg.sender, ClaimType.AFFILIATE, claimTransactionNum, claimValue);
    }

    function claimUserIncentive() external nonReentrant {
        require(isClaimPaused == false, "CLAIM_PAUSED");

        uint256 claimTransactionNum = userToLeftTransactionNum[msg.sender];
        require(claimTransactionNum > 0, "NO_TRANSACTION");

        userToLeftTransactionNum[msg.sender] = 0;

        uint256 claimValue = claimTransactionNum * incentiveInfo.incentiveAmountPerTransaction;
        incentiveInfo.incentiveToken.transfer(msg.sender, claimValue);

        emit ClaimIncentive(msg.sender, ClaimType.USER, claimTransactionNum, claimValue);
    }
}
