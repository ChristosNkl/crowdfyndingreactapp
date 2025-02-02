import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import contract from '../utils/contract';

const FulfilledCampaigns = () => {
  const [fulfilledCampaigns, setFulfilledCampaigns] = useState([]);

  useEffect(() => {
    const fetchFulfilledCampaigns = async () => {
      try {
        const campaignCount = await contract.methods.nextCampaignId().call();
        const fulfilled = [];
        for (let i = 0; i < campaignCount; i++) {
          const campaign = await contract.methods.campaigns(i).call();
          if (parseInt(campaign.state) === 2) {
            fulfilled.push({
              id: i,
              ...campaign,
              pledgeCost: web3.utils.fromWei(campaign.pledgeCost, 'ether'),
              fundsRaised: web3.utils.fromWei(campaign.fundsRaised, 'ether'),
            });
          }
        }
        setFulfilledCampaigns(fulfilled);
      } catch (err) {
        console.error("Error fetching fulfilled campaigns:", err.message);
      }
    };
    fetchFulfilledCampaigns();
  }, []);

  return (
    <div className="fulfilled-campaigns">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Entrepreneur</th>
            <th>Title</th>
            <th>Pledge Cost (ETH)</th>
            <th>Funds Raised (ETH)</th>
            <th>Backers</th>
          </tr>
        </thead>
        <tbody>
          {fulfilledCampaigns.map((campaign, index) => (
            <tr key={index}>
              <td>{campaign.entrepreneur}</td>
              <td>{campaign.title}</td>
              <td>{campaign.pledgeCost}</td>
              <td>{campaign.fundsRaised}</td>
              <td>{campaign.pledgesCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FulfilledCampaigns;
