pragma solidity ^0.8.11;

import "./interface/IncentivePoolInterface.sol";

contract IncentivePoolStorage is IncentivePoolInterface {
    /// @notice IncentivePoolFactory 컨트랙트 주소
    address public factory;

    /// @notice 풀 관리자 주소
    address public poolAdmin;

    /// @notice 해당 풀의 전체 추천인 목록
    address[] public affiliates;

    /// @notice 해당 풀의 추천인 등록 여부
    mapping(address => bool) public isAffiliateExist;

    /// @notice 해당 풀의 전체 사용자 목록
    address[] public users;

    /// @notice 해당 풀의 추천인 등록 여부
    mapping(address => bool) public isUserExist;

    /// @notice 인센티브 관련 데이터
    IncentiveInfo public incentiveInfo;

    mapping(address => ConnectedUserData) public affiliateToLeftTransactionNum;

    mapping(address => uint256) public userToLeftTransactionNum;

    bool public isClaimPaused;

    bool public isUpdatePaused;

    ///  @dev Guard variable for re-entrancy checks
    bool internal _notEntered;
}
