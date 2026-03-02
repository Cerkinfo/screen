import '../../css/admin.css'
import { useEffect, useState } from "react"; 

const ip = process.env.NEXT_PUBLIC_SERVERIP;
const port = process.env.NEXT_PUBLIC_SERVERPORT;

function AdminPage() {

    const [teams, setTeams] = useState({});

    async function addTeam() {

        const response = await fetch(`http://${ip}:${port}/api/teams`);

        newTeamName = prompt("Quelle est le nom de la nouvelle équipe ?")
    }

    async function fetchTeams() {
        const response = await fetch(`http://${ip}:${port}/api/teams`);
        const data = await response.json();
        setTeams(data);
    }

    async function updateScore(team, action) {
        console.log(team, action);
        let response = await fetch(`http://${ip}:${port}/api/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cercle: team, operation: action })
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
        setInterval(fetchTeams, 2000); // Poll every 2 seconds
    }, []);

    return (
        <main id="mainAdmin">
            <header id="headerAdmin">Admin Panel</header>
            <div id="teamMenu">
              <div><button className="updateButtonAdmin" onClick={() => addTeam()}>
                            ajouter une équipe
                        </button></div>
                {Object.entries(teams).map(([name, score]) => (
                    <div className="adminTeamCard" key={name} id={name}>
                        <div className="teamName">{name}</div>
                        <div className="counter">{score}</div>
                        <button className="updateButtonAdmin" onClick={() => updateScore(name, 'add')}>
                            +1
                        </button>
                        <button className="updateButtonAdmin" onClick={() => updateScore(name, 'sub')}>
                            -1
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default AdminPage;