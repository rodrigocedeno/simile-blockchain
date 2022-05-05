/* eslint-disable */
const ipfsClient = require("ipfs-http-client")
const uint8arrays = require('uint8arrays')
const hashing = require("ipfs-only-hash");
const bs58 = require('bs58');
const Web3 = require('web3');
const S2 = require('s2-geometry').S2;
const toBuffer = require("it-to-buffer");
//connect to Velas testnet
const web3 = new Web3(new Web3.providers.HttpProvider('https://evmexplorer.testnet.velas.com/rpc'));
//connect to IPFS through the Infura gateway
const ipfs = ipfsClient.create({host : "ipfs.infura.io", port : "5001", protocol: "https"});
const resolution = 23;  //S2 resolution of the registry

//remove this variables
// var wallettAddress = "0xFfA3EB5EB915b17AC4fA258081217097D39a9b4E"; 
// var walletKey = "b6593a73e28a339f8de0543edb137fc9f4b6a37734634df353f33cb69e5b4385"

//ABI of the solidity registry contract. Change this if the contract is updated
const registryABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "resolution",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes8",
				"name": "dggsIndex",
				"type": "bytes8"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "cellAddress",
				"type": "address"
			}
		],
		"name": "LogNewCell",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes8",
				"name": "dggsIndex",
				"type": "bytes8"
			}
		],
		"name": "addAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllIndexes",
		"outputs": [
			{
				"internalType": "bytes8[]",
				"name": "",
				"type": "bytes8[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes8",
				"name": "dggsIndex",
				"type": "bytes8"
			}
		],
		"name": "getCellAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCellCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "arrayPosition",
				"type": "uint256"
			}
		],
		"name": "getIndex",
		"outputs": [
			{
				"internalType": "bytes8",
				"name": "",
				"type": "bytes8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getResolution",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes8",
				"name": "dggsIndex",
				"type": "bytes8"
			}
		],
		"name": "indexExist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

//ABI of the solidity cell contract. Change this if the contract is updated
const cellABI = [
	{
		"inputs": [
			{
				"internalType": "bytes8",
				"name": "index",
				"type": "bytes8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newFileHash",
				"type": "bytes32"
			}
		],
		"name": "LogFileAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "deleteFileHash",
				"type": "bytes32"
			}
		],
		"name": "LogFileDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "oldFileHash",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newFileHash",
				"type": "bytes32"
			}
		],
		"name": "LogFileUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "vote",
				"type": "uint256"
			}
		],
		"name": "LogNewVote",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			}
		],
		"name": "addHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "alreadyVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			}
		],
		"name": "deleteHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			}
		],
		"name": "fileExist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllHashes",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDGGSIndex",
		"outputs": [
			{
				"internalType": "bytes8",
				"name": "",
				"type": "bytes8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getHashCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getHashFromIndex",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			}
		],
		"name": "getHashOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			}
		],
		"name": "getHashVoters",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "getVote",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			}
		],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getVoterWithIndex",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "oldFileHash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "newFileHash",
				"type": "bytes32"
			}
		],
		"name": "updateHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "vote",
				"type": "uint256"
			}
		],
		"name": "voteFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const registryAddress = "0xB95E907ef1Ad5c365c78201Bd8A51623F44c76b7"; //address of the deployed registry contract
//create web3 contract instance of the registry 
const registryContract = new web3.eth.Contract(registryABI, registryAddress); 

//getUserObservations();

export function test(){
	return 1;
}


//get the sha-256 hash of the file
async function getFileHashHex(file){
	var hash = await hashing.of(file);
	const hashHexArray = bs58.decode(hash);
	var hashHex = uint8arrays.toString(hashHexArray, "base16");
	var shortHash = hashHex.slice(4);
	return shortHash;
}

//get the IPFS multihash of a 32-bytes sha-256 hash
export function getIpfsMultihash(shortHashHex){
	var fullHash = "1220" + shortHashHex;
	var hashArray = uint8arrays.fromString(fullHash, "base16");
	var multiHash = bs58.encode(hashArray);
	return multiHash;
}

//upload the file to IPFS
async function uploadToIpfs(file) { 
	var result = await ipfs.add({content : file});
	return result.path;
}

//read from IPFS at the specified path
export async function readFromIpfs(multiHash){
	var bufferedContents = await toBuffer(ipfs.cat(multiHash));
	var contents = uint8arrays.toString(bufferedContents);
	return contents;
}

//convert latitude and longitude to S2 index (hexadecimal with 0x prefix)
function getS2IndexHex(lat, lng){
	var key = S2.latLngToKey(lat, lng, resolution);
	var index = BigInt(S2.keyToId(key));
	return addHexPrefix(index.toString(16));
}

