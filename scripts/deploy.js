// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const NinjaFlip = await hre.ethers.getContractFactory("NinjaFlip");
  const ninjaFlip = await NinjaFlip.deploy("0x2F2d82Da4c49806659e01fD03B091F0d265cb80e",5);

  await ninjaFlip.deployed();

  console.log(
    `NinjaFlip deployed to ${ninjaFlip.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
