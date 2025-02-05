import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { validateData } from '../Utils/validations';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
const Login = () => {
const [emailid,setEmailId]=useState("");
const [password,setPassword]=useState("");
const [errMsg,setErrMsg]=useState(null);
const navigate=useNavigate();
/*const handleValidations=()=>{
    const msg=validateData(emailid,password);
  console.log(msg);
  setErrMsg(msg);
  if(msg) return;
}*/
const handleLogin=async(e)=>{
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:8000/api/login", {
          emailid,
          password,
        });
        localStorage.setItem("token", response.data.token);
        console.log(response.data);
        navigate("/Dashboard");
      } catch (error) {
      
         toast.error("Invalid User Credentails.Login failed.Please Try again!", {
                     position: "top-right",  // Adjust position
                     autoClose: 5000,        // Close after 5 seconds
                     hideProgressBar: false, // Show progress bar
                     closeOnClick: true,     // Close on click
                     pauseOnHover: true,     // Pause when hovered
                     draggable: true,        // Allow drag to dismiss
                     className: 'toast-error' // Apply custom styles
        });
        setEmailId("");
        setPassword("");
      }
    };
  return (
    <div>
   
    <form onSubmit={handleLogin} className="absolute p-8 w-full md:w-4/12 bg-black my-36 mx-auto right-0 left-0 top-0  text-white bg-opacity-80">
       <h1 className="font-bold text-lg md:text-3xl">Login</h1>
        <input type="text" name="emailid" value={emailid} placeholder="Email ID" className="w-full bg-slate-600 p-1 m-1"  onChange={(e)=>setEmailId(e.target.value)}/>
    <input type="password" name="password" value={password} placeholder="Password" className="w-full bg-slate-600 p-1 m-1"  autoComplete="true" onChange={(e)=>setPassword(e.target.value)}/>
    <p className="text-red-600 text-lg"></p>
     <button className="bg-red-700 rounded w-full m-1" 
      >Login</button>
       <button className="bg-red-700 rounded w-full m-1" type="reset">Cancel</button>
        </form>
   
     <ToastContainer />
    </div>
  )
}

export default Login