//convert S2 index (hexadecimal wihtout 0x prefix) to coordinates
export function getCoordFromIndex(index){
	var indexDec = hexToDec(index);
	var latlng = S2.idToLatLng(indexDec);
	return latlng;
}

function hexToDec(s) {
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}

//add 0x to the string
function addHexPrefix(hexString){
	return "0x" + hexString;
}

//remove 0x from the string
export function removeHexPrefix(hexString){
	return hexString.slice(2);
}

//add the hash to the cell contract and upload the file to IPFS
export async function addObservation(lat, lng, observationFile, wallettAddress, privateKey){
	var s2Index = getS2IndexHex(lat, lng);	
	var fileHash = await getFileHashHex(observationFile);
	fileHash = addHexPrefix(fileHash);
	var cellAddress;
	if (await indexExistTx(s2Index)){
		cellAddress = await getCellAddressTx(s2Index);
		
	}else{
		await addAddressTx(s2Index, wallettAddress, privateKey);
		cellAddress = await getCellAddressTx(s2Index);
	}

	if (!(await fileExistTx(cellAddress, fileHash))){
		var txReceipt = await addFileTx(fileHash, cellAddress, wallettAddress, privateKey);
		
		if (txReceipt.status){
			var ipfsAddress = await uploadToIpfs(observationFile);
			return "File uploaded. Available at ipfs address: " +  ipfsAddress; 
		}else{
			return "Upload failed";
		}
	}else{
		return "The file already exist";
	}	
}

//store the vote in the cell contract
async function voteObservation(fileHash, s2Index, vote, wallettAddress, privateKey){
	s2Index = addHexPrefix(s2Index);
	if (await indexExistTx(s2Index)){
		var cellAddress = await getCellAddressTx(s2Index);
		
	}else{
		return "The S2 index is not in the registry";
	}

	if (!(await fileExistTx(cellAddress, fileHash))){
		return "The file does not exist";
	}

	if (!(await alreadyVotedTx(cellAddress, fileHash, wallettAddress))){
		await voteFileTx(fileHash, vote, cellAddress, wallettAddress, privateKey);
		return "Vote registred";
	}else{
		return "Observation already voted";
	}	
}

//update the hash in the cell contract and upload new file to IPFS
async function updateObservation(oldFileHash, newObservationFile, s2Index, wallettAddress, privateKey){
	s2Index = addHexPrefix(s2Index);
	if (await indexExistTx(s2Index)){
		var cellAddress = await getCellAddressTx(s2Index);
		
	}else{
		return "The S2 index is not in the registry";
	}

	
	if (!(await fileExistTx(cellAddress, oldFileHash))){
		return "The file does not exist";
	}

	var fileOwner = await getHashOwnerTx(cellAddress, oldFileHash);

	if (fileOwner != wallettAddress){
		return "Not owner of this observation";
	}

	var newFileHash = await getFileHashHex(newObservationFile);
	newFileHash = addHexPrefix(newFileHash);

	if ((await fileExistTx(cellAddress, newFileHash))){
		return "The new file already exists";
	}

	var txReceipt = await updateFileTx(oldFileHash, newFileHash, cellAddress, wallettAddress, privateKey);

	if (txReceipt.status){
		var ipfsAddress = await uploadToIpfs(newObservationFile);
		return "File updated. New file available at ipfs address: " +  ipfsAddress; 
	}else{
		return "Upload failed";
	}
}

//remove the hash from the cell contract
async function deleteObservation(fileHash, s2Index, wallettAddress, privateKey){
	s2Index = addHexPrefix(s2Index);
	if (await indexExistTx(s2Index)){
		var cellAddress = await getCellAddressTx(s2Index);
		
	}else{
		return "The S2 index is not in the registry";
	}
	
	if (!(await fileExistTx(cellAddress, fileHash))){
		return "The file does not exist";
	}

	var fileOwner = await getHashOwnerTx(cellAddress, fileHash);

	if (fileOwner != wallettAddress){
		return "Not owner of this observation";
	}

	await deleteFileTx(fileHash, cellAddress, wallettAddress, privateKey);

	return "File deleted";
}

//get all the hashes stored in the contracts, grouped by S2 index
export async function getObservations(){
	var cellAddresses = await getAllAddresses();
	var observations = await getAllHashes(cellAddresses);
	return observations;	
}

//get all the hashes saved by the current user, grouped by S2 index
async function getUserObservations(wallettAddress){
	var cellAddress = await getAllAddresses();
	var userObservations = await getAllUserHashes(cellAddress, wallettAddress);
	return userObservations;
}

