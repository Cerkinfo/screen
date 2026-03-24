import '../../css/display.css'
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Image from 'next/image';
import logo from '../../../public/sniper.gif';

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
    topTeamDisplay += `<div id="top">`
    for(const [name, score] of teamArray.slice(0,3)){

      topTeamDisplay += `<div class="teamCard" id="${name}">`
      topTeamDisplay += `<div class="counter" id="${name}">${score}</div>`
      topTeamDisplay += `<div class="topTeamName">${name}</div></div>`
        
    }
    topTeamDisplay += `</div>`
    if (teamArray.length > 3){
      
      topTeamDisplay += `<div id="last">`
      for(const [name, score] of teamArray.slice(3,teamArray.length)){

        topTeamDisplay += `<div class="teamCard" id="${name}">`
        topTeamDisplay += `<div class="counter" id="${name}">${score}</div>`
        topTeamDisplay += `<div class="bottomTeamName" id="${name}">${name}</div></div>`    
      }
      topTeamDisplay += `</div>`
      

    }
    
    document.getElementById("mainScore").innerHTML = topTeamDisplay
  }


  useEffect(() => {
    fetchTeams();
	  setInterval(fetchTeams, 2000);
  }, []);

  return (
      <main id="mainScore">
        
        {/* <Image src={logo} className="App-logo" alt="logo CI"  /> */}
      </main>
  );
}

export default DisplayScore;
