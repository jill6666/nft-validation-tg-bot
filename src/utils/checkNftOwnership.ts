const axios = require('axios');

interface ICheckNFTExsist {
  address: string;
  collection?: string;
}
const checkNFTExsist = async ({ address, collection }: ICheckNFTExsist) => {
  const url = `https://tonapi.io/v2/accounts/${address}/nfts?collection=${collection}`;

  const response = await axios.get(url);
  const nftItems = response?.data?.nft_items;
  const hasNFT = nftItems && nftItems.length > 0;

  return hasNFT;
};
