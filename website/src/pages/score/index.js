import '../../css/display.css'
import React, { useState, useRef } from "react";
import { useEffect } from "react";

const ip = process.env.NEXT_PUBLIC_SERVERIP;
const port =  process.env.NEXT_PUBLIC_SERVERPORT;

function DisplayScore() {

  async function fetchTeams() {
    const response = await fetch(`http://${ip}:${port}/api/teams`);
    const data = await response.json()
    let topTeamDisplay = ""
    let lastTeamDisplay = ""
    let teamArray = Object.keys(data).map((key) => [key, data[key]]);
    teamArray.sort((a,b)=>b[1]-a[1] )
    for(const [name, score] of teamArray.slice(0,3)){


      topTeamDisplay += `<div class="teamCard" id="${name}">`
      topTeamDisplay += `<div class="counter" id="${name}">${score}</div>`
      topTeamDisplay += `<div class="teamName">${name}</div></div>`
        
    }

    for(const [name, score] of teamArray.slice(3,teamArray.length)){

      lastTeamDisplay += `<div class="teamCard" id="${name}">`
      lastTeamDisplay += `<div class="counter" id="${name}">${score}</div>`
      lastTeamDisplay += `<div class="teamName" id="${name}">${name}</div></div>`    
    }

    document.getElementById("top").innerHTML =topTeamDisplay
    document.getElementById("last").innerHTML =lastTeamDisplay
  }


  useEffect(() => {
    fetchTeams();
	  setInterval(fetchTeams, 2000);
  }, []);

  return (
      <main id="mainScore">
        <div id="top">

        </div>
        <div id="last">
          
        </div>
          
      </main>
  );
}

export default DisplayScore;
