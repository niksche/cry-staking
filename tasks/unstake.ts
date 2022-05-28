import { ContractReceipt, ContractTransaction } from "ethers";
import { task } from "hardhat/config";
import ERC20ABI from "../artifacts/contracts/ERC20.sol/ERC20.json";
import stakingAbi from "../artifacts/contracts/Staking.sol/Staking.json";

task("unstake", "unstake user's token from contract at {contractAddress}")
    .addParam("contractAddress", "address of contract")
  .setAction(async (taskArgs, hre) => {
    const provider = new hre.ethers.providers.JsonRpcProvider();
    const providerCode = await provider.getCode(taskArgs.contractAddress);

    if (providerCode) {
      if (providerCode === "0x") {
        console.log(`Contract at ${taskArgs.contractAddress} does not exist`);
        return;
      }
    }

    const [owner] = await hre.ethers.getSigners();

    const stakingContract = new hre.ethers.Contract(
      taskArgs.contractAddress,
      stakingAbi.abi,
      owner
    );

    const unstakeTx: ContractTransaction = await stakingContract
      .connect(owner)
      .unstake();

    const receipt: ContractReceipt = await unstakeTx.wait();

    // const TransferEvent = receipt.events
    //   ? receipt.events[0]
    //   : { args: { _owner: "", _spender: "", _value: "" } };

    console.log(receipt);
    //   "successfully approved to spend",
    //   TransferEvent.args?._value.toString(),
    //   "of",
    //   "CRT from ",
    //   TransferEvent.args?._owner,
    //   "by",
    //   TransferEvent.args?._spender
    // );
  });
