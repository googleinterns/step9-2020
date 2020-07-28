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
            <li>Headline: {ad.data().headline}</li>
            <li>Content: {ad.data().content}</li>
            <li>Advertiser: {ad.data().advertiser}</li>
            <li><a href={ad.data().link} target="_blank">{ad.data().link}</a></li>
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
        <p>
          Here are other ads with a headline sentiment score 
          of {props.headlineScore} and a content sentiment score 
          of {props.contentScore}.
        </p> 
        <div>{results}</div>
      </div>
    </div>
  );
};

export default SimilarAds;
