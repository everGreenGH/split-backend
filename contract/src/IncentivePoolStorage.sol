pragma solidity ^0.8.11;

import "./interface/IncentivePoolInterface.sol";

contract IncentivePoolStorage is IncentivePoolInterface {
    /// @notice IncentivePoolFactory 컨트랙트 주소
    address public factory;

    /// @notice 풀 관리자 주소
    address public masterAdmin;

    /// @notice 인센티브 관련 데이터
    IncentiveInfo public incentiveInfo;

    mapping(address => ConnectedUserInfo[]) public affiliateToLeftTransactionNum;

    mapping(address => uint256) public userToLeftTransactionNum;

    bool public isClaimPaused;

    bool public isUpdatePaused;
}
