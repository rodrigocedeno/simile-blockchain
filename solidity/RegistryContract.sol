pragma solidity ^0.8.1;

abstract contract RegistryContract{
    // the dggs resolution of the registry
    uint internal dggsResolution;
    
    // the address of the creator this registry
    address internal creator;

    // mapping of dggs indexes to the respective cell contracts
    mapping (bytes8 => address) internal cellAddresses;

    // array to keep track of existing indexes
    bytes8[] internal addedIndexes;

    // event emitted for creation of a new cell
    event LogNewCell(address indexed from, bytes8 indexed dggsIndex, address cellAddress);

    constructor(uint resolution){
        // add in the derived contracts a filter to check that the resolution is compliant with the chosen dggs
        creator = msg.sender;    
        dggsResolution = resolution;
    }

    // check that the dggs index exists in the registry
    modifier ifIndexExist (bytes8 dggsIndex){
        require(cellAddresses[dggsIndex] != address(0), "DGGS index does not exist");
        _;
    }

    // check that the message sender is the creator of the contract
    modifier creatorOnly(){
        require(creator == msg.sender, "Not creator");
        _;
    }

    // get the dggs resolution of the registry
    function getResolution() external view returns (uint){
        return (dggsResolution);
    }

    // return if the dggs index exists
    function indexExist(bytes8 dggsIndex) external view returns (bool){
        return (cellAddresses[dggsIndex] != address(0));
    }

    // return the address of the cell contract given an index
    function getCellAddress(bytes8 dggsIndex) external view ifIndexExist(dggsIndex) returns (address){
        require(dggsIndex.length != 0, "Empty dggsIndex");
        return (cellAddresses[dggsIndex]) ;
    }

    // return all existing indexes
    function getAllIndexes() external view returns (bytes8[] memory){
        return (addedIndexes);
    }

    // get the index at the specified position in the list
    function getIndex(uint arrayPosition) external view returns (bytes8){
        require(arrayPosition < addedIndexes.length, "Array index out of bounds");
        return addedIndexes[arrayPosition];
    }

    // get the number of cell saved in the registry
    function getCellCount() external view returns (uint){
        return (addedIndexes.length);
    }

    // add the index to the registry
    function addAddress(bytes8 dggsIndex) public virtual;
    
}