// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const _lpTokenAddress: string = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const _rewardTokenAddress: string =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const _duration = 60;

  const provider = new ethers.providers.JsonRpcProvider();

  const providerCode = await provider.getCode(_lpTokenAddress);

  if (providerCode) {
    if (providerCode === "0x") {
      console.log(`Contract at ${_lpTokenAddress} does not exist`);
      return;
    }
  }

  const providerCode2 = await provider.getCode(_rewardTokenAddress);

  if (providerCode2) {
    if (providerCode2 === "0x") {
      console.log(`Contract at ${_rewardTokenAddress} does not exist`);
      return;
    }
  }

  // We get the contract to deploy
  const stakingFactory = await ethers.getContractFactory("Staking");
  const stakingContract = await stakingFactory.deploy(
    _lpTokenAddress,
    _rewardTokenAddress,
    _duration
  );

  await stakingContract.deployed();

  console.log("stakingContract deployed to:", stakingContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
