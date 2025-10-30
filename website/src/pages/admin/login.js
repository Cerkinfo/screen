import '../../css/login.css'
import React, { useState, useRef } from "react";
import { useRouter  } from 'next/navigation';

function Login() {
  const [mdp, setmdp] = useState("");
  let router = useRouter();
  async function handleSubmit(event) {
    event.preventDefault();
    let response = await fetch("http://127.0.0.1:5000/cli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "pw": mdp })
  })
  .then( res =>{
    console.log(res)
    router.push('/admin')
  }  )
  .catch(error =>{
    alert("une erreur est apparut")
  } );
  }
  return (
    <div>
      <header id="headerLogin">
          Login form
      </header>
      <form id="formLogin"  onSubmit={handleSubmit} >
          <p>Password:</p>
          <input type="password" name="pw" value={mdp}
          onChange={(e) => setmdp(e.target.value)} placeholder="CI tu savais ..."/>
          <input type="submit" value="login" />
      </form>
      <div id="error">
          <p>✗ Wrong password </p>
      </div>
    </div>
  );
}

export default Login;
