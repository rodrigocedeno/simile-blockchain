pragma solidity ^0.8.1;

abstract contract CellContract{

    // dggs index of the cell
    bytes8 internal dggsIndex;

    // store hashes with 32 bytes. Some hash could be longer (IPFS multihash) and need decoding to fit
    bytes32[] internal fileHashes;

    // address of the creator of the cell contract
    address internal creator;

    // events emitted for new hashes and deleted ones
    event LogFileAdded(address indexed from, bytes32 indexed newFileHash);
    event LogFileDeleted(address indexed from, bytes32 indexed deleteFileHash);
    
    // check that the message sender is the creator of the contract
    modifier creatorOnly(){
        require(creator == msg.sender, "Not creator");
        _;
    }

    // getter for state variables
    

     function getDGGSIndex() external view returns (bytes8){
        return (dggsIndex);
    }
    
     function getAllHashes() external view returns (bytes32[] memory){
        return (fileHashes);
    }

    function getHashFromIndex(uint index) external view returns (bytes32){
        require(index < fileHashes.length, "Array index out of bounds");
        return (fileHashes[index]);
    }

    function getHashCount() public view returns(uint count){
        return(fileHashes.length);
    }


    /* the method to add a new hash depends on the implementation. The easiest way is to push the new hash in the array
    if no other structure is required */
    function addHash(bytes32 hash) public virtual;

    // delete hash from the array at the specified index. This should be called by the function to delete a specific hash
    function deleteHashWithIndex(uint index) internal{
        fileHashes[index] = fileHashes[fileHashes.length - 1];
        fileHashes.pop();   
    }

    
    // abstract function to delete a specific hash. The implementation depends on the references used
    function deleteHash(bytes32 hashToDelete) public virtual;
     
}