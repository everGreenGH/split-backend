pragma solidity ^0.8.11;

import "./DtoInterface.sol";

interface IncentivePoolInterface is DtoInterface {
    struct ConnectedUserInfo {
        address user; // 사용자 지갑 주소
        address leftTransactionNum; // 추천인이 보상을 받을 수 있는 (남아있는) TX 합
    }

    /// @notice Emitted when leftTransactionNum is added
    event AddLeftTransactionNum(uint256 addedTransactionNum, uint256 totalTransactionNum, uint256 addedIncentiveAmount);
}
