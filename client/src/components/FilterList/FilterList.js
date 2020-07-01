import './FilterList.css';

import { COST, IMPRESSIONS } from '../../constants/filter_constant';
import { NumericMenu, RefinementList } from 'react-instantsearch-dom';

import React from 'react';

const FILTER_ITEMS = [
  {
    label: 'U.S States',
    component: (
      <RefinementList
        attribute="data.geoTarget"
        limit={5}
        searchable
        showMore
      />
    ),
  },
  {
    label: 'Impressions',
    component: (
      <NumericMenu attribute="data.impressionsMin" items={IMPRESSIONS} />
    ),
  },
  {
    label: 'USD Spent',
    component: <NumericMenu attribute="data.spendMin" items={COST} />,
  },
  {
    label: 'Gender',
    component: <RefinementList attribute="data.genderTarget" />,
  },
];

const FilterList = () => {
  const list = FILTER_ITEMS.map((item, index) => (
    <div className="filter-item" key={index}>
      <p className="filter-text">{item.label}</p>
      {item.component}
    </div>
  ));

  return <div className="search-panel__filters">{list}</div>;
};

export default FilterList;
