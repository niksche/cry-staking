//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./ERC20.sol";


contract Staking {

    mapping(address => uint) public lpTokensbalances;
    mapping(address => uint) public stakingTimestamp;
    mapping(address => bool) public claimedRevard;

    uint public totalStakedAmount;
    uint public stakingsRevardPercent;
    uint public stakingTime;

    ERC20 public rewardToken; // - CRY token
    ERC20 public lpToken; // - Any other token you would love to chose;

    constructor(address _lpTokenAddress, address _rewardTokenAddress) {
        rewardToken = ERC20(_lpTokenAddress);
        lpToken = ERC20(_rewardTokenAddress);
        stakingTime = 0 minutes;
    }

    // accept lp token from msg.sender => after 10 minutes it will 
    function stake(uint amount) public {
        require(block.timestamp >= stakingTimestamp[msg.sender] + stakingTime, "Previous staking is active");
        // will work only if approved previoslly was called
        lpToken.transferFrom(msg.sender, address(this), amount);
        lpTokensbalances[msg.sender] += amount;
        totalStakedAmount += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        claimedRevard[msg.sender] = false;
    }

    function claim() public {
        require(claimedRevard[msg.sender] == false, "Easy cowboy");
        require(lpTokensbalances[msg.sender] != 0, "User must have at least something to be deposited");
        require(block.timestamp >= stakingTimestamp[msg.sender] + 2 * stakingTime, "Too early for withdrawing money honey");

        uint rewardTokenAmount = stakingsRevardPercent * lpTokensbalances[msg.sender] / 100; 
        rewardToken.transfer(msg.sender, rewardTokenAmount);
        claimedRevard[msg.sender] = true;

    }

    function unstake() public {
        require(lpTokensbalances[msg.sender] != 0, "User must have at least something to be deposited");
        require(block.timestamp >= stakingTimestamp[msg.sender] + 2 * stakingTime, "Too early for withdrawing money honey");
        lpToken.transfer(msg.sender, lpTokensbalances[msg.sender]);
    }

    function changeStakingsTime(uint _stakingTime) private {
        stakingTime = _stakingTime;
    }

    function changeStakingsRevardPercent(uint _stakingsRevardPercent) private {
        stakingsRevardPercent = _stakingsRevardPercent;
    }
}
