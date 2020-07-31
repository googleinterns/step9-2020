import { database } from '../../firebase/firebase';
import React, { useState, useEffect } from 'react';

const SimilarAds = props => {

  const COLLECTION = 'ads';  
  const headlineSentiment = `{"score": ${props.headlineScore}, "magnitude": ${props.headlineMagnitude}}`;
  const contentSentiment = `{"score": ${props.contentScore}, "magnitude": ${props.contentMagnitude}}`;

  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchSimilarAds() {
      const similarAds = await database
          .collection(COLLECTION)
          .where('headlineSentiment', '==', headlineSentiment)
          .where('contentSentiment', '==', contentSentiment)
          .limit(9)
          .get();
      const resultItems = [];
      for (let ad of similarAds.docs) {
        resultItems.push(
          <ul className="similar-ad">
            <li>
              <span style={{fontWeight:'bold'}}>
                Headline
              </span>: {ad.data().headline}
            </li>
            <li>
              <span style={{fontWeight:'bold'}}>
                Content
              </span>: {ad.data().content}
            </li>
            <li>
              <span style={{fontWeight:'bold'}}>
                Advertiser
              </span>: {ad.data().advertiser}
            </li>
            <li>
              <span style={{fontWeight:'bold'}}>
                Link
              </span>: <a href={ad.data().link} target="_blank" 
                  rel="noopener noreferrer">
              {ad.data().link}</a>
            </li>
          </ul>
        );
      }
      setResults(resultItems);
    } 
    fetchSimilarAds();
  }, [])

  return (
    <div className="similar-container">
      <div className="similar-card">
        <h4>Similar Advertisements By Sentiment</h4>
        <p id="card-description">
          Here are other ads with a headline sentiment score 
          of {props.headlineScore}, headline magnitude 
          of {props.headlineMagnitude}, content sentiment score 
          of {props.contentScore}, and content magnitude 
          of {props.contentMagnitude}:
        </p> 
        <div className="results-container">{results}</div>
      </div>
    </div>
  );
};

export default SimilarAds;
