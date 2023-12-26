pragma solidity ^0.8.11;

import "./common/upgradeable/Initializable.sol";
import "./interface/IncentivePoolFactoryInterface.sol";
import "./IncentivePool.sol";

contract IncentivePoolFactory is IncentivePoolFactoryInterface, Initializable {
    ///  @notice List of product incentive pools
    IncentivePool[] public incentivePools;

    ///  @notice Mapping of pool address to validness(is it deployed?)
    mapping(address => bool) public isValidPool;

    ///  @notice Mapping of deployer address to pool address
    mapping(address => address) public deployerToIncentivePool;

    ///  @notice Pool creation fee paid by contract
    ///  @dev Should be multiplied by unit of ether(1e18)
    uint256 public poolCreationFee;

    ///  @notice Address of the master admin of split
    address public masterAdmin;

    ///  @notice Addresses of the deployers
    address[] public deployers;

    ///  @dev Guard variable for re-entrancy checks
    bool internal _notEntered;

    modifier nonReentrant() {
        require(_notEntered, "ALREADY_ENTERED");
        _notEntered = false;
        _;
        _notEntered = true; // get a gas-refund post-Istanbul
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address masterAdmin_, uint256 poolCreationFee_) public initializer {
        masterAdmin = masterAdmin_;
        poolCreationFee = poolCreationFee_;

        _notEntered = true;
    }

    function getIncentivePoolAddresses() external view returns (address[] memory) {
        uint len = incentivePools.length;
        address[] memory result = new address[](len);

        for (uint i = 0; i < len; i += 1) {
            address incentivePool = address(incentivePools[i]);
            result[i] = incentivePool;
        }

        return result;
    }

    function getDeployers() external view returns (address[] memory) {
        uint len = deployers.length;
        address[] memory result = new address[](len);

        for (uint i = 0; i < len; i += 1) {
            address deployer = address(deployers[i]);
            result[i] = deployer;
        }

        return result;
    }

    function createIncentivePool(CreateIncentivePoolReq memory req) external payable nonReentrant {
        IncentiveInfo memory info = req.incentiveInfo;

        require(msg.value >= poolCreationFee, "NOT_ENOUGHT_VALUE");
        require(address(info.incentiveToken) != address(0), "INVALID_TOKEN_ADDRESS");
        require(deployerToIncentivePool[msg.sender] == address(0), "PRODUCT_OWNED");

        uint256 initialAmount = info.leftTransactionNum * info.incentiveAmountPerTransaction;
        info.incentiveToken.transferFrom(msg.sender, address(this), initialAmount);

        DeployIncentivePoolReq memory params;
        params.deployer = msg.sender;
        params.incentiveInfo = info;

        IncentivePool incentivePool = new IncentivePool(params);

        incentivePools.push(incentivePool);
        deployers.push(msg.sender);
        isValidPool[address(incentivePool)] = true;
        deployerToIncentivePool[msg.sender] = address(incentivePool);

        info.incentiveToken.approve(address(incentivePool), initialAmount);
        incentivePool.addLeftTransactionNum(info.leftTransactionNum);

        emit CreateIncentivePool(msg.sender, address(incentivePool), initialAmount);
    }

    function updateIncentivePools(UpdateIncentivePoolsReq memory req) external nonReentrant {
        require(msg.sender == masterAdmin, "ACCESS_DENIED");

        for (uint256 i = 0; i < req.info.length; i++) {
            address poolAddress = req.info[i].incentivePoolAddress;
            require(isValidPool[poolAddress], "INVALID_POOL_ADDRESS");

            IncentivePool incentivePool = IncentivePool(poolAddress);
            incentivePool.updatePool(req.info[i].referrals);
        }
    }
}
