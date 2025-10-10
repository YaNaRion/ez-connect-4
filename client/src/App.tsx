import { AppShell, Title } from "@mantine/core"
import { SocketProvider } from "./provider/socket"
import Game from "./components/Game"
import { useEffect } from "react"
import useGameStore from "./state/store"

function App() {
  
  const setNotificationsPerm = useGameStore((state) => state.setPermissionsAllowed)

  useEffect(() => {
    if("Notification" in window){
      Notification.requestPermission().then((permission) => {
        if(permission === "granted"){
          setNotificationsPerm(true);
        } else {
          setNotificationsPerm(false);
        }
    })
  }
  }, [])

  return (
    <AppShell
        padding="md"
        header={{ height: 60 }}
      >
        <AppShell.Header>
          <Title order={2}>EZ-Connecty</Title>
          <Title order={4}>Le système de jeu Connect4 FACILE à utiliser</Title>
        </AppShell.Header>
        <AppShell.Main>
          <SocketProvider >
          <div className="app">
            <Game />
          </div>
        </SocketProvider>
        </AppShell.Main>
    </AppShell>
  )
}

export default App
