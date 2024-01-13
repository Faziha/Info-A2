"use client"

import React from "react";

import axios from "axios";
import CryptoJS from "crypto-js";

import loading from '@/../public/loading.gif'

import { useEffect, useState } from "react";

import { BASE_URL } from "../config";


// class AESCipher {
//     constructor(key) {
//         this.key = CryptoJS.createHash('sha256').update(key).digest();
//     }

//     encrypt(plainText) {
//         const nonce = CryptoJS.randomBytes(16);
//         const cipher = CryptoJS.createCipheriv('aes-256-gcm', this.key, nonce);

//         let encrypted = cipher.update(plainText, 'utf8', 'base64');
//         encrypted += cipher.final('base64');

//         const tag = cipher.getAuthTag().toString('base64');
//         return nonce.toString('base64') + encrypted + tag;
//     }

//     decrypt(encryptedText) {
//         const encryptedData = Buffer.from(encryptedText, 'base64');
//         const nonce = encryptedData.slice(0, 16);
//         const encrypted = encryptedData.slice(16, -16);
//         const tag = encryptedData.slice(-16);

//         const decipher = CryptoJS.createDecipheriv('aes-256-gcm', this.key, nonce);
//         decipher.setAuthTag(tag);

//         let decrypted = decipher.update(encrypted, 'base64', 'utf8');
//         decrypted += decipher.final('utf8');
//         return decrypted;
//     }
// }

export default function Connection() {
    // loading
    const [loading, setLoading] = useState(true);
    // Shared Key
    const [shared_key, setShared_key] = useState(0);

    // text
    const [text, setText] = useState("");

    // Prime and base numbers for Diffie-Hellman key exchange 23 and 5
    const prime = 23;
    const base = 5;

    // Generate Client's private key
    const client_private = Math.floor(Math.random() * prime);

    // Calculate Client's public key
    const client_public = (base ** client_private) % prime;

    useEffect(() => {
        // server responds with server_public key
        axios.post(`${BASE_URL}/client_public_key`, {
            client_public: client_public
        }).then((response) => {
            let server_public = response.data.server_public;
            // Calculate shared key
            let key = (server_public ** client_private) % prime;

            setShared_key(key)
            setLoading(false);
        });
    }, []);


    async function sendData() {
        console.log(shared_key)

        // making key 16 charaters long by duplicating it
        let key = shared_key.toString();
        // let key = "12"
        while (key.length < 16) {
            key += shared_key.toString();
            // key += "12"
        }

        console.log(key)

        // const aes = new AESCipher(key);
        // const plainText = 'Hello, AES encryption!';
        // const encrypted = aes.encrypt(plainText);
        // console.log('Encrypted:', encrypted);

        // const decrypted = aes.decrypt(encrypted);
        // console.log('Decrypted:', decrypted);

        // Parse the text as Utf8 before padding
        const utf8Text = CryptoJS.enc.Utf8.parse(text);

        // Calculate the number of bytes needed for padding
        const paddingLength = 16 - (utf8Text.sigBytes % 16);

        // Create a new WordArray with PKCS7 padding
        const paddedText = utf8Text.concat(CryptoJS.lib.WordArray.create([paddingLength, paddingLength, paddingLength, paddingLength]));

        // Encrypt the padded text
        const encryptedText = CryptoJS.AES.encrypt(paddedText, CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.NoPadding, // Since the padding is already done
        }).ciphertext;

        console.log(encryptedText.toString())

        // send encrypted text to server
        await axios.post(`${BASE_URL}/receive_message`, {
            encryptedText: encryptedText.toString()
        }).then((response) => {
            console.log(response.data)
        });
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
                <div className="text-3xl">
                    {loading ? "Exchanging Keys" : "Connection Built Successfully"}
                </div>
            </div>

            <div>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="bg-transparent border-white border-2 rounded-full p-2 w-96" />
            </div>

            <button
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
                onClick={sendData}
            >
                <h2 className={`mb-3 text-2xl font-semibold text-center`}>
                    Send your message
                </h2>
            </button>
        </main>
    )
}