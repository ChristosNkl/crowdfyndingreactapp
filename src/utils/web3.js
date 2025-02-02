import Web3 from 'web3';

const web3 = new Web3(window.ethereum);

if (typeof window.ethereum !== 'undefined') {
  window.ethereum.request({ method: 'eth_requestAccounts' });
} else {
  console.error('MetaMask is not installed. Please install it to use this app.');
}

export default web3;
