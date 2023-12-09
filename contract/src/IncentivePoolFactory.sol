pragma solidity ^0.8.11;

import "./common/upgradeable/Initializable.sol";
import "./interface/IncentivePoolFactoryInterface.sol";
import "./IncentivePool.sol";

contract IncentivePoolFactory is IncentivePoolFactoryInterface, Initializable {
    IncentivePool[] public incentivePools;
    uint256 public poolCreationFee;
    address public masterAdmin;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address masterAdmin_, uint256 poolCreationFee_) public initializer {
        masterAdmin = masterAdmin_;
        poolCreationFee = poolCreationFee_;
    }

    function createIncentivePool(CreateIncentivePoolReq memory req) external payable {
        IncentiveInfo memory info = req.incentiveInfo;

        require(msg.value >= poolCreationFee, "NOT_ENOUGHT_VALUE");
        require(address(info.incentiveToken) != address(0), "INVALID_TOKEN_ADDRESS");

        uint256 initialAmount = ((info.leftTransactionNum * info.incentiveAmountPerTransaction) / 1e18);
        info.incentiveToken.transferFrom(msg.sender, address(this), initialAmount);

        DeployIncentivePoolReq memory params;
        params.deployer = msg.sender;
        params.incentiveInfo = info;

        IncentivePool incentivePool = new IncentivePool(params);
        incentivePools.push(incentivePool);

        info.incentiveToken.approve(address(incentivePool), initialAmount);
        incentivePool.addLeftTransactionNum(info.leftTransactionNum);

        // TODO: emit event
    }
}
