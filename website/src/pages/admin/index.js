import { Alegreya_SC } from 'next/font/google';
import '../../css/admin.css'
import { useEffect, useState } from "react"; 


const ip = process.env.NEXT_PUBLIC_SERVERIP;
const port = process.env.NEXT_PUBLIC_SERVERPORT;

function AdminPage() {

    const [teams, setTeams] = useState({});

    async function addTeam() {


        let newTeamName = prompt("Quelle est le nom de la nouvelle équipe ?")
        let response = await fetch(`http://${ip}:${port}/api/teams`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName: newTeamName,operation : "add"})
        });
        if (response.status == 200){
            alert(`l'équipe ${newTeamName} a été ajouté avec succès !`)
        }else{
            alert(`un problème est survenu !`)
        }
        fetchTeams(); 

    }

    async function removeTeam(teamRemoved) {
        
        let response = await fetch(`http://${ip}:${port}/api/teams`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName: teamRemoved,operation : "remove"})
        });
        if (response.status == 200){
            alert(`l'équipe ${teamRemoved} a été supprimé avec succès !`)
        }else{
            alert(`un problème est survenu !`)
        }
        fetchTeams(); 

    }

    async function fetchTeams() {
        const response = await fetch(`http://${ip}:${port}/api/teams`);
        const data = await response.json();
        setTeams(data);
    }

    async function updateScore(team, action) {
        let response = await fetch(`http://${ip}:${port}/api/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName: team, operation: action })
        });

        let result = await response.json();
        if (result.succeed) {
            fetchTeams(); 
        } else {
            alert("Error: " + result.error);
        }
    }

    useEffect(() => {
        fetchTeams();
        setInterval(fetchTeams, 20000); // Poll every 2 seconds
    }, []);

    return (
        <main id="mainAdmin">
            <header id="headerAdmin">Admin Panel</header>
            <div id="teamMenu">
              <div><button className="updateButtonAdmin" onClick={() => addTeam()} >
                            ajouter une équipe
                        </button></div>
                {Object.entries(teams).map(([teamName, score]) => (
                    <div className="adminTeamCard" key={teamName} id={name}>
                        <button className="updateButtonAdmin" onClick={() => removeTeam(teamName)}>
                            supprimer l'équipe
                        </button>
                        <div className="teamName">{teamName}</div>
                        <div className="counter">{score}</div>
                        <button className="updateButtonAdmin" onClick={() => updateScore(teamName, 'add')}>
                            +1
                        </button>
                        <button className="updateButtonAdmin" onClick={() => updateScore(teamName, 'sub')}>
                            -1
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default AdminPage;