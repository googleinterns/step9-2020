#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 23 16:07:17 2020

@author: robert
"""

# Imports the Google Cloud client library
from google.cloud.language import enums
from google.cloud import language
from google.cloud.language import types

import json

# See readme about how to setup mykey.json
CLIENT = language.LanguageServiceClient.from_service_account_json("analysis-key.json")
ENCODING_TYPE = enums.EncodingType.UTF8


def analyze_sentiment(text):
  """Applies sentiment analysis to an input string.
  
  Calls cloud language API once for sentiment analysis if input is a string. 
  Rounds sentiment and magnitude to tens place. 

  Args: 
    text: an input string.
  
  Returns: 
    A json string mapping score and magnitude keys to their corresponding
    value.
    
  Raises:
    TypeError: input is not a string.
  """
  
  if not isinstance(text, str): 
    raise TypeError("Input to analyze_sentiment isn't a string: {0}"
                    .format(text))
    
  document = types.Document(content=text, type=enums.Document.Type.PLAIN_TEXT)

  document_sentiment = \
      CLIENT.analyze_sentiment(document,encoding_type=ENCODING_TYPE) \
            .document_sentiment
            
  # Round to hundreds/tens place respectively 
  # because that is how control values are. See: 
  # https://cloud.google.com/natural-language#natural-language-api-demo
  rounded_score = round(document_sentiment.score, 2) 
  rounded_magnitude = round(document_sentiment.magnitude, 1)
  
  score_and_magnitude = json.dumps({"score": rounded_score, \
                                   "magnitude": rounded_magnitude})

  return score_and_magnitude

def analyze_entities(text):
  """Applies entity analysis to an input string.
  
  Calls cloud language API once for entity analysis if input is a string. 
  Rounds salience value to hundreds place. 
  
  Args: 
    text: an input string.
  
  Returns: 
    A list of json strings, where each json string maps 
    name/type/salience keys to their corresponding string/string/float
    values.
    
  Raises:
    TypeError: input is not a string.
  """
  
  if not isinstance(text, str): 
    raise TypeError("Input to analyze_entities isn't a string: {0}"
                    .format(text))
    
  document = types.Document(content=text, type=enums.Document.Type.PLAIN_TEXT)

  document_entities = \
      CLIENT.analyze_entities(document,encoding_type=ENCODING_TYPE) \
            .entities
  
  formatted_entities = []
  
  for entity in document_entities: 
    entity_name = entity.name
    entity_type = enums.Entity.Type(entity.type).name
    
    # Round to hundreds place because that is how control values are 
    # returned. See: 
    # https://cloud.google.com/natural-language#natural-language-api-demo
    entity_salience = round(entity.salience, 2)
    
    formatted_entity = json.dumps({"name": entity_name, \
                                   "type": entity_type, \
                                   "salience": entity_salience})
  
    formatted_entities.append(formatted_entity)
  
  return formatted_entities
