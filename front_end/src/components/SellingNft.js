import React from 'react';
import { ethers } from 'ethers';
import { uploadFileToIpfs, uploadJSONToIpfs } from '../pinata';	
import { useState } from 'react';
import './Create.css';

function SellingNft({contract,provider}) {
    const [formParams , setFormParams] = useState({name:'' , description:'',price:''});
    const [fileUrl,setFileUrl] = useState(null);
    const [message, setMessage] = useState('');
  
    async function handleUploadFile(e){
      var file = e.target.files[0];
      try{
        const response = await uploadFileToIpfs(file);
        if(response.success === true){
          console.log("uploaded image to the pinata :",response.pinataURL);
          setFileUrl(response.pinataURL);
        }
      }catch(e){
        console.log("Image is Not uploaded to pinata due to :",e);
      }
    }
    async function uploadMetadataToIpfs(){
      const {name , description,price} =formParams;
      if(!name||!description||!price||!fileUrl){
        setMessage("Please Fill all the fields");
        return -1;
      }
      const nftJSON = {
        name,description,price,image:fileUrl
      }
      try{
        const response= await uploadJSONToIpfs(nftJSON);
        if(response.success===true){
          console.log("Uploaded JSON to pinata", response)
          return response.pinataURL;
        }
      }catch(e){
        console.log("error uploading the JSON :",e);
      }
    }
    async function ListNft(e){
      e.preventDefault();
      try{
        const metadataUrl = await uploadMetadataToIpfs();
        setMessage("Upoloadig NFT ....");
        const price = ethers.utils.parseUnits(formParams.price,'ether');
        let listingPrice = await contract.getListPrice();
        listingPrice=listingPrice.toString();
  
        let transaction = await contract.mint(metadataUrl,price,{value:listingPrice});
        await transaction.wait();
  
        alert("successfully listed the nft");
        setMessage('');
        setFormParams({name:'',description:'',price:''});
  
      }catch(e){
        console.log(e);
      }
    }
    return (
      <div>
        <form className='form'>
          <label className='title'>Upload NFT To The MarketPlace </label>
          <div>
            <label>NFT Name</label>
            <input type='text' placeholder='name' id="name" onChange={e=>setFormParams({...formParams , name: e.target.value})} value={formParams.value}></input>
          </div>
          <div>
            <label>Nft Description</label>
            <textarea type='text' id='des' onChange={e=>setFormParams({...formParams,description:e.target.value})} value={formParams.description}></textarea>
          </div>
          <div>
            <label>Price (in ETH)</label>
            <input type='number' id='eth' placeholder='min 0.1 eth' onChange={e=>setFormParams({...formParams,price:e.target.value})} value={formParams.price} ></input>
          </div>
          <div>
            <label>Upload Image</label>
            <input type='file' id='img' onChange={handleUploadFile}></input>
          </div>
          <div>
            <div>{message}</div>
            <button onClick={ListNft} id='list'>List NFT</button>
          </div>
        </form>
      </div>
    )
}

export default SellingNft
