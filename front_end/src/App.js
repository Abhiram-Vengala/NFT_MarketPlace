import MarketPlace from './artifacts/contracts/MarketPlace.sol/MarketPlace.json';
import { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers'; import './App.css';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import MarketNft from './components/MarketNft';
import SellingNft from './components/SellingNft';
import MyNftDisplay from './components/MyNftDisplay';
import NftDiaplay from './components/NftDiaplay';
import NftPage from './components/NftPage';

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        })
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(contractAddress, MarketPlace.abi, signer);
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.log("MetaMask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <div className='nav'>
          <h2 className='logo'>NFT MARKETPLACE</h2>
          <nav className="middle" >
            <Link to="/profile">Profile</Link>
            <Link to="/">MarketPlace</Link>
            <Link to="/create">Create NFT</Link>
          </nav>
          <label>{account}</label>
        </div>
        <Routes>
          <Route path='/' element={<MarketNft contract={contract} provider={provider} />} />
          <Route path='/create' element={<SellingNft contract={contract} provider={provider} />} />
          <Route path='/profile' element={<MyNftDisplay contract={contract} />} />
          <Route path='/nftpage/:tokenID' element={<NftPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
