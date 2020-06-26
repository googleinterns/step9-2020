#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 23 16:36:57 2020

@author: robert
"""
import unittest
import language_analysis
import json


STRING_ONE = 'Pro Wrestler for Congress | Big Dan Rodimer | Rebuild Nevada'
STRING_TWO = 'Tell John Bel Edwards Today | No Sanctuary Cities in LA | It’s Up to You to Stop This'

def entity_dict(entity_values):
  (entity_name, entity_type, entity_salience) = entity_values
  return {"name": entity_name, \
          "type": entity_type, \
          "salience": entity_salience}
  
def entity_list(entities_as_tuple_list):
  return list(map(lambda x: entity_dict(x), entities_as_tuple_list))

def format_entity_list(entity_list):
  return list(map(lambda x: json.loads(x), entity_list))

def sentiment_dict(entity_score, entity_magnitude):
  return {"score": entity_score, "magnitude": entity_magnitude}


class test_language_analysis(unittest.TestCase):

  def test_string_one_sentiment(self):
    expected_sentiment = sentiment_dict(0.1, 0.1)
    actual_sentiment = json.loads(analyze_sentiment(STRING_ONE))
    
    self.assertEqual(expected_sentiment, actual_sentiment)
    
  def test_string_one_entities(self):
    expected_entity_list = [("Pro Wrestler", "ORGANIZATION", 0.62), 
                           ("Congress", "ORGANIZATION", 0.19),
                           ("Rebuild Nevada", "OTHER", 0.13), 
                           ("Big Dan Rodimer", "PERSON", 0.06)]
    formatted_expected_entity_list = entity_list(expected_entity_list)
    
    actual_list = format_entity_list(analyze_entities(STRING_ONE))

    self.assertEqual(formatted_expected_entity_list, actual_list)
    
  def test_string_two_sentiment(self):
    expected_sentiment = sentiment_dict(-0.4, 0.4)
    actual_sentiment = json.loads(analyze_sentiment(STRING_TWO))
    
    self.assertEqual(expected_sentiment, actual_sentiment)
    
  def test_string_two_entities(self):
    expected_entity_list = [("John Bel Edwards", "PERSON", 0.41),
                            ("LA", "LOCATION", 0.29),
                            ("No Sanctuary Cities", "LOCATION", 0.22),
                            ("It's Up to You", "WORK_OF_ART", 0.09)]
    formatted_expected_entity_list = entity_list(expected_entity_list)
    
    actual_list = format_entity_list(analyze_entities(STRING_TWO))
    
    self.assertEqual(formatted_expected_entity_list, actual_list)
    
if __name__ == '__main__':
    unittest.main()