pragma solidity ^0.8.11;

import "./CommonDtos.sol";

interface IncentivePoolInterface is CommonDtos {
    enum ClaimType {
        AFFILIATE,
        USER
    }

    struct ConnectedUserInfo {
        address user; // 사용자 지갑 주소
        uint256 leftTransactionNum; // 추천인이 보상을 받을 수 있는 (남아있는) TX 합
    }

    struct ConnectedUserData {
        uint256 index;
        ConnectedUserInfo[] users;
    }

    /// @notice Emitted when leftTransactionNum is added
    event AddLeftTransactionNum(uint256 addedTransactionNum, uint256 totalTransactionNum, uint256 addedIncentiveAmount);

    /// @notice Emitted when affiliate claim the incentive
    event ClaimIncentive(
        address indexed caller,
        ClaimType indexed claimType,
        uint256 claimTransactionNum,
        uint256 claimedValue
    );
}
