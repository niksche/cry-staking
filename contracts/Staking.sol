//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "hardhat/console.sol";

contract Staking {
    address private owner;
    mapping(address => uint256) public lpTokensbalances;
    mapping(address => uint256) public stakingTimestamp;
    mapping(address => bool) public claimedRevard;

    uint256 public totalStakedAmount;
    uint256 public stakingsRevardPercent;
    uint256 public stakingTime;

    ERC20 public rewardToken; // - CRY token
    ERC20 public lpToken; // - Any other token you would love to chose;

    constructor(
        address _lpTokenAddress,
        address _rewardTokenAddress,
        uint256 _duration
    ) {
        rewardToken = ERC20(_lpTokenAddress);
        lpToken = ERC20(_rewardTokenAddress);
        stakingTime = _duration;
        owner = msg.sender;
    }

    // Withdraw {amount} of LP tokens of {lpToken} from {msg.sender}
    // updates balances in contract
    function stake(uint256 amount) public {
        //FYI: Will work only if approved previoslly was called
        // console.log("msg.sender: ", msg.sender);
        // console.log(address(this));
        lpToken.transferFrom(msg.sender, address(this), amount);

        lpTokensbalances[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        claimedRevard[msg.sender] = false;
        totalStakedAmount += amount;
    }

    // Withdraw some amount of {rewardToken} from contract to msg.sender
    // with respect to the mount of staked LP tokens of {lpToken}
    function claim() public {
        require(claimedRevard[msg.sender] == false, "Easy cowboy");
        require(
            lpTokensbalances[msg.sender] != 0,
            "User must have at least something to be deposited"
        );
        require(
            block.timestamp >= stakingTimestamp[msg.sender] + 2 * stakingTime,
            "Too early for withdrawing money honey"
        );

        uint256 rewardTokenAmount = (stakingsRevardPercent *
            lpTokensbalances[msg.sender]) / 100;
        rewardToken.transfer(msg.sender, rewardTokenAmount);
        claimedRevard[msg.sender] = true;
    }

    // Withdraw amount of staked LP tokens of {lpToken} from contract back to msg.sender
    function unstake() public {
        require(
            lpTokensbalances[msg.sender] != 0,
            "User must have at least something to be deposited"
        );
        require(
            block.timestamp >= stakingTimestamp[msg.sender] + 2 * stakingTime,
            "Too early for withdrawing money honey"
        );
        lpToken.transfer(msg.sender, lpTokensbalances[msg.sender]);
        lpTokensbalances[msg.sender] -= lpTokensbalances[msg.sender];
    }

    function changeStakingsTime(uint256 _stakingTime) external {
        require(msg.sender == owner, "onlyowner function!");
        stakingTime = _stakingTime;
    }

    function changeStakingsRevardPercent(uint256 _stakingsRevardPercent)
        external
    {
        require(msg.sender == owner, "onlyowner function!");
        stakingsRevardPercent = _stakingsRevardPercent;
    }
}
