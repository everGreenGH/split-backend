pragma solidity ^0.8.11;

import "./common/Initializable.sol";

contract IncentivePoolFactory is Initializable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {}
}
