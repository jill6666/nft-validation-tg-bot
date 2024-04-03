const axios = require('axios');

interface ICheckNFTExsist {
  address: string;
  collection?: string;
}
/**
 *
 * @description Check if NFT exists in the wallet by collection
 * @returns
 */
const checkNFTExsist = async ({
  address,
  collection,
}: ICheckNFTExsist): Promise<boolean> => {
  const TON_API_HOST = process.env.TON_API_HOST;
  if (!TON_API_HOST) throw new Error('TON_API_HOST is not defined');

  const url = `${TON_API_HOST}/accounts/${address}/nfts?collection=${collection}`;

  const response = await axios.get(url);
  const nftItems = response?.data?.nft_items;
  const hasNFT = nftItems && nftItems.length > 0;

  return hasNFT;
};

export default checkNFTExsist;
