import './Visualization.css';

import {
  CHART_TYPES,
  X_VALUES,
  Y_VALUES,
} from '../../constants/visualization_constant';
import React, { useEffect, useState } from 'react';

import BarChart from './charts/BarChart';
import CustomSelect from '../CustomSelect/CustomSelect';
import Interpolation from './charts/Interpolation';
import ZoomLine from './charts/ZoomLine';
import { convertStringToObject } from '../../utils/Utils';
import { database } from '../../firebase/firebase';
import tardigrade from '../../images/tardigrade.png';

const Visualization = () => {
  const [chartType, setChartType] = useState('Zoomable Line');
  const [x, setX] = useState('Time');
  const [y, setY] = useState('USD Spent');
  const [data, setData] = useState([]);

  const spendData = [];
  const impressionData = [];
  const regionData = [];
  const genderData = [];
  const contentSentimentData = [];

  const handleChart = () => {
    const dataMap = {
      'USD Spent': spendData,
      Impressions: impressionData,
      Region: regionData,
      Gender: genderData,
      'Content Sentiment': contentSentimentData,
    };
    setData(dataMap[y]);
  };

  const handleDoc = doc => {
    const {
      startDate,
      endDate,
      impressionsMax,
      spendMax,
      geoTarget,
      genderTarget,
      contentSentiment,
    } = doc.data();
    const dateRange = [new Date(startDate), new Date(endDate)];
    const magnitude = convertStringToObject(contentSentiment).magnitude;
    dateRange.map(date => {
      spendData.push({ x: date, y: spendMax });
      impressionData.push({ x: date, y: impressionsMax });
      contentSentimentData.push({ x: date, y: magnitude });
      geoTarget.map(geo => regionData.push({ x: date, y: geo }));
      genderTarget.map(gender => genderData.push({ x: date, y: gender }));
    });
  };

  useEffect(() => {
    database
      .collection('ads')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => handleDoc(doc));
        handleChart();
      });
  }, [spendData, impressionData]);

  const chartMap = {
    'Zoomable Line': <ZoomLine data={data} />,
    Interpolation: <Interpolation data={data} />,
    'Vertical Bar': <BarChart data={data} />,
  };

  return (
    <div className="container">
      <header className="search-header center">
        <img src={tardigrade} className="logo" alt="logo" />
        <div className="search-body">
          <CustomSelect
            label={'chart types'}
            value={chartType}
            list={CHART_TYPES}
            setFunction={setChartType}
          />
          <CustomSelect
            disabled={true}
            label={'x-axis'}
            value={x}
            list={X_VALUES}
            setFunction={setX}
          />
          <CustomSelect
            label={'y-axis'}
            value={y}
            list={Y_VALUES}
            setFunction={setY}
          />
        </div>
      </header>
      <div className="center">{data.length > 0 && chartMap[chartType]}</div>
    </div>
  );
};

export default Visualization;
