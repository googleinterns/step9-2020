#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 23 16:07:17 2020

@author: robert
"""

# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types

import json

# See readme about how to setup mykey.json
CLIENT = language.LanguageServiceClient.from_service_account_json("mykey.json")
ENCODING_TYPE = enums.EncodingType.UTF8

"""


"""
def round_to_1(number):
  """Rounds number to the nearest tenth. 

  Cloud language api will automatically return floats to like 15 decimal 
  places. It's convenient to just round down. 

  Args: 
    number: float or an int.
  
  Returns:
    a float to tens precisions.
  """
  
  return float(round(number, 1))

def round_to_2(number): 
  """Rounds number to the nearest hundreth.
  
  Args: 
    number: float or an int.
  
  Returns:
    a float to hundreds precisions.
  """
  
  return float(round(number, 2))



def analyze_sentiment(text):
  """Applies sentiment analysis to an input string.
  
  Calls cloud language API once for sentiment analysis if input is a string. 
  Rounds sentiment and magnitude to the nearest tenth for convenience. 

  Args: 
    text: an input string.
  
  Returns: 
    A json string mapping score and magnitude keys to their corresponding
    value.
    
  Raises:
    TypeError: input is not a string.
  """
  
  if not isinstance(text, str): 
    raise TypeError("Input to {0} isn't a string.".format("analyze_sentiment"))
    
  document = types.Document(content=text, type=enums.Document.Type.PLAIN_TEXT)

  document_sentiment = \
      CLIENT.analyze_sentiment(document,encoding_type=ENCODING_TYPE) \
            .document_sentiment
            
  tens_place_score = round_to_1(document_sentiment.score)
  tens_place_magnitude = round_to_1(document_sentiment.magnitude)
  
  score_and_magnitude = json.dumps({"score": tens_place_score, \
                                   "magnitude": tens_place_magnitude})

  return score_and_magnitude

def analyze_entities(text):
  """Applies entity analysis to an input string.
  
  Calls cloud language API once for entity analysis if input is a string. 
  Rounds salience value to the nearest hundreth for convenience. 

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
    raise TypeError("Input to {0} isn't a string.".format("analyze_entities"))
    
  document = types.Document(content=text, type=enums.Document.Type.PLAIN_TEXT)

  document_entities = \
      CLIENT.analyze_entities(document,encoding_type=ENCODING_TYPE) \
            .entities
  
  formatted_entities = []
  
  for entity in document_entities: 
    entity_name = entity.name
    entity_type = enums.Entity.Type(entity.type).name
    entity_salience = round_to_2(entity.salience)
    
    formatted_entity = json.dumps({"name": entity_name, \
                                   "type": entity_type, \
                                   "salience": entity_salience})
  
    formatted_entities.append(formatted_entity)
  
  return formatted_entities
