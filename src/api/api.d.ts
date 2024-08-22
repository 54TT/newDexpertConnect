interface CommonOption {
  options: {
    header?: string;
    chainId: string;
    token: string;
  };
}

declare namespace API {
  interface ReportPayTypeParam extends CommonOption {
    data: {
      payType: string;
      tx: string;
    };
  }

  interface ReportPayTypeReq {
    code: string;
    massage: string;
  }
}
