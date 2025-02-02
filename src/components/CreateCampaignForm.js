import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';

const CreateCampaignForm = () => {
  const [title, setTitle] = useState('');
  const [pledgeCost, setPledgeCost] = useState('');
  const [pledgesNeeded, setPledgesNeeded] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkIfOwner = async () => {
      const accounts = await web3.eth.getAccounts();
      const owner = await contract.methods.owner().call();
      setIsOwner(accounts[0] === owner);
    };
    checkIfOwner();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOwner) {
      alert('Owner cannot create campaigns');
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.createCampaign(title, web3.utils.toWei(pledgeCost, 'ether'), pledgesNeeded).send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether'),
      });
      alert('Campaign created successfully!');
    } catch (err) {
      alert(`Error creating campaign: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <h3>Create a New Campaign</h3>
      <div className="form-group mx-sm-3 mb-2">
        <input
          type="text"
          placeholder="Campaign Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="form-group mx-sm-3 mb-2">
        <input
          type="text"
          placeholder="Pledge Cost in ETH"
          value={pledgeCost}
          onChange={(e) => setPledgeCost(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="form-group mx-sm-3 mb-2">
        <input
          type="number"
          placeholder="Number of Pledges"
          value={pledgesNeeded}
          onChange={(e) => setPledgesNeeded(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary mb-2" disabled={isOwner}>
        Create
      </button>
      {isOwner && <p style={{ color: 'red' }}>Owner cannot create campaigns.</p>}
    </form>
  );
};

export default CreateCampaignForm;
