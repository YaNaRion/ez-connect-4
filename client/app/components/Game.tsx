import { Stack, Title } from "@mantine/core"
import Board from "./Board"
import type { Equipes } from "~/state/models"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"


const exampleEquipes: Equipes = {
  red: { name: "Red", color: "red" },
  yellow: { name: "Yellow", color: "yellow" },
}

const exampleBoardState = [
  [{ name: "A1", owner: exampleEquipes.red }, { name: "A2", owner: exampleEquipes.yellow }, { name: "A3", owner: exampleEquipes.red }],
  [{ name: "B1", owner: exampleEquipes.yellow }, { name: "B2", owner: exampleEquipes.red }, { name: "B3", owner: exampleEquipes.yellow }],
  [{ name: "C1" }, { name: "C2" }, { name: "C3" }],
]

const serverURL = "http://localhost:3000";


const Game = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // Savoir si on est connecté ou non

  useEffect(() => {
    const newSocket = io(serverURL);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("CONNECTED");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // SocketContext est plus haut dans l'arbre que le reste de l'application. 
  // L'application ne sera pas chargée tant que la connexion socket n'est pas établie.
  if (!isConnected) return <div>Connecting to server...</div>;
  return (
    <Stack>
      <Title order={2}>Grand jeu Connect4 Anims 2025</Title>
      <Board />
    </Stack>
  )
}

export default Game
