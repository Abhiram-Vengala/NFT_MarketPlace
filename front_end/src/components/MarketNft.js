import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { GetIpfsUrlFromPinata } from '../utils';
import NftDiaplay from './NftDiaplay';
import './MarketNft.css';


function MarketNft({ contract, provider }) {
  const [data, setData] = useState([]);
  const [datafetched ,updateDataFetched] = useState(false);
  async function getAllNfts() {
    updateDataFetched(true);
    let transactions = await contract.getAllNfts();
    console.log(transactions);

    const items = await Promise.all(transactions.map(async i => {
      let tokenURI = await contract.tokenURI(i.tokenID);
      console.log(i.tokenID.toNumber());
      console.log("getting token uri ", tokenURI);
      let getURI = GetIpfsUrlFromPinata(tokenURI);
      let meta = await axios.get(getURI);
      meta = meta.data;
      console.log(meta.image);
      let price =  ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        price,
        tokenID: i.tokenID.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      }
      return item;
    }))
    setData(items);
    console.log(datafetched);
    console.log(items);
  }
  useEffect(()=>{
    getAllNfts();
  },[]);
  return (
    <div className='total'>
      <div className="Inside">
        {
          data.map((value, index) => {
            return (<NftDiaplay data={value} key={index}></NftDiaplay>)
          })
        }
      </div>
    </div>
  )
}

export default MarketNft
