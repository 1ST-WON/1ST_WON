import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.17",
    settings: { evmVersion: "london" },
  },
});
