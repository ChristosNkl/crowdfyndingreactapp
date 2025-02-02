import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';

const CancelledCampaigns = () => {
  const [cancelledCampaigns, setCancelledCampaigns] = useState([]);

  useEffect(() => {
    const fetchCancelledCampaigns = async () => {
      try {
        const campaignCount = await contract.methods.nextCampaignId().call();
        const cancelled = [];
        for (let i = 0; i < campaignCount; i++) {
          const campaign = await contract.methods.campaigns(i).call();
          if (parseInt(campaign.state) === 1) {
            cancelled.push({
              id: i,
              ...campaign,
              pledgeCost: web3.utils.fromWei(campaign.pledgeCost, 'ether'),
              fundsRaised: web3.utils.fromWei(campaign.fundsRaised, 'ether'),
            });
          }
        }
        setCancelledCampaigns(cancelled);
      } catch (err) {
        console.error("Error fetching cancelled campaigns:", err.message);
      }
    };
    fetchCancelledCampaigns();
  }, []);

  const handleClaimRefund = async (id) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.refundInvestor(id).send({ from: accounts[0] });
      alert('Refund claimed successfully!');
    } catch (err) {
      alert(`Error during refund: ${err.message}`);
    }
  };

  return (
    <div className="table-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Entrepreneur</th>
            <th>Title</th>
            <th>Pledge Cost (ETH)</th>
            <th>Funds Raised (ETH)</th>
            <th>Backers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cancelledCampaigns.map((campaign, index) => (
            <tr key={index}>
              <td>{campaign.entrepreneur}</td>
              <td>{campaign.title}</td>
              <td>{campaign.pledgeCost}</td>
              <td>{campaign.fundsRaised}</td>
              <td>{campaign.pledgesCount}</td>
              <td>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleClaimRefund(campaign.id)}
                >
                  Claim Refund
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancelledCampaigns;
