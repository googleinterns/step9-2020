#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 23 16:36:57 2020

@author: robert
"""
import unittest
from language_analysis import analyze_entities, analyze_sentiment
import json

# These strings are used for testing purposes. 
STRING_ONE = 'Pro Wrestler for Congress | Big Dan Rodimer | Rebuild Nevada'
STRING_TWO = ('Tell John Bel Edwards Today | No Sanctuary Cities in LA | ' +
              'It’s Up to You to Stop This')


# Type: dict
def sentiment_dict(entity_score, entity_magnitude):
  return {"score": entity_score, "magnitude": entity_magnitude}

# Type: dict
def entity_dict(entity_values):
  (entity_name, entity_type, entity_salience) = entity_values
  return {"name": entity_name, \
          "type": entity_type, \
          "salience": entity_salience}

def entity_list(entities_as_tuple_list):
  """Helper function for formatting expected entity analysis results.
  
  Properly formats a list of expected entity analysis results by mapping 
  entity_dict across the input argument. 
  
  Args: 
    entites_as_tuple_list: a 3-tuple list, where each tuple corresponds to 
    an expected recognized entity, as name, type, salience.
  
  Returns:
    a list of dictionaries, where each dictionary maps name, type, salience
    to their correspoding string/string/float value.
  """
  
  return list(map(lambda x: entity_dict(x), entities_as_tuple_list))

def format_entity_list(entity_list):
  """De-stringifies a list of json strings.
  
  Default return type for analysis is a json string. For testing it's 
  convenient to just turn these back into dictionaries. 
  
  Args:
    entity_list: a list of json strings, where each json string corresponds to
    a recognized entity and its corresponding values (name, type, salience).
    
  Returns:
    a list of dictionaries, where each dictionary maps name, type, salience
    to their correspoding string/string/float value.
  """
  
  return list(map(lambda x: json.loads(x), entity_list))

class test_language_analysis(unittest.TestCase):
  """Unit tests for language analysis
  
  Tests sentiment_analysis and entity_analysis with control values, and makes
  sure that malformed inputs aren't accepted. 
  """
  
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
    
  def test_malformed_input(self): 
      not_a_string = 101
      
      self.assertRaises(TypeError, analyze_sentiment, not_a_string)
      self.assertRaises(TypeError, analyze_entities, not_a_string)

if __name__ == '__main__':
    unittest.main()