from flask import Flask, request, jsonify
from .crypto_engine import CyptoEngine
from .token_handler import TokenHandler
from .ressources import redis_conf
from werkzeug.urls import url_unquote_plus
import logging

app = Flask(__name__)

engine = CyptoEngine()
token_handler = TokenHandler(redis=redis_conf, crypto_engine=engine)


def make_error(msg: str, code=400):
    return jsonify({'error': msg}), code


@app.route('/api/new', methods=['POST'])
def create_token():
    js: dict = request.get_json()
    content = js.get('content')
    ttl = int(js.get('ttl', -1))
    multi_links = int(js.get('links_number', 1))
    if content is None or ttl < 1:
        return make_error('missiong field')
    return jsonify({
        'tokens': [
            token_handler.set_content(content, ttl) for _ in range(multi_links)
        ]
    })


@app.route('/api/preview/<token>', methods=['GET'])
def preview(token: str):
    """just check if the token is valid here
    """
    return jsonify({
        'valid': token_handler.is_token_valid(url_unquote_plus(token))
    })


@app.route('/api/view/<token>', methods=['GET'])
def view_password(token: str):
    return jsonify({
        'content': token_handler.get_content(url_unquote_plus(token))
    })
