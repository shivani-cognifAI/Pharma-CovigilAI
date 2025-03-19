"use client";

import React, { useState } from "react";
import Login from "./login";
import Image from "next/image";

const Auth = () => {
  const [tab, setTab] = useState("login");

  return (
    <>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 bg-whitesmoke text-left text-lg text-white font-archivo ">
  {/* Left Section */}
  <div className="h-screen sm:pt-10 md:pt-0 flex justify-center items-center  ">
    <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-4 ">
      <div className="container bg-white rounded-xl px-6 pt-8 pb-4 shadow-md text-black w-full ">
        {/* Tabs */}
        <div
          className={`text-center cursor-pointer ${
            tab === "login"
              ? "text-black font-archivo font-bold underline underline-offset-8"
              : "text-silver"
          }`}
          onClick={() => setTab("login")}
        >
          Sign in
        </div>
        {/* Login Component */}
        <div className="mt-4">
          <Login setTab={setTab} />
        </div>
      </div>
    </div>
  </div>

  {/* Right Section */}
  <div className="h-screen sm:pt-10 md:pt-0 bg-lightsteelblue opacity-100 flex flex-col justify-center items-center">
    <div className="flex flex-col justify-center items-center text-center">
      {/* Logo */}
      <Image
        src="/assets/icons/CoVigilAI_logo.png"
        alt="Logo"
        width={200}
        height={50}
        className="mt-4"
      />
      {/* Text */}
      <div className="mt-5 text-black font-semibold text-20 font-archivo">
        Generative AI Infused Pharmacovigilance & Safety Surveillance
      </div>
      <div className="text-black font-semibold text-20 font-archivo">
        Literature Monitoring Solution
      </div>
      {/* Secondary Image */}
      <Image
        src="/assets/icons/Medical research.png"
        alt="Medical Research"
        width={300}
        height={300}
        className="mt-8 sm:mt-4"
      />
    </div>
  </div>
</div>

    </>
  );
};
export default Auth;
