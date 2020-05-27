import "mocha";
import * as chai from "chai";
import { solidity, loadFixture } from "ethereum-waffle";

import { fnIt } from "@pisa-research/test-utils";
import {
  DelegateDeployer,
  DelegateDeployerFactory,
  CallWrapperFactory,
  AcceptDepositFactory,
} from "../../src";
import { Provider } from "ethers/providers";
import { Wallet } from "ethers/wallet";
import { keccak256, defaultAbiCoder, parseEther } from "ethers/utils";
const expect = chai.expect;
chai.use(solidity);

type delegateDeployer = DelegateDeployer["functions"];

async function setup(provider: Provider, [admin]: Wallet[]) {
  const delegateDeployer = await new DelegateDeployerFactory(admin).deploy();

  const callWrapper = await new CallWrapperFactory(admin).deploy();
  return {
    provider,
    admin,
    delegateDeployer,
    callWrapper,
  };
}

describe("DelegateDeployer", () => {
  fnIt<delegateDeployer>(
    (a) => a.deploy,
    "a contract with 1 eth, but fails due to lack of balance.",
    async () => {
      const {
        admin,
        provider,
        delegateDeployer,
        callWrapper,
      } = await loadFixture(setup);

      const initCode = new AcceptDepositFactory(admin).getDeployTransaction()
        .data! as string;

      const salt = keccak256(defaultAbiCoder.encode(["string"], ["hello"]));

      const topup = parseEther("2");
      const data = delegateDeployer.interface.functions.deploy.encode([
        initCode,
        topup,
        salt,
      ]);
      const val = parseEther("2");
      const tx = callWrapper.delegateCall(delegateDeployer.address, data, {
        value: val,
      });

      await tx; // no error
    }
  );

  fnIt<delegateDeployer>(
    (a) => a.deploy,
    "a contract with 1 eth, but fails due to lack of balance.",
    async () => {
      const {
        admin,
        provider,
        delegateDeployer,
        callWrapper,
      } = await loadFixture(setup);

      const initCode = new AcceptDepositFactory(admin).getDeployTransaction()
        .data! as string;

      const salt = keccak256(defaultAbiCoder.encode(["string"], ["hello"]));

      const topup = parseEther("2");
      const data = delegateDeployer.interface.functions.deploy.encode([
        initCode,
        topup,
        salt,
      ]);
      const val = parseEther("1"); // ONLY DIFFERENCE
      const tx = callWrapper.delegateCall(delegateDeployer.address, data, {
        value: val,
        gasLimit: 500000, // ADDING GAS LIMIT FIXES IT
      });

      await tx; // value bignum error
    }
  );

  fnIt<delegateDeployer>(
    (a) => a.deploy,
    "a contract with 1 eth, but fails due to lack of balance.",
    async () => {
      const {
        admin,
        provider,
        delegateDeployer,
        callWrapper,
      } = await loadFixture(setup);

      const initCode = new AcceptDepositFactory(admin).getDeployTransaction()
        .data! as string;

      const salt = keccak256(defaultAbiCoder.encode(["string"], ["hello"]));

      const topup = parseEther("2");
      const data = delegateDeployer.interface.functions.deploy.encode([
        initCode,
        topup,
        salt,
      ]);
      const val = parseEther("1"); // ONLY DIFFERENCE
      const tx = callWrapper.delegateCall(delegateDeployer.address, data, {
        value: val,
      });

      await tx; // value bignum error
    }
  );
});
