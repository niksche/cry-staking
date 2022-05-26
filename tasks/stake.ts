import { ContractReceipt, ContractTransaction } from "ethers";
import {task} from "hardhat/config";
import ERC20ABI from '../artifacts/contracts/ERC20.sol/ERC20.json';
import stakingAbi from '../artifacts/contracts/Staking.sol/Staking.json';

task("stake", "calls fro stake function")
//   .addParam("tokenAddres", "address of contract")
//   .addParam("spender", "address which is alowed to spend owner's tokens")
//   .addParam("value", "token amount to be transfered")
  .setAction(async (taskArgs, hre) => {
    const erc20abi = ERC20ABI.abi;

    const provider = new hre.ethers.providers.JsonRpcProvider();

    const iface = new hre.ethers.utils.Interface(erc20abi);

    // const providerCode = await provider.getCode(taskArgs.tokenAddres);

    // if (providerCode) {
    //   if (providerCode === "0x") {
    //     console.log("Contract with such an address does not exist");
    //     return;
    //   }
    // }

    const [owner] = await hre.ethers.getSigners();

    const CryptonToken = new hre.ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      erc20abi,
      owner
    );

    const stakingContract = new hre.ethers.Contract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        stakingAbi.abi,
        owner
        );



        

    const transferTx: ContractTransaction = await stakingContract.connect(
      owner
    ).stake(0);

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