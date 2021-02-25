import logging
import io

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from fastapi.param_functions import Form
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


@app.post('/api/new/string')
def create_token(body: NewTokenDTO):
    meta = {}
    tokens, used = token_handler.set_string(
        body.content, body.ttl,
        nb_token=body.links_number,
        expires=body.ttl != 0,
        meta=meta
    )
    return {
        'tokens': tokens,
        'used': used,
    }


@app.post('/api/new/file')
async def create_token_files(
    ttl: int = Form(...),
    links_number: int = Form(...),
    file: UploadFile = File(...)
):
    meta = {'filename': file.filename}
    content = await file.read()
    tokens, used = token_handler.set_bytes(
        content, ttl,
        nb_tokens=links_number,
        expires=ttl != 0,
        meta=meta,
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
        valid, metadata = token_handler.is_token_valid(url_unquote_plus(token))
        return {
            'valid': valid,
            'meta': metadata,
        }
    except InvalidToken:
        return make_error('Invalid token')


@app.get('/api/view/{token}')
def view_data(token: str):
    try:
        data, metadata = token_handler.get_bytes(url_unquote_plus(token))
        if metadata['type'] == 1:
            return {
                'content': data.decode('utf-8')
            }
        else:
            file_like = io.BytesIO()
            file_like.write(data)
            file_like.seek(0)
            return StreamingResponse(file_like, media_type='application/octet-stream')

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
