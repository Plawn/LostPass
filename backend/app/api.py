import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, PositiveInt, conint
from starlette.responses import FileResponse, JSONResponse
from werkzeug.urls import url_unquote_plus

from .ressources import MAX_MULTI_LINK, conf, token_handler
from .token_handler import InvalidToken

app = FastAPI()


# configure CORS if required
if conf.flask.cors is not None:
    origins = conf.flask.cors
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )


class NewTokenDTO(BaseModel):
    content: str
    ttl: PositiveInt
    links_number: conint(lt=MAX_MULTI_LINK, gt=0)


def make_error(msg: str, code: int = 400):
    return JSONResponse({'error': msg}, code)

    # @app.route('/', defaults={'path': ''})
    # @app.route('/<path:path>')
    # def serve(path: str):
    #     print('path', app.static_folder + '/' + path)
    #     if path != "" and os.path.exists(app.static_folder + '/' + path):
    #         return send_from_directory(app.static_folder, path)
    #     else:
    #         return send_from_directory(app.static_folder, 'index.html')


@app.post('/api/new')
def create_token(body: NewTokenDTO):
    tokens, used = token_handler.set_string(
        body.content, body.ttl,
        nb_token=body.links_number,
        expires=body.ttl != 0
    )
    return {
        'tokens': tokens,
        'used': used,
    }


@app.get('/api/preview/{token}')
def preview(token: str):
    """just check if the token is valid here
    """
    try:
        return {
            'valid': token_handler.is_token_valid(url_unquote_plus(token))
        }
    except InvalidToken:
        return make_error('Invalid token')


@app.get('/api/view/{token}')
def view_password(token: str):
    try:
        return {
            'content': token_handler.get_string(url_unquote_plus(token))
        }
    except InvalidToken:
        return make_error('Invalid token')


# TODO update
if conf.flask.serve_front:
    logging.warning(
        'Flask is serving the frontend -> not the most performant way to do it !'
    )
    # serving the front end react app
    # avoid using html=True, to be sure

    @app.get('/')
    def index():
        return FileResponse('./frontend/build/index.html')
    app.mount("/", StaticFiles(directory="./frontend/build/"), name="/")
