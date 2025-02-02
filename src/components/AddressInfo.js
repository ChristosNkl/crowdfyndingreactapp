import React, { useEffect, useState } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';

const AddressInfo = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [collectedFees, setCollectedFees] = useState('0');

  useEffect(() => {
    const fetchAddressInfo = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);

        const owner = await contract.methods.owner().call();
        setOwnerAddress(owner);

        const balance = await web3.eth.getBalance(contract.options.address);
        setContractBalance(web3.utils.fromWei(balance, 'ether'));

        const fees = await contract.methods.collectedFees().call();
        setCollectedFees(web3.utils.fromWei(fees, 'ether'));
      } catch (err) {
        console.error('Error fetching contract info:', err.message);
      }
    };

    fetchAddressInfo();
  }, []);

  return (
    <div>
      <h3>Connected Account: {currentAccount}</h3>
      <h3>Owner: {ownerAddress}</h3>
      <h3>Contract Balance: {contractBalance} ETH</h3>
      <h3>Collected Fees: {collectedFees} ETH</h3>
    </div>
  );
};

export default AddressInfo;
