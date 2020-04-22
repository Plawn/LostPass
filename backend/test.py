import requests
from urllib.parse import quote_plus, quote, quote_from_bytes
import random
import string

url = 'http://localhost:5000'

base_ttl = 5
base_string_length = 1024

def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.printable
    return ''.join(random.choice(letters) for i in range(string_length))


def create_token(content: str, links_number=1, bench=False) -> str:

    data = {
        'content': content,
        'ttl': base_ttl,
        'links_number':links_number
    }

    r = requests.post(url + '/api/new', json=data)

    
    if r.status_code < 300:
        if not bench:
            return r.json()['tokens'][0]
        else:
            return r.json()['used']

def preview_token(token: str) -> bool:
    quoted_token = quote_plus(token)
    print('token', token)
    print('quoted token', quoted_token)
    r = requests.get(url+'/api/preview/' + quoted_token)
    print(r.text)
    if r.status_code < 300:
        return r.json()['valid']


def view_token(token: str) -> str:
    r = requests.get(url+'/api/view/' + quote_from_bytes(token))
    if r.status_code < 300:
        return r.json()['content']
    

def full_test():
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


def bench():
    for l in range(1, 11):
        result = []
        for i in range(100):
            print(i)
            result.append(create_token('c'*i, l,bench=True))
        import matplotlib.pyplot as plt
        import json
        with open('res.json', 'w') as f :
            json.dump(result, f)
        plt.figure()
        plt.plot(range(100), result)
        plt.show()
    

if __name__ == '__main__':
    # full_test()
    bench()