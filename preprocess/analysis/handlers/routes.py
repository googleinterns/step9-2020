from flask import Flask, jsonify, request, abort
from flask_cors import cross_origin
# When run pytest, remove the `handlers.` initial to stop the error
from handlers.language_analysis import analyze_entities, analyze_sentiment

MAX_CHAR_LIMIT = 1000

def is_valid(type, string):
  if string is None:
    abort(500, 'Incorrect "' + type + '" field name.')
  if not string:
    abort(500, '"' + type + '" field is empty.')
  if len(string) > MAX_CHAR_LIMIT:
    abort(500, 'String in "' + type + '" field exceeds 1000 char limit: ' + 
          len(string) + ' chars.')
  return not (string is None or not string or len(string) > MAX_CHAR_LIMIT)

def configure_routes(app):
  @app.route('/')
  def root():
    return "Hello World!"

  @app.route('/analysis', methods=['POST'])
  @cross_origin()
  def analyze():
    result_dict = dict()
    field_1 = 'headline'
    field_2 = 'content'
    headline = request.form.get(field_1)
    content = request.form.get(field_2)

    if is_valid(field_1, headline):
      headline_sentiment = analyze_sentiment(headline)
      headline_entities = analyze_entities(headline)
    
    if is_valid(field_2, content):
      content_sentiment = analyze_sentiment(content)
      content_entities = analyze_entities(content)

    return jsonify(
      headline_sentiment=headline_sentiment, 
      headline_entities=headline_entities, 
      content_sentiment=content_sentiment, 
      content_entities=content_entities
    )
