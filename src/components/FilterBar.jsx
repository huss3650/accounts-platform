import React from 'react';
import PropTypes from 'prop-types';

const FilterBar = ({ filters, setFilters }) => {
  const platforms = ['All', 'Instagram', 'Snapchat', 'TikTok', 'X'];
  const categories = ['All', 'Three-Letter', 'Four-Letter', 'Special'];

  return (
    <div className="bg-white shadow-md p-4 mb-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            className="w-full border rounded-md py-2 px-3"
            value={filters.platform || 'All'}
            onChange={(e) => setFilters({
              ...filters,
              platform: e.target.value === 'All' ? '' : e.target.value,
            })}
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full border rounded-md py-2 px-3"
            value={filters.category || 'All'}
            onChange={(e) => setFilters({
              ...filters,
              category: e.target.value === 'All' ? '' : e.target.value,
            })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={filters.showSold}
              onChange={(e) => setFilters({
                ...filters,
                showSold: e.target.checked,
              })}
            />
            <span className="ml-2 text-sm text-gray-700">Show Sold Accounts</span>
          </label>
        </div>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.shape({
    platform: PropTypes.string,
    category: PropTypes.string,
    showSold: PropTypes.bool,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default FilterBar;
