import logging
import os

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.urls import url_unquote_plus

from .crypto_engines import crypto_engines
from .ressources import redis_conf, conf
from .token_handler import TokenHandler, InvalidToken

app = Flask(__name__, static_folder='../../frontend/build')

secret = 'test'

# getting an engine
engine = (crypto_engines[conf.crypto.mode].value)()
token_handler = TokenHandler(secret, redis=redis_conf, crypto_engine=engine)

MAX_MULTI_LINK = 15


def make_error(msg: str, code=400):
    return jsonify({'error': msg}), code


if conf.flask.serve_front:
    logging.warning(
        'Flask is serving the frontend -> not the most performant way to do it !')
    # serving the front end react app
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path: str):
        print('path', app.static_folder + '/' + path)
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/new', methods=['POST'])
def create_token():
    js: dict = request.get_json()
    content = js.get('content')
    ttl = int(js.get('ttl', -1))
    multi_links = int(js.get('links_number', 1))
    if multi_links > MAX_MULTI_LINK:
        return make_error(f'Too many links requested | max is {MAX_MULTI_LINK}')
    if content is None or ttl == -1:
        return make_error('missiong field')
    tokens, used, _for = token_handler.set_string(
        content, ttl, nb_token=multi_links, expires=ttl != 0)
    return jsonify({
        'tokens': tokens,
        'used': used,
        'for': _for
    })


@app.route('/api/preview/<token>', methods=['GET'])
def preview(token: str):
    """just check if the token is valid here
    """
    try:
        return jsonify({
            'valid': token_handler.is_token_valid(url_unquote_plus(token))
        })
    except InvalidToken:
        return make_error('Invalid token')


@app.route('/api/view/<token>', methods=['GET'])
def view_password(token: str):
    try:
        return jsonify({
            'content': token_handler.get_string(url_unquote_plus(token))
        })
    except InvalidToken:
        return make_error('Invalid token')