//get all the addresses of the cells saved in the registry
async function getAllAddresses(){
	var indexes = await getIndexesTx();
	var cellAddressesPromises = [];
	indexes.forEach(index => {
		cellAddressesPromises.push(getCellAddressTx(index));
	});
	var cellAddresses = await Promise.all(cellAddressesPromises);
	return cellAddresses;
}

//get all the hashes from the cells in the address list
export async function getAllHashes(cellAddresses){
	var fileHashPromises = [];
	cellAddresses.forEach(address => {
		fileHashPromises.push(getHashes(address));
	});
	var fileHashes = await Promise.all(fileHashPromises);
	
	return fileHashes;
}

//get all the hashes from the cell
async function getHashes(cellAddress){
	var cell = {
		s2Index : await getDGGSIndexTx(cellAddress),
		fileHashes: await getHashesTx(cellAddress),
	}
	return cell;
}

////get all the hashes of the user from the cells in the address list
async function getAllUserHashes(cellAddresses, wallettAddress){
	var fileHashPromises = [];
	cellAddresses.forEach(address => {
		fileHashPromises.push(getUserHashes(address, wallettAddress));
	});
	var fileHashes = await Promise.all(fileHashPromises);
	
	return fileHashes;
}

//get all the hashes of the user from the cell
async function getUserHashes(cellAddress, wallettAddress){
	var fileHashes = await getHashesTx(cellAddress);
	var userFileHashes = [];
	var isOwnerPromises = [];
	fileHashes.forEach(hash => {
		isOwnerPromises.push(isHashOwner(cellAddress, hash, wallettAddress));
	});
	var isOwnerList = await Promise.all(isOwnerPromises);
	for (var i=0; i < fileHashes.length; i++){
		if (isOwnerList[i] == true){
			userFileHashes.push(fileHashes[i]);
		}
	}
	var cell = {
		s2Index : await getDGGSIndexTx(cellAddress),
		fileHashes: userFileHashes,
	}
	return cell;
}

//check if the user is owner of the hash
async function isHashOwner(cellAddress, fileHash, wallettAddress){
	var hashOwner = await getHashOwnerTx(cellAddress, fileHash);
	if (hashOwner == wallettAddress){
		return true;
	}else{
		return false;
	}
}

//get all the votes of the hash
async function getAllFileVotes(cellAddress, fileHash){
	var voters = await getHashVotersTx(cellAddress,fileHash);
	var votePromises = [];
	voters.forEach(voter => {
		votePromises.push(getVoteTx(cellAddress, fileHash, voter));
	});
	var votes = await Promise.all(votePromises);
	return votes;
}

//REGISTRY CONTRACT FUNCTIONS

async function addAddressTx(dggsIndex,wallettAddress, privateKey){
	var methodABI = registryContract.methods.addAddress(dggsIndex).encodeABI();
	var nonce = await web3.eth.getTransactionCount(wallettAddress, 'latest');
	var estGas = await registryContract.methods.addAddress(dggsIndex).estimateGas({from:wallettAddress});
	var gasPrice = await web3.eth.getGasPrice();
	var signedTx = await signTx(methodABI, nonce, wallettAddress, registryContract.options.address, estGas, gasPrice, privateKey);
	var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	return txReceipt;
}

async function indexExistTx(dggsIndex){
	var exist = await registryContract.methods.indexExist(dggsIndex).call();
	return exist;
}

async function getRegistryResolutionTx(){
	var registryResolution = await registryContract.methods.getResolution().call();
	return registryResolution;
}

async function getCellAddressTx(dggsIndex){
	var cellAddress = await registryContract.methods.getCellAddress(dggsIndex).call();
	return cellAddress;
}

async function getIndexesTx(){
	var indexes = await registryContract.methods.getAllIndexes().call();
	return indexes;
}

async function getCellCountTx(){
	var cellCount = await registryContract.methods.getCellCount().call();
	return cellCount;
}

async function getIndexTx(position){
	var index = await registryContract.methods.getIndex(position).call();
	return index;
}

//CELL CONTRACT FUNCTIONS

function getCellContract(cellAddress){
	var contract = new web3.eth.Contract(cellABI, cellAddress);
	return contract;
}

async function addFileTx(observationHash, cellAddress,wallettAddress, privateKey){
	var cellContract = getCellContract(cellAddress);
	var methodABI = cellContract.methods.addHash(observationHash).encodeABI();
	var nonce = await web3.eth.getTransactionCount(wallettAddress, 'latest');
	var estGas = await cellContract.methods.addHash(observationHash).estimateGas({from:wallettAddress});
	var gasPrice = await web3.eth.getGasPrice();
	var signedTx = await signTx(methodABI, nonce, wallettAddress, cellContract.options.address, estGas, gasPrice, privateKey);
	var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);	
	return txReceipt;	
}

