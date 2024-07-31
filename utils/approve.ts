import ethers from 'ethers';
const approve = async (
  contract: ethers.Contract,
  to: string,
  amount: ethers.BigNumberish
) => {
  const tx = await contract.approve(to, amount);
  const recipent = await tx.wait();
  console.log(recipent);
  return recipent.status === 1;
};
export default approve;
