import React from 'react';
import PropTypes from 'prop-types';

const AccountCard = ({ account }) => {
  const { platform, username, price, category, isSold } = account;

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isSold ? 'opacity-75' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold px-2 py-1 rounded ${
          platform === 'Instagram' ? 'bg-pink-100 text-pink-800' :
          platform === 'Snapchat' ? 'bg-yellow-100 text-yellow-800' :
          platform === 'TikTok' ? 'bg-purple-100 text-purple-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {platform}
        </span>
        {isSold && (
          <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
            Sold
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold mb-2">{username}</h3>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{category}</span>
        <span className="text-lg font-bold text-green-600">${price}</span>
      </div>
      {!isSold && (
        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Purchase
        </button>
      )}
    </div>
  );
};

AccountCard.propTypes = {
  account: PropTypes.shape({
    platform: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    isSold: PropTypes.bool.isRequired,
  }).isRequired,
};

export default AccountCard;
