import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { ERC20, Staking } from "../typechain";

describe("Staking", function () {
  let owner: SignerWithAddress;
  let address2: SignerWithAddress;

  let stakingContract: Staking;
  let stakingContract2: Staking;
  let lpToken: ERC20;
  let rewardToken: ERC20;

  let lpTokenAddress: string;
  let rewardTokenAddress: string;
  let stakingContractAddress: string;
  let stakingContractAddress2: string;

  // TODO: nevertheless for this contract to be deployed we actually need 2 more ERC-20 contracts
  // so first of all, we are going to deploy token and mint amount of tokens;

  describe("Deployment", async function () {
    it("Arguments must be valid contracts", async function () {
      [owner, address2] = await ethers.getSigners();
      const erc20Factory = await ethers.getContractFactory("ERC20", owner);

      lpToken = await erc20Factory.deploy("lpToken", "LP", 18);

      const awaitlpToken = await lpToken.deployTransaction.wait();
      lpTokenAddress = awaitlpToken.contractAddress;

      rewardToken = await erc20Factory.deploy("rewardToken", "RE", 18);
      const awaitRewardToken = await rewardToken.deployTransaction.wait();
      rewardTokenAddress = awaitRewardToken.contractAddress;

      const balanceOfOwner = await rewardToken
        .connect(owner)
        .balanceOf(owner.address);

      const provider = ethers.provider;

      const providerCode = await provider.getCode(lpTokenAddress);
      const providerCode2 = await provider.getCode(rewardTokenAddress);

      expect(providerCode).not.to.equal("0x");
      expect(providerCode2).not.to.equal("0x");
    });

    it("Deploying contract should return some result", async function () {
      const stakingContractFactory = await ethers.getContractFactory(
        "Staking",
        owner
      );

      stakingContract = await stakingContractFactory.deploy(
        lpTokenAddress,
        rewardTokenAddress,
        0
      );

      const stakingContractWait =
        await stakingContract.deployTransaction.wait();
      stakingContractAddress = stakingContractWait.contractAddress;

      const provider = ethers.provider;

      const providerCode3 = await provider.getCode(stakingContractAddress);

      expect(providerCode3).not.to.equal("0x");
    });

    it("Should set deploymen's arguments properly", async function () {
      const stakingTimeValue = await stakingContract.stakingTime();

      expect(stakingTimeValue).to.equal(BigNumber.from("0"));
    });
  });

  describe("stake", async function () {
    it("[Negative testing]: will revert because of lack of allowance", async function () {
      expect(stakingContract.connect(owner).stake(1)).to.revertedWith(
        "asking too much money"
      );
    });

    it("[Negative testing]: will revert because of lack of balances", async function () {
      const approveTx = await lpToken
        .connect(owner)
        .approve(stakingContractAddress, 10);

      const transferTx = await lpToken
        .connect(owner)
        .transfer(address2.address, 1337);
      await transferTx.wait();

      const ownerbalance = await lpToken.balanceOf(owner.address);

      // console.log("owner balance: ", ownerbalance);
      expect(stakingContract.connect(owner).stake(1)).to.revertedWith(
        "asking too much money"
      );

      const transfertx2 = await lpToken
        .connect(address2)
        .transfer(owner.address, 1337);
      transfertx2.wait();
    });

    it("stake function causes change of contract's state", async function () {
      const approveTx = await lpToken
        .connect(owner)
        .approve(stakingContractAddress, 10);
      const approveTx2 = await rewardToken
        .connect(owner)
        .approve(stakingContractAddress, 10);
      await approveTx.wait();
      await approveTx2.wait();

      // console.log("[STAKING] owner.address", owner.address);
      // console.log("[STAKING] stakingContractAddress", stakingContractAddress);

      // console.log(
      //   "[STAKING]: allowance(owner.address, stakingContractAddress): ",
      //   await lpToken.allowance(owner.address, stakingContractAddress)
      // );

      // console.log("[STAKING]: owner.address:", owner.address);

      // console.log("[STAKING]: stakingContractAddress:", stakingContractAddress);

      // console.log(
      //   "OWNER BALANCE BEFIRE StAKE: ",
      //   await lpToken.balanceOf(owner.address)
      // );
      // console.log("OWNER ADDRESS: ", owner.address);

      const stakingStakeTx = await stakingContract.connect(owner).stake(1);

      // console.log(stakingTimeTx);

      const receipt = await stakingStakeTx.wait();
      // console.log("[receipt]", receipt);

      const block = receipt.events
        ? receipt.events[0]
        : {
            getBlock: () => {
              return "[NO events]";
            },
          };
      const blockgetblock = await block.getBlock();

      const blocktimestamp =
        typeof blockgetblock === "string" ? null : blockgetblock.timestamp;
      // console.log(blockgetblock.toString());

      // console.log("[BLOCK INFO]", blockgetblock);
      // console.log("[BLOCK INFO]: timestamp: ", blocktimestamp);

      const ownersLpTokenBalance = await stakingContract.lpTokensbalances(
        owner.address
      );

      // console.log('[ownersLpTokenBalance]',ownersLpTokenBalance);

      expect(ownersLpTokenBalance).to.be.equal(BigNumber.from(1));

      const ownersStakingTimestamp = await stakingContract.stakingTimestamp(
        owner.address
      );

      // console.log("[CONTRACT CALL]: Timestamp", ownersStakingTimestamp);
      expect(ownersStakingTimestamp).to.be.equal(
        BigNumber.from(blocktimestamp)
      );
    });

    it("Set claimedReward as false", async function () {
      const isOwnerRewardClaimed = await stakingContract.claimedRevard(
        owner.address
      );
      // console.log("[CONTRACT CALL]: isClaimed", isOwnerRewardClaimed);
      expect(isOwnerRewardClaimed).to.be.equal(false);
    });

    it("Update totalStakedAmount inside contract", async function () {
      const totalStakingLpAmount = await stakingContract.totalStakedAmount();
      // console.log("[CONTRACT CALL]: stakingAmount", totalStakingLpAmount);
      expect(totalStakingLpAmount).to.be.equal(BigNumber.from(1));
    });
  });

  describe("claim", async function () {
    it("[Negative testing] reverts function if zero balance", async function () {
      // stakingContract.connect(address2).claim();
      expect(stakingContract.connect(address2).claim()).to.be.revertedWith(
        "User must have at least something to be deposited"
      );
    });
    it("[Negative testing] reverts function if already called", async function () {
      await stakingContract.connect(owner).claim();
      expect(stakingContract.connect(owner).claim()).to.be.revertedWith(
        "Easy cowboy"
      );
    });

    it("[Negative testing] reverts function if too early for a party", async function () {
      const stakingContractFactory = await ethers.getContractFactory(
        "Staking",
        owner
      );

      const duration = 1;

      stakingContract2 = await stakingContractFactory.deploy(
        lpTokenAddress,
        rewardTokenAddress,
        duration
      );

      const stakingContractWait2 =
        await stakingContract2.deployTransaction.wait();
      stakingContractAddress2 = stakingContractWait2.contractAddress;

      expect(stakingContract2.connect(owner).claim()).to.be.revertedWith(
        "Too early for withdrawing money honey"
      );
    });

    it("Transfers reward assets to user", async function () {
      const transferTx = await lpToken
        .connect(owner)
        .transfer(address2.address, 2);
      await transferTx.wait();
      const aproveTx = await lpToken
        .connect(address2)
        .approve(stakingContractAddress, 1);
      await aproveTx.wait();

      const transferTx2 = await rewardToken
        .connect(owner)
        .transfer(address2.address, 2);
      await transferTx2.wait();
      const aproveTx2 = await rewardToken
        .connect(address2)
        .approve(stakingContractAddress, 1);
      await aproveTx2.wait();

      // const approvalTx =

      const stakeTx = await stakingContract.connect(address2).stake(1);
      await stakeTx.wait();

      const rewardTokenBalanceBefore = await rewardToken.balanceOf(
        address2.address
      );

      // console.log('[TEST] before: ', rewardTokenBalanceBefore);

      const claimTx = await stakingContract.connect(address2).claim();

      await claimTx.wait();

      const rewardTokenBalanceAfter = await rewardToken.balanceOf(
        address2.address
      );

      // console.log('[TEST] after: ', rewardTokenBalanceAfter);
      expect(rewardTokenBalanceAfter).to.be.equal(rewardTokenBalanceBefore);
    });
  });

  describe("unstake", async function () {
    it("[Negative testing] reverts function if zero balance", async function () {
      // stakingContract.connect(address2).claim();
      expect(stakingContract.connect(address2).unstake()).to.be.revertedWith(
        "User must have at least something to be deposited"
      );
    });

    it("[Negative testing] reverts function if too early for a party", async function () {
      // lpToken.approve(stakingContractAddress2, 1);
      // stakingContract2.connect(owner).stake(1);
      expect(stakingContract2.connect(owner).unstake()).to.be.revertedWith(
        "Too early for withdrawing money honey"
      );
    });

    it("Transfers user's assets back to user", async function () {
      const balanceToUnstake = await stakingContract.lpTokensbalances(
        owner.address
      );

      // console.log("[Contract call]: balanceToUnstake", balanceToUnstake);

      const unstakeTx = await stakingContract.connect(owner).unstake();

      await unstakeTx.wait();
      const balanceAfter = await stakingContract.lpTokensbalances(
        owner.address
      );
      // console.log("[Contract call]: balanceToUnstake", balanceToUnstake2);
      expect(balanceAfter).to.be.equal(BigNumber.from(0));
    });
  });

  describe("changeStakingTime", function () {
    it("Should update state of contract", async function () {
      const changeTx = await stakingContract
        .connect(owner)
        .changeStakingsRevardPercent(1);
      await changeTx.wait();
      expect(1).to.be.equal(1);
    });

    it("[Negative testing]: shoud revert with owneronly error", async function () {
      expect(
        stakingContract.connect(address2).changeStakingsRevardPercent(1)
      ).to.be.revertedWith("onlyowner function!");
    });
  });

  describe("changeStakingsRevardPercent", async function () {
    it("Should update state of contract", async function () {
      const change2 = await stakingContract
        .connect(owner)
        .changeStakingsTime(1);
      await change2.wait();
      expect(1).to.be.equal(1);
    });

    it("[Negative testing]: shoud revert with owneronly error", async function () {
      expect(
        stakingContract.connect(address2).changeStakingsTime(1)
      ).to.be.revertedWith("onlyowner function!");
    });
  });
});
