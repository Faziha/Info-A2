"use client"

import React from "react";

import axios from "axios";

import { useState } from "react";

import { BASE_URL } from "../config";

// Display Function for AES
function AES() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");

  const [value, setValue] = useState(null)

  async function calculate() {
    const response = await axios.post(`${BASE_URL}/aes`, {
      text: text,
      key: key
    })

    setValue(response.data)
  }

  return (
    <div className="text-black">
      <div className="text-black text-center text-2xl font-bolder">AES</div>
      <div className="flex justify-around">
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="key_input">Key</label>
          <input className="border-black border-2 rounded-full px-3" id="key_input" onChange={(e) => { setKey(e.target.value) }}></input>
        </div>
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="text_input">Text</label>
          <input className="border-black border-2 rounded-full px-3" id="text_input" onChange={(e) => { setText(e.target.value) }}></input>
        </div>
      </div>

      {/* calculate button */}
      <div className="flex justify-center">
        <button className="border-black border-2 rounded-full px-3" onClick={calculate}>Calculate</button>
      </div>

      {/* Display the information received */}
      {
        value &&
        <div>
          <div className="text-black text-center text-2xl font-bolder">Output</div>
          <div className="text-black text-center text-2xl font-bolder">{value.encrypted_text}</div>
          <div className="text-black text-center text-2xl font-bolder">{value.decrypted_text}</div>
        </div>
      }
    </div>
  )
}

// Display Function for SHA256
function SHA256() {
  const [text, setText] = useState("")

  // response values
  const [value, setValue] = useState(null)

  async function calculate() {
    const response = await axios.post(`${BASE_URL}/sha256`, {
      text: text
    })

    setValue(response.data)
  }

  return (
    <div className="text-black">
      <div className="text-black text-center text-2xl font-bolder">SHA256</div>
      <div>
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="text_input">Text</label>
          <input className="border-black border-2 rounded-full px-3" id="text_input" onChange={(e) => { setText(e.target.value) }}></input>
        </div>
      </div>

      {/* calculate button */}
      <div className="flex justify-center">
        <button className="border-black border-2 rounded-full px-3" onClick={calculate}>Calculate</button>
      </div>

      {/* Display the information received */}
      {
        value &&
        <div>
          <div className="text-black text-center text-2xl font-bolder">Output</div>
          <div className="text-black text-center text-2xl font-bolder">{value.hashed_data}</div>
          <div className="text-black text-center text-2xl font-bolder">{value.text}</div>
        </div>
      }

    </div>
  )
}

// Display Function for PKI
function PKI() {
  // variables
  const [value, setValue] = useState(null)

  async function calculate() {
    const response = await axios.post(`${BASE_URL}/pki`, {})

    setValue(response.data)
  }

  return (
    <div className="text-black">
      <div className="text-black text-center text-2xl font-bolder">PKI</div>
      {/* calculate button */}
      <div className="flex justify-center">
        <button className="border-black border-2 rounded-full px-3" onClick={calculate}>Calculate</button>
      </div>

      {/* Display the information received */}
      {
        value &&
        <div>
          <div className="text-black text-center text-2xl font-bolder">Output</div>
          <div className="text-black text-center text-2xl font-bolder">{value.certificate}</div>
        </div>
      }
    </div>
  )
}

export default function Home() {

  // AES is for AES, SHA256 is for SHA256, PKI is for PKI
  const [algo, setAlgo] = useState("AES");

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="relative flex py-4 place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className="text-3xl">
          Symmetric
        </div>
      </div>

      <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <button
          onClick={() => setAlgo("AES")}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-center`}>
            AES{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </button>
        <button
          onClick={() => setAlgo("SHA256")}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-center`}>
            SHA 256{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </button>

        <button
          onClick={() => setAlgo("PKI")}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-center`}>
            PKI{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </button>
      </div>

      <div className="bg-white h-fit p-10 rounded-xl w-full my-10">
        {algo === "AES" ? <AES /> : algo === "SHA256" ? <SHA256 /> : <PKI />}
      </div>
    </main>
  )
}