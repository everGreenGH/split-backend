pragma solidity ^0.8.11;

import "../common/token/IERC20.sol";

interface CommonDtos {
    struct IncentiveInfo {
        IERC20 incentiveToken;
        uint256 incentiveAmountPerTransaction;
        uint256 affiliateAmountPerTransaction;
        uint256 userAmountPerTransaction;
        uint256 leftTransactionNum;
        uint256 maxTransactionNumPerWallet;
        uint256 endTimeStamp;
    }

    struct CreateIncentivePoolReq {
        IncentiveInfo incentiveInfo;
    }

    struct DeployIncentivePoolReq {
        address deployer;
        IncentiveInfo incentiveInfo;
    }

    struct Referral {
        address affiliate;
        address user;
    }

    struct PoolUpdateInfo {
        address incentivePoolAddress;
        Referral[] referrals;
    }

    struct UpdateIncentivePoolsReq {
        PoolUpdateInfo[] info;
    }
}
