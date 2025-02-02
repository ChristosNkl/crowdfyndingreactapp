import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';

const ControlPanel = () => {
  const [newOwner, setNewOwner] = useState('');
  const [entrepreneurToBan, setEntrepreneurToBan] = useState('');
  const [message, setMessage] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      const accounts = await web3.eth.getAccounts();
      const owner = await contract.methods.owner().call();
      setIsOwner(accounts[0] === owner);
    };
    checkOwner();
  }, []);

  const handleWithdraw = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.withdrawFees().send({ from: accounts[0] });
      setMessage('Withdrawal successful!');
    } catch (err) {
      setMessage(`Error during withdrawal: ${err.message}`);
    }
  };

  const handleChangeOwner = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.changeOwner(newOwner).send({ from: accounts[0] });
      setMessage('Owner changed successfully!');
    } catch (err) {
      setMessage(`Error changing owner: ${err.message}`);
    }
  };

  const handleBanEntrepreneur = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.banEntrepreneur(entrepreneurToBan).send({ from: accounts[0] });
      setMessage('Entrepreneur banned successfully!');
    } catch (err) {
      setMessage(`Error banning entrepreneur: ${err.message}`);
    }
  };

  const handleDestroyContract = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.destroyContract().send({ from: accounts[0] });
      setMessage('Contract destroyed successfully!');
    } catch (err) {
      setMessage(`Error destroying contract: ${err.message}`);
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={handleWithdraw}
          className="btn btn-primary"
          disabled={!isOwner}
        >
          Withdraw
        </button>
      </div>
      <div>
        <input 
          type="text" 
          placeholder="Enter new owner's address" 
          value={newOwner} 
          onChange={(e) => setNewOwner(e.target.value)} 
          disabled={!isOwner}
        />
        <button
          onClick={handleChangeOwner}
          className="btn btn-warning"
          disabled={!isOwner}
        >
          Change Owner
        </button>
      </div>
      <div>
        <input 
          type="text" 
          placeholder="Enter entrepreneur's address" 
          value={entrepreneurToBan} 
          onChange={(e) => setEntrepreneurToBan(e.target.value)} 
          disabled={!isOwner}
        />
        <button
          onClick={handleBanEntrepreneur}
          className="btn btn-danger"
          disabled={!isOwner}
        >
          Ban Entrepreneur
        </button>
      </div>
      <div>
        <button
          onClick={handleDestroyContract}
          className="btn btn-dark"
          disabled={!isOwner}
        >
          Destroy Contract
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ControlPanel;

