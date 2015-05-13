from bottle import template

from src import app


@app.route('/', method='GET')
def index():
    return template('api.html')