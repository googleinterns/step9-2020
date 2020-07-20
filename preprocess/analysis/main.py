from flask import Flask, jsonify, request, abort, Response
from language_analysis import analyze_entities, analyze_sentiment

app = Flask(__name__)

def is_valid(string):
  return not (string is None or not string)

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
    errorMessage = '"header" or "content" field was either empty or not included in form.'
    abort(500, errorMessage)  # 500 Internal Server Error server error

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
