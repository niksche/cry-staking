//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "github.com/niksche/erc-20-contract/blob/master/contracts/ERC20.sol";

contract Staking {
    mapping(address => uint) public balances;
    uint public StakingsRevardPercent;
    uint public StakingsTime;

    address public lpTokenAddress;

    constructor() {

    }

    function stake(uint amount) public {
        // TODO: 
        // call erc20 method allow to spend 
        // await 
        // spend tokens here

    }

    function claim() public {

    }

    function unstake() public {

    }

    function changeStakingsTime(uint newTime) private {
        StakingsTime = newTime;
    }

    function changeStakingsRevardPercent(uint newPercent) private {
        StakingsRevardPercent = newPercent;
    }

}
