#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jul 20 16:36:57 2020

@author: scarlet
"""
import pytest
from flask import Flask
from routes import MAX_CHAR_LIMIT, configure_routes

HEADER = 'Fighting Climate Change | Pete Buttigieg 2020 | Learn More'
CONTENT = ('Climate change is a life and death issue for our generation. ' +
              'It\'s time for bold action.')

URL = '/analysis'
FORM_TYPE = 'multipart/form-data'

@pytest.fixture
def client():
  app = Flask(__name__)
  configure_routes(app)
  client = app.test_client()
  return client

def test_analysis_route_success(client):
  mock_data = { 'header': HEADER, 'content': CONTENT }
  response = client.post(URL, content_type=FORM_TYPE, data=mock_data)
  assert response.status_code == 200

def test_analysis_route_fail_missing_field(client):
  # missing "content" field
  mock_data = { 'header': HEADER }
  response = client.post(URL, content_type=FORM_TYPE, data=mock_data)
  assert response.status_code == 500

def test_analysis_route_fail_invalid_fields(client):
  # incorrect field names 
  mock_data = { 'title': HEADER, 'body': CONTENT }
  response = client.post(URL, content_type=FORM_TYPE, data=mock_data)
  assert response.status_code == 500

def test_analysis_route_fail_empty_fields(client):
  # empty fields 
  mock_data_1 = { 'header': '', 'content': '' }
  response = client.post(URL, content_type=FORM_TYPE, data=mock_data_1)
  assert response.status_code == 500

   # empty a field
  mock_data_2 = { 'header': HEADER, 'content': '',}
  response = client.post(URL, content_type=FORM_TYPE, data=mock_data_2)
  assert response.status_code == 500

def test_analysis_route_fail_exceed_character_limit(client):
  exceeded_string = "x" * (MAX_CHAR_LIMIT + 1)
  mock_data = { 'header': HEADER, 'content': exceeded_string }
  response = client.post(URL, content_type=FORM_TYPE, data=mock_data)
  assert response.status_code == 500

def test_analysis_route_success_within_character_limit_boundary(client):
  inbound_string = "x" * MAX_CHAR_LIMIT
  mock_data = { 'header': HEADER, 'content': inbound_string }
  response = client.post(URL, content_type=FORM_TYPE, data=mock_data)
  assert response.status_code == 200
