import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.17",
    // TODO: Besu 제네시스가 확정되면 evmVersion을 맞춘다.
  },
});
