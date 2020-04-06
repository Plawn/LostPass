import requests
from urllib.parse import quote
import random
import string

url = 'http://localhost:5000'

base_ttl = 5
base_string_length = 1024

def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.printable
    return ''.join(random.choice(letters) for i in range(string_length))


def create_token(content: str) -> str:

    data = {
        'content': content,
        'ttl': base_ttl
    }

    r = requests.post(url + '/api/new', json=data)

    if r.status_code < 300:
        return r.json()['tokens'][0]


def preview_token(token: str) -> bool:
    r = requests.get(url+'/api/preview/'+quote(token))
    if r.status_code < 300:
        return r.json()['valid']


def view_token(token: str) -> str:
    r = requests.get(url+'/api/view/'+quote(token))
    if r.status_code < 300:
        return r.json()['content']
    

if __name__ == '__main__':
    content = random_string(base_string_length)
    token = create_token(content)
    print(f'token is {token}')
    is_valid = preview_token(token)
    print(f'token is {"valid" if is_valid else "invalid"}')
    if is_valid:
        content_received = view_token(token)
        if content_received == content:
            print('got the same content')
            print('TEST -- PASSED')
        else:
            print('content received differs from content send')
            print(f'content received is {content_received} and sent is {content}')
            print('TEST -- FAILED')
    else:
        print("token should be valid but isn't")
        print('TEST -- FAILED')