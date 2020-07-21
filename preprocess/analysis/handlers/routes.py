from flask import Flask, jsonify, request, abort
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
  def analyze():
    result_dict = dict()
    header = request.form.get('header')
    content = request.form.get('content')

    if is_valid('header', header):
      header_sentiment = analyze_sentiment(header)
      header_entities = analyze_entities(header)
    
    if is_valid('content', content):
      content_sentiment = analyze_sentiment(content)
      content_entities = analyze_entities(content)

    return jsonify(
      header_sentiment=header_sentiment, 
      header_entities=header_entities, 
      content_sentiment=content_sentiment, 
      content_entities=content_entities
    )
