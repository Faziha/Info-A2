"use client"

import React from "react";
import Link from "next/link";

import { useState, useEffect } from "react";

import axios from "axios";


// Display Function for Diffie Hellman
// get the value of p and g from the user x1 and x2 from the user
function DH() {
  const [p, setP] = useState(0);
  const [g, setG] = useState(0);
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);

  // states for calculated values from backend
  const [value, setValue] = useState(null);


  async function calculate() {
    const data = await axios.post('http://localhost:5000/diffie-hellman', { "P": p, "G": g, "X1": x1, "X2": x2 });
    console.log(data.data);
    /**
     * data
     * G:5
     * K1:18
     * K2:18
     * P:23
     * X1:4
     * X2:3
     * Y1:4
     * Y2:10
     * msg:"Keys Have Been Exchanged Successfully"
     */

    // set the value of the calculated values
    setValue(data.data);
  }

  return (
    <div className="text-black">
      <div className="text-black text-center text-2xl font-bolder">Diffie Hellman</div>
      <div className="flex justify-around">
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="p_input">p</label>
          <input className="border-black border-2 rounded-full px-3" id="p_input" onChange={(e) => { setP(e.target.value) }}></input>
        </div>
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="g_input">g</label>
          <input className="border-black border-2 rounded-full px-3" id="g_input" onChange={(e) => { setG(e.target.value) }}></input>
        </div>
      </div>
      {/* X1 and X2 value */}
      <div className="flex justify-around">
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="x1_input">X1</label>
          <input className="border-black border-2 rounded-full px-3" id="x1_input" onChange={(e) => { setX1(e.target.value) }}></input>
        </div>
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="x2_input">X2</label>
          <input className="border-black border-2 rounded-full px-3" id="x2_input" onChange={(e) => { setX2(e.target.value) }}></input>
        </div>
      </div>

      {/* calculate button */}
      <div className="flex justify-center">
        <button className="border-black border-2 rounded-full px-3" onClick={calculate}>Calculate</button>
      </div>

      {/* Output */}
      <div>
        <div className="text-black text-center text-2xl font-bolder">Output</div>
        {/* if the value is not null then display the output */}
        {value && <div>
          <div>Message: {value.msg}</div>
          <div>P: {value.P}</div>
          <div>G: {value.G}</div>
          <div>X1: {value.X1}</div>
          <div>X2: {value.X2}</div>
          <div>Y1: {value.Y1}</div>
          <div>Y2: {value.Y2}</div>
          <div>K1: {value.K1}</div>
          <div>K2: {value.K2}</div>
        </div>}
      </div>
    </div>
  )
}

// Display Function for RSA
function RSA() {
  const [p, setP] = useState(0);
  const [q, setQ] = useState(0);
  const [text, setText] = useState(0);

  // states for calculated values from backend
  const [value, setValue] = useState(null);


  async function calculate() {
    const data = await axios.post('http://localhost:5000/rsa', { "P": p, "Q": q, "text": text });
    setValue(data.data)
  }

  return (
    <div className="text-black">
      <div className="text-black text-center text-2xl font-bolder">RSA</div>
      <div className="flex justify-around">
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="p_input">p</label>
          <input className="border-black border-2 rounded-full px-3" id="p_input" onChange={(e) => { setP(e.target.value) }}></input>
        </div>
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="q_input">q</label>
          <input className="border-black border-2 rounded-full px-3" id="q_input" onChange={(e) => { setQ(e.target.value) }}></input>
        </div>
        <div>
          <label className="text-black text-center text-2xl font-bolder" for="text_input">Text</label>
          <input className="border-black border-2 rounded-full px-3" id="text_input" onChange={(e) => { setText(e.target.value) }}></input>
        </div>
      </div>

      {/* calculate button */}
      <div className="flex justify-center">
        <button className="border-black border-2 rounded-full px-3 my-2" onClick={calculate}>Calculate</button>
      </div>

      <div>
        <div className="text-black text-center text-2xl font-bolder">Output</div>
        {/* if the value is not null then display the output */}
        {value && <div>
          <div>CT: {value.CT}</div>
          <div>D: {value.D}</div>
          <div>E: {value.E}</div>
          <div>MES: {value.MES}</div>
          <div>N: {value.N}</div>
          <div>P: {value.P}</div>
          <div>Q: {value.Q}</div>
          <div>T: {value.T}</div>
        </div>}
      </div>
    </div>
  )
}

export default function Home() {

  // DH is for Deffie Hellman and RSA is for RSA
  const [algo, setAlgo] = useState("DH");

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="relative flex py-4 place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className="text-3xl">
          Asymmetric
        </div>
      </div>

      <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div></div>
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          onClick={() => { setAlgo("DH") }}
        >
          <h2 className={`mb-3 text-2xl font-semibold text-center`}>
            Deffie Hellman{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </button>
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          onClick={() => { setAlgo("RSA") }}
        >
          <h2 className={`mb-3 text-2xl font-semibold text-center`}>
            RSA{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </button>
      </div>

      <div className="bg-white h-fit p-10 rounded-xl w-full my-10">
        {algo === "DH" ? <DH /> : <RSA />}
      </div>
    </main>
  )
}