async function deleteFileTx(observationHash, cellAddress,wallettAddress, privateKey){
	var cellContract = getCellContract(cellAddress);
	var methodABI = cellContract.methods.deleteHash(observationHash).encodeABI();
	var nonce = await web3.eth.getTransactionCount(wallettAddress, 'latest');
	var estGas = await cellContract.methods.deleteHash(observationHash).estimateGas({from:wallettAddress});
	var gasPrice = await web3.eth.getGasPrice();
	var signedTx = await signTx(methodABI, nonce, wallettAddress, cellContract.options.address, estGas, gasPrice, privateKey);
	var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	return txReceipt;
}

async function updateFileTx(oldObservationHash, newObservationHash, cellAddress,wallettAddress, privateKey){
	var cellContract = getCellContract(cellAddress);
	var methodABI = cellContract.methods.updateHash(oldObservationHash, newObservationHash).encodeABI();
	var nonce = await web3.eth.getTransactionCount(wallettAddress, 'latest');
	var estGas = await cellContract.methods.updateHash(oldObservationHash, newObservationHash).estimateGas({from:wallettAddress});
	var gasPrice = await web3.eth.getGasPrice();
	var signedTx = await signTx(methodABI, nonce, wallettAddress, cellContract.options.address, estGas, gasPrice, privateKey);
	var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	return txReceipt;
}

async function voteFileTx(observationHash, vote, cellAddress,wallettAddress, privateKey){
	var cellContract = getCellContract(cellAddress);
	var methodABI = cellContract.methods.voteFile(observationHash, vote).encodeABI();
	var nonce = await web3.eth.getTransactionCount(wallettAddress, 'latest');
	var estGas = await cellContract.methods.voteFile(observationHash, vote).estimateGas({from:wallettAddress});
	var gasPrice = await web3.eth.getGasPrice();
	var signedTx = await signTx(methodABI, nonce, wallettAddress, cellContract.options.address, estGas, gasPrice, privateKey);
	var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	return txReceipt;
}

async function getDGGSIndexTx(cellAddress){
	var cellContract = getCellContract(cellAddress);
	var index = await cellContract.methods.getDGGSIndex().call();
	return index;
}

async function getHashesTx(cellAddress){
	var cellContract = getCellContract(cellAddress);
	var hashesList = await cellContract.methods.getAllHashes().call();
	return hashesList;
}

async function getHashFromIndexTx(cellAddress, index){
	var cellContract = getCellContract(cellAddress);
	var fileHash = await cellContract.methods.getHashFromIndex(index).call();
	return fileHash;
}

async function getHashCountTx(cellAddress){
	var cellContract = getCellContract(cellAddress);
	var hashCount = await cellContract.methods.getHashCount().call();
	return hashCount;
}


async function getHashOwnerTx(cellAddress, fileHash){
	var cellContract = getCellContract(cellAddress);
	var owner = await cellContract.methods.getHashOwner(fileHash).call();
	return owner;
}

async function getHashVotersTx(cellAddress, fileHash){
	var cellContract = getCellContract(cellAddress);
	var voters = await cellContract.methods.getHashVoters(fileHash).call();
	return voters;
}

async function getVoterWithIndexTx(cellAddress,fileHash, index){
	var cellContract = getCellContract(cellAddress);
	var voter = await cellContract.methods.getVoterWithIndex(fileHash, index).call();
	return voter;
}

async function getVoteTx(cellAddress, fileHash, voter){
	var cellContract = getCellContract(cellAddress);
	var vote = await cellContract.methods.getVote(fileHash, voter).call();
	return vote;
}

async function getVoteCountTx(cellAddress, fileHash){
	var cellContract = getCellContract(cellAddress);
	var voteCount = await cellContract.methods.getVoteCount(fileHash).call();
	return voteCount;
}

async function fileExistTx(cellAddress, fileHash){
	var cellContract = getCellContract(cellAddress);
	var exist = await cellContract.methods.fileExist(fileHash).call();
	return exist;
}

async function alreadyVotedTx(cellAddress, fileHash, voterAddress){
	var cellContract = getCellContract(cellAddress);
	var voted = await cellContract.methods.alreadyVoted(fileHash, voterAddress).call();
	return voted;
}

//Sign the transactions with the private key 

async function signTx(ABI, nonce, from, to, gas, gasPrice, privateKey){
	var tx = {
		gas: gas,
		gasPrice: gasPrice,
		nonce: nonce,
		from: from,
    	to: to,
    	data: ABI		
	}
	
	var signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

	return signedTx;
}











