import React, { useEffect, useState } from 'react'
import { GetIpfsUrlFromPinata } from '../utils';
import axios from 'axios';
import { ethers } from 'ethers';
import NftDiaplay from './NftDiaplay';
import { useParams } from 'react-router-dom';
import './MarketNft.css';


function MyNftDisplay({contract}) {
    const[data,setData] =useState([]);
    const[dataFetched,setdataFetched]=useState(true);
    const[totalPrice,setTotalPrice]=useState("0");

    async function getNfts(){
        let mytransaction = await contract.getMyNfts();
        let sumPrice=0;
        console.log(mytransaction);

        const items = await Promise.all(mytransaction.map(async i=>{
          console.log(i.tokenID);
            const  tokenURI = await contract.tokenURI(i.tokenID);
            console.log("getting token uri :",tokenURI);
            let meta = await axios.get(tokenURI);
            meta=meta.data;
            console.log(meta);
            let price =  ethers.utils.formatUnits(i.price.toString(),'ether');
            let item={
                price,
                tokenID :i.tokenID.toNumber(),
                seller: i.seller,
                owner:i.owner,
                image:meta.image,
                name:meta.name,
                description:meta.description
            }
            sumPrice+=Number(price);
            return item;
        }));
        console.log(items);
        setData(items);
        setdataFetched(true);
        setTotalPrice(sumPrice.toPrecision(3));
        console.log(data);
        console.log(sumPrice);
    }
    useEffect(()=>{
      getNfts();
    },[]);

  return (
    <div className='total'>
      <div className="Inside">
        {
            data.map((value , index)=>{
                return (<NftDiaplay data={value} key={index}></NftDiaplay>) 
            })
        }
      </div>
    </div>
  )
}

export default MyNftDisplay
