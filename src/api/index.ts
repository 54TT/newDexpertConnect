export async function reportPayType(
  request: any,
  { data, options }: API.ReportPayTypeParam
): Promise<API.ReportPayTypeReq> {
  const { payType, tx } = data;
  return request({
    method: 'get',
    url: '/api/v1/d_pass/pay',
    data: { payType: payType, tx },
    ...options,
  });
}
