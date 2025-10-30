import '../../css/admin.css'
import { useEffect } from "react";
import React, { useState, useRef } from "react";

let ip = process.env.NEXT_PUBLIC_LOCALIP;

function AdminPage() {

  async function fetchNames() {
	let response = await fetch(`http://${ip}:5000/api/names`);
	let data = await response.json();

	for (let id in data) {
		let name = document.getElementById(id + '-name');
		if (name) {
			name.textContent = data[id];  // Set the counter value to the fetched score
		}
	}
  }

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

  async function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

	const formJson = JSON.stringify(Object.fromEntries(formData.entries()));
    fetch(`http://${ip}:5000/api/names`, {
		method: form.method,
		headers: { "Content-Type": "application/json" },
		body: formJson
	});
	  
    console.log(formJson);
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
	fetchNames()
	setInterval(fetchNames, 2000); // Poll every 5 seconds
	setInterval(fetchScores, 2000); // Poll every 5 seconds
  }, []);

  return (
      <main id="mainAdmin">
        <header id="headerAdmin" >Admin Panel</header>
        <div id="teamA">
	  		<span><div className="name" id="teamA-name">Error</div></span>
	  		<div className="counter" id="teamA-counter">Error</div>
			<span>
            <button className="updateButtonAdmin" onClick={() => updateScore('teamA', 'add')}>+1</button>
            <button className="updateButtonAdmin" onClick={() => updateScore('teamA', 'sub')}>-1</button>
	  		</span>
	  		<form method="post" onSubmit={handleSubmit}>
	  			<input name="cercle" defaultValue="teamA_name" />
				<input type="hidden" name="team" defaultValue="teamA" />
	  			<button className="updateButtonAdmin" type="submit">update name</button>
	  		</form>
        </div> 
        <div id="teamB">
            <span><div className="name" id="teamB-name">Error</div></span>
	  		<div className="counter" id="teamB-counter">Error</div>
	  		<span>
            <button className="updateButtonAdmin" onClick={() => updateScore('teamB', 'add')}>+1</button>
            <button className="updateButtonAdmin" onClick={() => updateScore('teamB', 'sub')}>-1</button>
	  		</span>
	  		<form method="post" onSubmit={handleSubmit}>
				<input name="cercle" defaultValue="teamB_name" />
				<input type="hidden" name="team" defaultValue="teamB" />
				<button className="updateButtonAdmin" type="submit">update name</button>
			</form>
        </div> 
      </main>
  );
}

export default AdminPage;
