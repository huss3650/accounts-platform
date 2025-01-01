import React from 'react';
import PropTypes from 'prop-types';
import AccountCard from './AccountCard';

const AccountGrid = ({ accounts, filters }) => {
  const filteredAccounts = accounts.filter(account => {
    const { platform, category, showSold } = filters;
    return (
      (!platform || account.platform === platform) &&
      (!category || account.category === category) &&
      (showSold || !account.isSold)
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredAccounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
};

AccountGrid.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      isSold: PropTypes.bool.isRequired,
    })
  ).isRequired,
  filters: PropTypes.shape({
    platform: PropTypes.string,
    category: PropTypes.string,
    showSold: PropTypes.bool,
  }).isRequired,
};

export default AccountGrid;
