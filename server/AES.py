import hashlib
from Crypto.Cipher import AES
from base64 import b64encode, b64decode

class AESCipher:
    def __init__(self, key):
        self.key = hashlib.sha256(key.encode()).digest()

    def encrypt(self, plain_text):
        cipher = AES.new(self.key, AES.MODE_EAX)
        nonce = cipher.nonce
        ciphertext, tag = cipher.encrypt_and_digest(plain_text.encode())
        return b64encode(nonce + ciphertext + tag).decode("utf-8")

    def decrypt(self, encrypted_text):
        encrypted_data = b64decode(encrypted_text.encode("utf-8"))
        nonce = encrypted_data[:16]
        ciphertext = encrypted_data[16:-16]
        tag = encrypted_data[-16:]
        cipher = AES.new(self.key, AES.MODE_EAX, nonce=nonce)
        plain_text = cipher.decrypt(ciphertext)
        return plain_text.decode("utf-8")

def main():
    text = "Hello World"
    key = "mysecretpassword"
    print("Plain Text : ", text)

    cipher = AESCipher(key)
    encrypted_text = cipher.encrypt(text)
    print("Encrypted Text : ", encrypted_text)

    decrypted_text = cipher.decrypt(encrypted_text)
    print("Decrypted Text : ",decrypted_text)

main()
