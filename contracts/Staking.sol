//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./ERC20.sol";


contract Staking {
    mapping(address => uint) public balances;
    uint public StakingsRevardPercent;
    uint public StakingsTime;

    ERC20 public cryToken;
    ERC20 public lpToken;

    constructor(address _lpTokenAddress,address _cryTokenAddress) {
        cryToken = ERC20(_lpTokenAddress);
        lpToken = ERC20(_cryTokenAddress);
        console.log("done");
    }

    // withdraw from msg.sender amount of token
    function stake(uint amount) public {
        // will work only if approved previoslly was called
        cryToken.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }

    // function claim() public {

    // }

    // function unstake() public {

    // }

    // function changeStakingsTime(uint newTime) private {
    //     StakingsTime = newTime;
    // }

    // function changeStakingsRevardPercent(uint newPercent) private {
    //     StakingsRevardPercent = newPercent;
    // }

}
