import { NumericMenu, RefinementList } from 'react-instantsearch-dom';

import React from 'react';

const IMPRESSIONS = [
  { label: 'All' },
  { label: '≤ 10K', end: 10000 },
  { label: '10K - 100K', start: 10001, end: 100000 },
  { label: '100K - 1M', start: 100001, end: 1000000 },
  { label: '1M - 10M', start: 1000001, end: 10000000 },
  { label: '> 10M', start: 10000001 },
];

const COST = [
  { label: 'All' },
  { label: '≤ $100', start: 0, end: 100 },
  { label: '$100 - $1,000', start: 101, end: 1000 },
  { label: '$1,000 - $50,000', start: 1001, end: 50000 },
  { label: '$50,000 - $100,000', start: 50001, end: 100000 },
  { label: '> $100,000', start: 100001 },
];

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

const FILTER_LIST = FILTER_ITEMS.map((item, index) => (
  <div className="filter-item" key={index}>
    <p className="filter-text">{item.label}</p>
    {item.component}
  </div>
));

export { FILTER_LIST };
