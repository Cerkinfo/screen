import '../../css/display.css'
import React, { useState, useRef } from "react";
import { useEffect } from "react";

const ip = process.env.NEXT_PUBLIC_LOCALIP;

function DisplayScore() {
  async function fetchNames() {
	let response = await fetch(`http://${ip}:5000/api/names`);
	let data = await response.json()

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

  useEffect(() => {
    fetchScores(); // Initial fetch on page load
	fetchNames(); // Initial fetch on page load
	setInterval(fetchNames, 2000); // Poll every 5 seconds
    setInterval(fetchScores, 2000); // Poll every 5 seconds
  }, []);

  return (
    <div>
      <main id="mainScore">
          <div id="teamA">
              <span><div className="name" id="teamA-name">Error</div></span>
              <div className="counter" id="teamA-counter">Error</div>
          </div> 
          <div id="teamB">
	  		  <span><div className="name" id="teamB-name">Error</div></span>
              <div className="counter" id="teamB-counter">Error</div>
          </div> 
      </main>
    </div>
  );
}

export default DisplayScore;
