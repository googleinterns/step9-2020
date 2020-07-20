#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jul 20 16:36:57 2020

@author: scarlet
"""
from flask import Flask
from routes import configure_routes
from test_language_analysis import STRING_ONE, STRING_TWO
import pytest

analysis_url = '/analysis'
form_type = 'multipart/form-data'

@pytest.fixture
def client():
  app = Flask(__name__)
  configure_routes(app)
  client = app.test_client()
  return client

def test_analysis_route_success(client):
  mock_data = { 'header': STRING_ONE, 'content': STRING_TWO }
  response = client.post(analysis_url, content_type=form_type, data=mock_data)
  assert response.status_code == 200

def test_analysis_route_fail_missing_field(client):
  # missing "content" field
  mock_data = { 'header': STRING_ONE }
  response = client.post(analysis_url, content_type=form_type, data=mock_data)
  assert response.status_code == 500

def test_analysis_route_fail_invalid_fields(client):
  # mispelled field names 
  mock_data = { 'headers': STRING_ONE, 'contents': STRING_TWO }
  response = client.post(analysis_url, content_type=form_type, data=mock_data)
  assert response.status_code == 500

def test_analysis_route_fail_empty_fields(client):
  # empty fields 
  mock_data_1 = { 'header': '', 'content': '' }
  response = client.post(analysis_url, content_type=form_type, data=mock_data_1)
  assert response.status_code == 500

   # empty a field
  mock_data_2 = { 'header': STRING_ONE, 'content': '',}
  response = client.post(analysis_url, content_type=form_type, data=mock_data_2)
  assert response.status_code == 500
