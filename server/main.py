# basic flask app with get and post request

from flask import Flask, request, jsonify
from flask_cors import CORS
import json

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64

from AES import AESCipher
from SHA256 import hash_data
from PKI import issueCertificate

from math import gcd

import random

app = Flask(__name__)
CORS(app)


@app.route('/diffie-hellman', methods=['POST'])
def deffie_hellman():
    data = request.json

    # Diffie Hellman needs P and G to be prime numbers and G to be a primitive root of P, and X1 and X2 to be private keys
    P = int(data['P'])
    G = int(data['G'])
    X1 = int(data['X1'])
    X2 = int(data['X2']) 

    # Calculate Public Keys
    Y1 = pow(G, X1) % P
    Y2 = pow(G, X2) % P

    # Generate Secret Keys
    K1 = pow(Y2, X1) % P
    K2 = pow(Y1, X2) % P

    msg = ""
    if K1 == K2:
        msg = "Keys Have Been Exchanged Successfully"
    else:
        msg = "Keys Have Not Been Exchanged Successfully"

    print(msg)

    # return all calculated values
    return ({
        "P": P,
        "G": G,
        "X1": X1,
        "X2": X2,
        "Y1": Y1,
        "Y2": Y2,
        "K1": K1,
        "K2": K2,
        "msg": msg
    })

@app.route('/rsa', methods=['POST'])
def rsa():
    data = request.json

    # RSA needs P and Q to be prime numbers, text to encrypt
    P = int(data['P'])
    Q = int(data['Q'])
    text = int(data['text'])

    # Calculate N
    N = P * Q

    # Calculate Totient
    T = (P - 1) * (Q - 1)

    # selecting public key, e
    E = 0
    for i in range(2, T):
        if gcd(i, T) == 1:
            E = i
            break
    
    # selecting private key, d
    j = 0
    D = 0
    while True:
        if (j * E) % T == 1:
            D = j
            break
        j += 1

    # performing encryption
    CT = (text ** E) % N

    # performing decryption
    MES = (CT ** D) % N

    # return all calculated values
    return ({
        "P": P,
        "Q": Q,
        "N": N,
        "T": T,
        "E": E,
        "D": D,
        "CT": CT,
        "MES": MES
    })

@app.route('/aes', methods=['POST'])
def aes():
    #get a text and a key
    data = request.json

    text = data['text']
    key = data['key']

    #encrypt the text
    cipher = AESCipher(key)
    encrypted_text = cipher.encrypt(text)

    #decrypt the text
    decrypted_text = cipher.decrypt(encrypted_text)

    #return all calculated values
    return ({
        "text": text,
        "key": key,
        "encrypted_text": encrypted_text,
        "decrypted_text": decrypted_text
    })

@app.route('/sha256', methods=['POST'])
def sha256():
    # data
    data = request.json

    text = data['text']

    hashed = hash_data(text)

    return ({
        "text":text,
        "hashed_data":hashed
    })

@app.route('/pki', methods=['POST'])
def pki():
    cert = issueCertificate()

    return ({
        "certificate": cert
    })



# Key Exchange for SSL/TLS 3.0 (which uses Deffie Hellman)
# Prime and base numbers also coded in client 23 and 5
prime = 23
base = 5

# Generate Server's private key
server_private = random.randint(1, prime-1)

# Generate Server's public key
server_public = (base ** server_private) % prime


@app.route('/client_public_key', methods=['POST'])
def receive_client_public_key():
    client_public = request.json['client_public']

    # Calculate the shared secret
    global shared_secret
    shared_secret = (client_public ** server_private) % prime

    print("Shared Secret: ", shared_secret)

    # Send server_public to Client
    return {'server_public': server_public}

@app.route('/receive_message', methods=['POST'])
def receiver_message():
    # Receive message from client
    message = request.json['encryptedText']

    # making key 16 charaters long by duplicating it
    print(shared_secret)
    key = str(shared_secret)
    while len(key) < 16:
        key += str(shared_secret)

    # Convert the shared key to bytes
    key = key.encode('utf-8')

    # Decode the base64-encoded text
    encrypted_data = base64.b64decode(message)

    # Create an AES cipher object for decryption
    cipher = AES.new(key, AES.MODE_ECB)

    # Decrypt the text
    decrypted_data = cipher.decrypt(encrypted_data)

    # Manually remove PKCS7 padding
    padding_length = decrypted_data[-1]
    decrypted_data = decrypted_data[:-padding_length]

    # Convert the decrypted data to a string (assuming it contains text)
    decrypted_text = decrypted_data.decode('utf-8')


    # Send message to client
    return {'message': message}


# Run Server
if __name__ == '__main__':
    app.run(debug=True, port=5000)