pragma solidity ^0.8.11;

import "./interface/IncentivePoolInterface.sol";

contract IncentivePoolStorage is IncentivePoolInterface {
    /// @notice IncentivePoolFactory 컨트랙트 주소
    address public factory;

    /// @notice 풀 관리자 주소, 풀 생성자 주소로 초기 설정
    address public masterAdmin;

    IERC20 public incentiveToken;

    uint256 public incentiveAmountPerTransaction;

    uint256 public affiliateAmountPerTransaction;

    uint256 public userAmountPerTransaction;

    uint256 public leftTransactionNum;

    uint256 public maxTransactionNumPerWallet;

    uint256 public endTimeStamp;

    mapping(address => ConnectedUserInfo[]) public affiliateToLeftTransactionNum;

    mapping(address => uint256) public userToLeftTransactionNum;

    bool public isClaimPaused;

    bool public isUpdatePaused;
}
