import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignCount = await contract.methods.nextCampaignId().call();
        const loadedCampaigns = [];
        for (let i = 0; i < campaignCount; i++) {
          const campaign = await contract.methods.campaigns(i).call();
          loadedCampaigns.push({
            id: i,
            ...campaign,
            pledgeCost: web3.utils.fromWei(campaign.pledgeCost, 'ether'),
            fundsRaised: web3.utils.fromWei(campaign.fundsRaised, 'ether'),
          });
        }
        setCampaigns(loadedCampaigns);
      } catch (err) {
        console.error("Error fetching campaigns:", err.message);
      }
    };
    fetchCampaigns();
  }, []);

  const handlePledge = async (id, pledgeCost) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.pledge(id, 1).send({
        from: accounts[0],
        value: web3.utils.toWei(pledgeCost, 'ether'),
      });
      alert('Pledge successful!');
    } catch (err) {
      alert(`Error during pledge: ${err.message}`);
    }
  };

  const handleCancel = async (id) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.cancelCampaign(id).send({ from: accounts[0] });
      alert('Campaign cancelled successfully!');
    } catch (err) {
      alert(`Error during cancellation: ${err.message}`);
    }
  };

  const handleFulfill = async (id) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.completeCampaign(id).send({ from: accounts[0] });
      alert('Campaign fulfilled successfully!');
    } catch (err) {
      alert(`Error during fulfillment: ${err.message}`);
    }
  };

  return (
    <div className="campaign-list">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Entrepreneur</th>
            <th>Title</th>
            <th>Pledge Cost (ETH)</th>
            <th>Backers</th>
            <th>Pledges Left</th>
            <th>Your Pledges</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns
            .filter((campaign) => parseInt(campaign.state) === 0) // Only active campaigns
            .map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.entrepreneur}</td>
                <td>{campaign.title}</td>
                <td>{campaign.pledgeCost}</td>
                <td>{campaign.pledgesCount}</td>
                <td>{campaign.pledgesNeeded - campaign.pledgesCount}</td>
                <td>{campaign.yourPledges || 0}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm mx-1"
                    onClick={() => handlePledge(campaign.id, campaign.pledgeCost)}
                  >
                    Pledge
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => handleCancel(campaign.id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-warning btn-sm mx-1"
                    onClick={() => handleFulfill(campaign.id)}
                    disabled={campaign.pledgesCount < campaign.pledgesNeeded}
                  >
                    Fulfill
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignList;