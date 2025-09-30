import { AppShell, Title } from "@mantine/core"
import Game from "~/components/Game"
import { SocketProvider } from "~/provider/socket"


export const Index = () => {
  const socketOptions = {
    autoConnect: true,
  };
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
        <SocketProvider options={socketOptions}>
          <div className="app">
            <Game />
          </div>
        </SocketProvider>
      </AppShell.Main>
    </AppShell>
  )
}
