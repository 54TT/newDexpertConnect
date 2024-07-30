export interface Order {
    orderHash: string;
    chainId: number;
    offerer: string;
    filler: string;
    orderStatus: string;
    nonce: string;
    createdAt?: Date;
    updatedAt?: Date;
    fillerAt: number;
    orderType: string;
    side: string;
    input: string;
    outputs: string;
    signature: string;
    reactor: string;
    encodedOrder: string;
    deadline: number;
    decayEndTime: number;
    decayStartTime: number;
    inputToken: string;
    inputTokenName: string;
    inputTokenSymbol: string;
    inputTokenDecimals: number;
    outputToken: string;
    outputTokenName: string;
    outputTokenSymbol: string;
    outputTokenDecimals: number;
    orderPrice: string;
  }
  