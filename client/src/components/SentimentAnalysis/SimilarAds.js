import { database } from '../../firebase/firebase';
import React, { useState, useEffect } from 'react';

const SimilarAds = props => {

  const COLLECTION = 'ads';  
  const headlineSentiment = `{"score": ${props.headlineScore}, "magnitude": ${props.headlineMagnitude}}`;
  const contentSentiment = `{"score": ${props.contentScore}, "magnitude": ${props.contentMagnitude}}`;

  const [results, setResults] = useState([]);
  let resultItems = [];

  useEffect(() => {
    async function fetchSimilarAds() {
      
      let similarAdsPromises = [];
      similarAdsPromises.push(database.collection(COLLECTION)
            .where('headlineSentiment', '==', headlineSentiment)
            .where('contentSentiment', '==', contentSentiment)
            .limit(10)
            .get()
      ); 
      let similarAds = await Promise.all(similarAdsPromises);

      for (let ad of similarAds[0].docs) {
        resultItems.push(
          <div className="similar-ad">
            <p><b>Headline</b>: {ad.data().headline}</p>
            <p><b>Content</b>: {ad.data().content}</p>
            <p><b>Advertiser</b>: {ad.data().advertiser}</p>
            <p><b>Link</b>: <a href={ad.data().link} target="_blank" rel="noopener noreferrer">
              {ad.data().link}</a>
            </p>
          </div>
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
