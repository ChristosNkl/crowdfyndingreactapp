import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';

const Header = () => {
  const [account, setAccount] = useState('');
  const [owner, setOwner] = useState('');
  const [balance, setBalance] = useState('');
  const [fees, setFees] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      setOwner(await contract.methods.owner().call());
      setBalance(web3.utils.fromWei(await web3.eth.getBalance(contract.options.address), 'ether'));
      setFees(web3.utils.fromWei(await contract.methods.collectedFees().call(), 'ether'));
    };
    fetchDetails();
  }, []);

  return (
    <header className="bg-light p-4 rounded shadow mb-4">
      <div className="container">
        <h3 className="mb-4 text-center">Crowdfunding DApp
        </h3>
        <h4 className="mb-4 text-center">Contract Details
        </h4>
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card shadow-sm p-3 border-primary">
              <h5 className="card-title">Connected Account</h5>
              <p className="card-text text-muted">{account}</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card shadow-sm p-3 border-primary">
              <h5 className="card-title">Owner</h5>
              <p className="card-text text-muted">{owner}</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card shadow-sm p-3 border-primary">
              <h5 className="card-title">Contract Balance</h5>
              <p className="card-text text-muted">{balance} ETH</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card shadow-sm p-3 border-primary">
              <h5 className="card-title">Collected Fees</h5>
              <p className="card-text text-muted">{fees} ETH</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;