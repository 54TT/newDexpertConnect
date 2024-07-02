import { BigNumber } from 'ethers';

export type PermitDetails = {
  token: string;
  amount: number | BigNumber;
  expiration: number | BigNumber;
  nonce?: number | BigNumber;
};

export type PermitSingle = {
  details: PermitDetails;
  spender: string;
  sigDeadline: number | BigNumber;
};

export type PermitBatch = {
  details: PermitDetails[];
  spender: string;
  sigDeadline: number | BigNumber;
};

export type TransferDetail = {
  from: string;
  to: string;
  amount: number | BigNumber;
  token: string;
};

export const PERMIT2_PERMIT_TYPE = {
  PermitDetails: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint160' },
    { name: 'expiration', type: 'uint48' },
    { name: 'nonce', type: 'uint48' },
  ],
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
};

export const PERMIT2_PERMIT_BATCH_TYPE = {
  PermitDetails: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint160' },
    { name: 'expiration', type: 'uint48' },
    { name: 'nonce', type: 'uint48' },
  ],
  PermitBatch: [
    { name: 'details', type: 'PermitDetails[]' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
};

export function getEip712Domain(chainId: number, verifyingContract: string) {
  return {
    name: 'Permit2',
    chainId,
    verifyingContract,
  };
}

export async function signPermit(
  chainId: number,
  permit: PermitSingle,
  verifyingContract: string
) {
  const eip712Domain = getEip712Domain(chainId, verifyingContract);
  return {
    eip712Domain: eip712Domain,
    PERMIT2_PERMIT_TYPE: PERMIT2_PERMIT_TYPE,
    permit: permit,
  };
}

export async function getPermitSignature(
  chainId: number,
  permit: PermitSingle,
  permit2Contract: any,
  signerAddress: string
) {
  if(!permit?.details?.nonce){
    const nextNonce = (
      await permit2Contract.allowance(
        signerAddress,
        permit.details.token,
        permit.spender
      )
    ).nonce;
    permit.details.nonce = nextNonce;
  }

  return await signPermit(chainId, permit, permit2Contract.address);
}
