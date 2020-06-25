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

#see readme about how to setup mykey.json
CLIENT = language.LanguageServiceClient.from_service_account_json("mykey.json")
ENCODING_TYPE = enums.EncodingType.UTF8


"""

Cloud language api will automatically return floats to to like 15 decimal 
places. This rounds to the *nearest* tens place decimal

"""
def round_to_1(x):
  return round(x, 1)

def round_to_2(x): 
  return round(x, 2)


"""

Take an input text and return sentiment as JSON object composed of 
score and magnitude, both rounded to nearest tenth
Calls cloud language API once for sentiment analysis

"""
def analyze_sentiment(text):
  document = types.Document(content=text, type=enums.Document.Type.PLAIN_TEXT)

  document_sentiment = \
      CLIENT.analyze_sentiment(document,encoding_type=ENCODING_TYPE) \
            .document_sentiment
  tens_place_score = round_to_1(document_sentiment.score)
  tens_place_magnitude = round_to_1(document_sentiment.magnitude)
  score_and_magnitude = json.dumps({"score": tens_place_score, \
                                   "magnitude": tens_place_magnitude})

  return score_and_magnitude

"""

Take an input text and return entity results as a list of JSON objects
Composed of entity name, entity type, entity salience, rounded to nearest 100s

"""
def analyze_entities(text):
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
