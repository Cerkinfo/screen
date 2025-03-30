import '../css/admin.css'
import { useEffect } from "react";
import React, { useState, useRef } from "react";

let ip = process.env.NEXT_PUBLIC_LOCALIP;

function AdminPage() {

  async function fetchScores() {
    let response = await fetch(`http://${ip}:5000/api/score`);
    let data = await response.json();

    for (let id in data) {
        let counter = document.getElementById(id + '-counter');
        if (counter) {
            counter.textContent = data[id];  // Set the counter value to the fetched score
        }
    }
  }

  async function updateScore(cercle, operation) {
  
    let response = await fetch(`http://${ip}:5000/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cercle: cercle, operation: operation })
    });
    
    let result = await response.json();
    if (result.succeed) {
        fetchScores();
    } else {
        alert("Error: " + result.error);
    }
  }

  useEffect(() => {
    fetchScores()
  }, []);

  return (
      <main id="mainAdmin">
        <header id="headerAdmin" >Admin Panel</header>
        <div id="toges">
            <span>POPO</span>
            <div className="counter" id="toges-counter">Error</div>
            <button className="updateButtonAdmin" onClick={() => updateScore('toges', 'add')}>+1 toges</button>
            <button className="updateButtonAdmin" onClick={() => updateScore('toges', 'sub')}>-1 toges</button>
        </div> 
        <div id="non-toges">
            <span>CI</span>
            <div className="counter" id="non-toges-counter">Error</div>
            <button className="updateButtonAdmin" onClick={() => updateScore('non-toges', 'add')}>+1 non-toges</button>
            <button className="updateButtonAdmin" onClick={() => updateScore('non-toges', 'sub')}>-1 non-toges</button>
        </div> 
      </main>
  );
}

export default AdminPage;
