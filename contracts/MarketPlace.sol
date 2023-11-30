// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract MarketPlace is ERC721URIStorage{
    address payable owner;
    uint public tokenId;
    uint public itemSold;

    uint256 public listPrice = 0.001 ether;

    string[] public messages;

    mapping(uint256=>uint256) votes;

    constructor () ERC721("NFT_MARKET" , "NFT"){
        owner =payable(msg.sender);
    }

    struct ItemList{
        uint tokenID;
        address payable owner;
        address payable seller;
        uint price;
        bool currentlyListed;
    }

    event ItemListSuccess(
        uint tokenID,
        address owner,
        address seller,
        uint price,
        bool currentlyListed
    );

    event messageSent(string _message , address sender);

    event VoteCast(uint _tokenId , address sender);

    mapping(uint256 => ItemList) public TokenItemList; 
    
    function updateListPrice(uint256 _listPrice) public payable {
        listPrice=_listPrice;
    }
    function getListPrice()public view returns (uint256){
        return listPrice;
    }
    function getLatestItemList()public view  returns (ItemList memory){
        return TokenItemList[tokenId];
    }
    function getMyItemList(uint tokenNo) public  view returns(ItemList memory){
        return TokenItemList[tokenNo];
    }
    function getTokeId()public  view returns (uint){
        return tokenId;
    }
    function mint(string memory tokenURI , uint256 price) external payable   returns (uint){
        require(msg.value==listPrice,"Send enough ether to list !!!");
        require(price>0,"Price of the NFT should be greater than zero !!!");
        tokenId++;
        _safeMint(msg.sender,tokenId);
        _setTokenURI(tokenId, tokenURI);

        createListedToken(tokenId,price);

        return  tokenId;
    }
    function createListedToken(uint newtokenId , uint256 newPrice)private {
        TokenItemList[newtokenId]=ItemList(
            newtokenId,
            payable (address(this)),
            payable (msg.sender),
            newPrice,
            true
        );
        _transfer(msg.sender, address(this), tokenId);
        emit ItemListSuccess(
            newtokenId,
            address(this),
            msg.sender,
            newPrice,
            true
        );
    }
    function getAllNfts()public view returns (ItemList[] memory){
        ItemList[] memory tokens = new ItemList[](tokenId);
        uint currentIndex=0;
        uint currentId ;
        for(uint i=0;i<tokenId;i++){
            currentId=i+1;
            ItemList storage currentToken = TokenItemList[currentId];
            tokens[currentIndex]=currentToken;
            currentIndex++;
        }
        return tokens;
    }
    function getMyNfts()public view returns (ItemList[] memory){
        uint itemcount=0;
        uint currentIndex = 0;
        uint currentId;
        for(uint i=0;i<tokenId;i++){
            if(TokenItemList[i+1].owner==msg.sender||TokenItemList[i+1].seller==msg.sender){
                itemcount++;
            }
        }
        ItemList[] memory tokens = new ItemList[](itemcount);
        for(uint i=0;i<tokenId;i++){
            if(TokenItemList[i+1].owner==msg.sender||TokenItemList[i+1].seller==msg.sender){
                currentId=i+1;
                ItemList storage currentToken = TokenItemList[currentId];
                tokens[currentIndex]=currentToken;
                currentIndex++;
            }
        }
        return tokens;
    }
    function excecutesales(uint _tokenId)public payable {
        uint  price = TokenItemList[_tokenId].price;
        address seller = TokenItemList[_tokenId].seller;
        require(msg.value==price,"Please submit the correct token price");

        TokenItemList[_tokenId].currentlyListed=true;
        TokenItemList[_tokenId].seller=payable (msg.sender);
        itemSold++;

        _transfer(address(this), msg.sender, _tokenId);
        approve(address(this), _tokenId);

        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }
    function messaging(string memory _message)public{
        messages.push(_message);
        emit messageSent(_message,msg.sender);
    }
    function getMessageLength()public view returns (uint256){
        return messages.length;
    }
    function Voting(uint _tokenId)public{
        votes[_tokenId]++;
        emit VoteCast(_tokenId,msg.sender);
    }
}