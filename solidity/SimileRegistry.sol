pragma solidity ^0.8.1;

import './SimileCell.sol';
import './RegistryContract.sol';
import './CellContract.sol';


contract SimileRegistry is RegistryContract{


    constructor (uint resolution) RegistryContract(resolution){
        require((resolution >= 0 && resolution <= 30), "Invalid S2 resolution");
        
    }

    // add the index to the registry and creates the cell contract
    function addAddress(bytes8 dggsIndex) public override{
        require(dggsIndex.length != 0, "Empty dggsIndex");
        require(cellAddresses[dggsIndex] == address(0), "DGGS index already exists");
        SimileCell newCell = new SimileCell(dggsIndex);
        cellAddresses[dggsIndex] = address(newCell);
        addedIndexes.push(dggsIndex);
        emit LogNewCell(msg.sender, dggsIndex, address(newCell));      
    }

    
}