import { ContractReceipt, ContractTransaction } from "ethers";
import { task } from "hardhat/config";
import ERC20ABI from "../artifacts/contracts/ERC20.sol/ERC20.json";
import stakingAbi from "../artifacts/contracts/Staking.sol/Staking.json";

task("stake", "stakes {amount} of tokens at {contractAddress} staking contract")
  .addParam("contractAddress", "address of contract")
  .addParam("amount", "token amount to be stake")
  .setAction(async (taskArgs, hre) => {
    const erc20abi = ERC20ABI.abi;

    const provider = new hre.ethers.providers.JsonRpcProvider();

    const iface = new hre.ethers.utils.Interface(erc20abi);

    const providerCode = await provider.getCode(taskArgs.contractAddress);

    if (providerCode) {
      if (providerCode === "0x") {
        console.log("Contract with such an address does not exist");
        return;
      }
    }

    const [owner] = await hre.ethers.getSigners();

    const stakingContract = new hre.ethers.Contract(
      taskArgs.contractAddress,
      stakingAbi.abi,
      owner
    );

    const transferTx: ContractTransaction = await stakingContract
      .connect(owner)
      .stake(taskArgs.amount);

    const receipt: ContractReceipt = await transferTx.wait();

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
