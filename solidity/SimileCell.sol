pragma solidity ^0.8.1;

import './CellContract.sol';

contract SimileCell is CellContract{
    // store metadata for each hash
    struct HashData{
        address hashOwner;
        address[] votersList;
        mapping(address => uint) votes;
        uint hashIndexPointer;        
    }

    // map the hash with the struct containing its metadata
    mapping(bytes32 => HashData) private fullHashes;

    // events emitted for updated hashes and new votes
    event LogNewVote(address indexed from, bytes32 indexed fileHash, uint vote);
    event LogFileUpdated(address indexed from, bytes32 indexed oldFileHash, bytes32 indexed newFileHash);
    

    constructor (bytes8 index){
        require(dggsIndex.length != 0, "Empty dggsIndex");
        dggsIndex = index;
        
    }

    // check that the hash exists
    modifier ifHashExist(bytes32 fileHash){
        require((fileHash.length != 0), "Empty file hash");
        require(fileExist(fileHash), "The file does not exists");
        _;
    }

    //check that the message sender is the owner of the hash
    modifier hashOwnerOnly(bytes32 fileHash){
        require(fullHashes[fileHash].hashOwner == msg.sender, "Not file owner");
        _;
    }
 
    // return if the hash exists
    function fileExist(bytes32 fileHash) public view returns (bool){
        require((fileHash.length != 0), "Empty file hash");
        if (fileHashes.length == 0) return false;
        return (fileHashes[fullHashes[fileHash].hashIndexPointer] == fileHash);
    }

    // return if the address already voted the hash
    function alreadyVoted(bytes32 fileHash, address voter) external view returns (bool){
        return (fullHashes[fileHash].votes[voter] != 0);
    }

    // add the hash to the list
    function addHash(bytes32 fileHash) public override{
        require((fileHash.length != 0), "Empty file hash");
        require(!fileExist(fileHash), "The file already exists");
        fullHashes[fileHash].hashOwner = msg.sender;
        fullHashes[fileHash].hashIndexPointer = fileHashes.length;
        fileHashes.push(fileHash);
        emit LogFileAdded(msg.sender, fileHash);
    }

    // get the owner of the hash
    function getHashOwner(bytes32 fileHash) external view ifHashExist(fileHash) returns(address){
        return (fullHashes[fileHash].hashOwner);
    }

    // get the list of voters of the hash
    function getHashVoters(bytes32 fileHash) external view ifHashExist(fileHash) returns(address[] memory){
        return fullHashes[fileHash].votersList;
    }

    // get the voter in the list at the specified index
    function getVoterWithIndex(bytes32 fileHash, uint index) external view ifHashExist(fileHash) returns (address){
        require(index < fullHashes[fileHash].votersList.length, "Array index out of bounds");
        return (fullHashes[fileHash].votersList[index]);
    } 

    // get the vote of the address for the file
    function getVote(bytes32 fileHash, address voter) external view ifHashExist(fileHash) returns(uint){
        require (fullHashes[fileHash].votes[voter] != 0, "The user did not vote this file");
        return fullHashes[fileHash].votes[voter];
    }

    // get the number of votes for the file
    function getVoteCount(bytes32 fileHash) external view ifHashExist(fileHash) returns(uint){
        return fullHashes[fileHash].votersList.length;
    }
    
    // delete the hash from the list
    function deleteHash (bytes32 fileHash) public override hashOwnerOnly(fileHash) ifHashExist(fileHash){
        uint rowToDelete = fullHashes[fileHash].hashIndexPointer;
        fullHashes[fileHashes[fileHashes.length - 1]].hashIndexPointer = rowToDelete;
        deleteHashWithIndex(rowToDelete);
        emit LogFileDeleted(msg.sender, fileHash);
    }

    // remove the old hash from the list and add the new one
    function updateHash(bytes32 oldFileHash, bytes32 newFileHash) public hashOwnerOnly(oldFileHash) ifHashExist(oldFileHash){
        require((newFileHash.length != 0), "Empty file hash");
        fullHashes[newFileHash].hashOwner = msg.sender;
        fullHashes[newFileHash].hashIndexPointer = fileHashes.length;
        fileHashes.push(newFileHash);
        uint rowToDelete = fullHashes[oldFileHash].hashIndexPointer;
        fullHashes[fileHashes[fileHashes.length - 1]].hashIndexPointer = rowToDelete;
        deleteHashWithIndex(rowToDelete);
        emit LogFileUpdated(msg.sender, oldFileHash, newFileHash);
    }
    
    // store the vote for the file
    function voteFile(bytes32 fileHash, uint vote) public ifHashExist(fileHash){
        require (fullHashes[fileHash].votes[msg.sender] == 0, "Already voted");
        require ((vote == 1) || (vote == 2), "Invalid vote. Vote 1 for downvote or 2 for upvote");
        fullHashes[fileHash].votersList.push(msg.sender);
        fullHashes[fileHash].votes[msg.sender] = vote;
        emit LogNewVote(msg.sender, fileHash, vote);
    }
}