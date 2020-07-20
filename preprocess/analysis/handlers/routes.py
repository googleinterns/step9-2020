from flask import Flask, jsonify, request, abort
from language_analysis import analyze_entities, analyze_sentiment

ERROR_MESSAGE = ('"header" or "content" field was either empty,' +
                 'not included in form or has invalid values.')
MAX_CHAR_LIMIT = 1000

def is_valid(string):
  return not (string is None or not string or len(string) > MAX_CHAR_LIMIT)

def configure_routes(app):
  @app.route('/')
  def root():
    return "Hello World!"

  @app.route('/analysis', methods=['POST'])
  def analyze():
    header = request.form.get('header')
    content = request.form.get('content')

    if is_valid(header) and is_valid(content):
      return jsonify(
        header_sentiment=analyze_sentiment(header),
        header_entities=analyze_entities(header),
        content_sentiment=analyze_sentiment(content),
        content_entities=analyze_entities(content),
      )
    else:
      abort(500, ERROR_MESSAGE)  # 500 Internal Server Error server error
