import React, { useEffect, useState } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';
import CreateCampaignForm from './CreateCampaignForm';
import CampaignList from './CampaignList';
import ControlPanel from './ControlPanel';
import FulfilledCampaigns from './FulfilledCampaigns';
import CancelledCampaigns from './CancelledCampaigns';
import Header from './Header';

const App = () => {
  const [contractDestroyed, setContractDestroyed] = useState(false);

  useEffect(() => {
    const checkContractStatus = async () => {
      try {
        await contract.methods.owner().call();
      } catch (error) {
        setContractDestroyed(true);
      }
    };
    checkContractStatus();
  }, []);

  return (
    <div className="container my-4">
      <Header />
      <div className="card shadow my-3 p-3">
        <CreateCampaignForm contractDestroyed={contractDestroyed} />
      </div>

      <h3 className="my-4">Live Campaigns</h3>
      <div className="card shadow p-3 mb-4">
        <CampaignList contractDestroyed={contractDestroyed} />
      </div>

      <h3>Fulfilled Campaigns</h3>
      <div className="card shadow p-3 mb-4">
        <FulfilledCampaigns />
      </div>

      <h3>Cancelled Campaigns</h3>
      <div className="card shadow p-3 mb-4">
        <CancelledCampaigns contractDestroyed={contractDestroyed} />
      </div>

      <h3>Control Panel</h3>
      <div className="card shadow p-3">
        <ControlPanel contractDestroyed={contractDestroyed} />
      </div>
    </div>
  );
};

export default App;
