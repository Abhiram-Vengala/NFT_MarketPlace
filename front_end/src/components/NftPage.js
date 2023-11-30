import React, { useState } from 'react';
import { ethers } from 'ethers';
import MarketPlace from "../artifacts/contracts/MarketPlace.sol/MarketPlace.json";
import { GetIpfsUrlFromPinata } from '../utils';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './NftPage.css';

function NftPage(props) {
  console.log(props);
    const [data, setData] =useState([]);
    const [message,setMessage]=useState("");
    const [account , setAccount]=useState("");

    async function getNftData(tokenID){
      const provider =new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contract = new ethers.Contract(contractAddress,MarketPlace.abi,signer);
      var tokenURI = await contract.tokenURI(tokenID);
      const listedToken = await contract.getMyItemList(tokenID);
      tokenURI=GetIpfsUrlFromPinata(tokenURI);
      let meta = await axios.get(tokenURI);
      meta=meta.data;
      console.log(listedToken);
      let item = {
        price : meta.price,
        tokenID : tokenID,
        seller : listedToken.seller,
        owner : listedToken.owner,
        image : meta.image,
        name : meta.name,
        description : meta.description,
      }
      console.log(item);
      setData(item);
      setAccount(addr);
    }
    async function buyNft(tokenID){
      try{
        const provider =new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(contractAddress,MarketPlace.abi,signer);
        const salePrice = ethers.utils.parseUnits(data.price,'ether');
        setMessage("Buying the NFT... Please Wait");
        let transaction = await contract.excecutesales(tokenID,{value:salePrice});
        await transaction.wait();

        alert("Succesfully bought the NFT");
        setMessage("");
      }catch(e){
        alert("Upload error"+e);
      }
    }
    const {tokenID} = useParams();
    useState(()=>{
      getNftData(tokenID);
      if(typeof data.image=="string"){
        data.image=GetIpfsUrlFromPinata(data.image);
      }
    },[]);
  return (
    <div className='Box'>
      <img src={data.image} id='Image' crossOrigin='anonymous'/>
      <div className='Innerbox' >
        <div>
          Name : {data.name}
        </div>
        <div>
          Description : {data.description}
        </div>
        <div>
          Price : {data.price}
        </div>
        <div>
          Owner : {data.owner}
        </div>
        <div>
          seller : {data.seller}
        </div>
        <div>
          {account !== data.owner && account !== data.seller ? 
          <button className='enableButton' onClick={()=>buyNft(tokenID)}>Buy NFT</button>
          : <div> You are the owner of the NFT</div>
        }
        </div>
      </div>
    </div>
  )
}

export default NftPage
