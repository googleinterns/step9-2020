import React, { useState } from 'react';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryChart,
  VictoryLine,
  VictoryZoomContainer,
} from 'victory';

import PropTypes from 'prop-types';

const COLOR = 'tomato';

const ZoomLine = props => {
  const { data } = props;
  const [zoomDomain, setZoomDomain] = useState();

  return (
    <div className="chart search-body center">
      <VictoryChart
        padding={120}
        width={800}
        height={800}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={setZoomDomain}
          />
        }
      >
        <VictoryLine
          style={{
            data: { stroke: COLOR },
          }}
          data={data}
          x="x"
          y="y"
        />
      </VictoryChart>
      <VictoryChart
        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
        width={500}
        height={100}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryBrushContainer
            brushDimension="x"
            brushDomain={zoomDomain}
            onBrushDomainChange={setZoomDomain}
          />
        }
      >
        <VictoryAxis tickFormat={x => new Date(x).getFullYear()} />
        <VictoryLine
          style={{
            data: { stroke: COLOR },
          }}
          data={data}
          x="x"
          y="y"
        />
      </VictoryChart>
    </div>
  );
};

ZoomLine.propTypes = {
  data: PropTypes.array,
};

export default ZoomLine;
