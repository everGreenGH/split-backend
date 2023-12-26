pragma solidity ^0.8.11;

import "./IncentivePoolStorage.sol";

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
    }

    function addLeftTransactionNum(uint256 addedTransactionNum) external {
        require(msg.sender == factory || msg.sender == poolAdmin, "ACCESS_DENIED");

        uint256 addedIncentiveAmount = addedTransactionNum * incentiveInfo.incentiveAmountPerTransaction;
        incentiveInfo.incentiveToken.transferFrom(msg.sender, address(this), addedIncentiveAmount);

        incentiveInfo.leftTransactionNum += addedTransactionNum;

        emit AddLeftTransactionNum(addedTransactionNum, incentiveInfo.leftTransactionNum, addedIncentiveAmount);
    }

    function updatePool(Referral[] memory referrals) external {
        require(isUpdatePaused == false, "CLAIM_PAUSED");
        require(msg.sender == factory, "ACCESS_DENIED");
    }

    function claimAffiliateIncentive() external nonReentrant {
        require(isClaimPaused == false, "CLAIM_PAUSED");

        ConnectedUserData storage userData = affiliateToLeftTransactionNum[msg.sender];
        ConnectedUserData memory localUserData = userData;

        require(localUserData.users.length > 0, "NO_USER");

        uint256 claimTransactionNum = 0;
        uint256 count = 0;

        for (uint256 i = localUserData.index; i < localUserData.users.length; i++) {
            claimTransactionNum += localUserData.users[i].leftTransactionNum;
            userData.users[i].leftTransactionNum = 0;
            count++;
        }

        userData.index += count;

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

// /// @notice IncentivePoolFactory 컨트랙트 주소
// address public factory;

// /// @notice 풀 관리자 주소
// address public poolAdmin;

// /// @notice 인센티브 관련 데이터
// IncentiveInfo public incentiveInfo;

// mapping(address => ConnectedUserInfo[]) public affiliateToLeftTransactionNum;

// mapping(address => uint256) public userToLeftTransactionNum;

// bool public isClaimPaused;

// bool public isUpdatePaused;
