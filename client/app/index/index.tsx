import { AppShell, Title } from "@mantine/core"


export const Index = () => {

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Title order={2}>EZ-Connecty</Title>
        <Title order={4}>Le système de jeu Connect4 FACILE à utiliser</Title>
      </AppShell.Header>
    </AppShell>
  )
}