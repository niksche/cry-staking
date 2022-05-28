import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("Staking", function () {
  let owner: SignerWithAddress;
  let address2: SignerWithAddress;

  beforeEach(async function () {
    [owner, address2] = await ethers.getSigners();

    const cryTokenFactory = await ethers.getContractFactory(
      "ERC20",
      owner
    );

    const d = await cryTokenFactory.deploy("Heh", "hehe", 1);

    const dtxReceipt = await d.deployTransaction.wait();

    console.log("Contract deployed to :", dtxReceipt.contractAddress);

    const stakingContractFactory = await ethers.getContractFactory(
      "Staking",
      owner
    );
    stakingContractFactory.deploy("todo: someaddress", "someaddress");
  });

  describe("Deployment", function () {
    it("Should deploy contract and set something to smth", function () {
      expect(BigNumber.from("0")).to.be.equal(BigNumber.from("0"));
    });
  });
});
