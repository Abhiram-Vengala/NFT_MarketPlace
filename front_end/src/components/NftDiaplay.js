import React from 'react';
import { GetIpfsUrlFromPinata } from '../utils';
import { Link, Route, Routes } from 'react-router-dom';
import NftPage from './NftPage';
import './DisplayNft.css';

function NftDiaplay(data) {
  const newTo = {
    pathname: "/nftpage/" + data.data.tokenID
  };
  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);
  const nftname = data.data.name;
  const nftdes = data.data.description;
  console.log(IPFSUrl);
  console.log(data);
  return (
    <Link params={{ nftdata: data }} to={newTo} className='link'>
      <div className='tile'>
        <img src={IPFSUrl} id='images' crossOrigin='anonymous' />
        <h2 id='text'>{nftname}</h2>
        <h2 id='textone'>{nftdes} </h2>
      </div>
    </Link>
  )
}

export default NftDiaplay
