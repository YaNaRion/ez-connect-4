import { Box, Button, Center, Menu, Stack, Text } from "@mantine/core"
import { type JetonModel } from "~/state/models"
import useGameStore from "../state/store"
import { useEffect, useState } from "react";

interface JetonProps extends JetonModel {
  coords: [number, number];
}

const Jeton = ({owner, lastCapture, name, coords}: JetonProps) => {

  const equipes = useGameStore((state) => state.equipes)
  const claim = useGameStore((state) => state.claim)
  const clearClaim = useGameStore((state) => state.clearClaim)
  const claimCooldownMinutes = useGameStore((state) => state.claimCooldownMinutes)
  const [remaining, setRemaining] = useState<number>(claimCooldownMinutes * 60);
  const isOnCooldown = lastCapture && ((new Date().getTime() - lastCapture.getTime()) < (claimCooldownMinutes * 60 * 1000))
  const remainingString = `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if(lastCapture) {

      intervalId = setInterval(() => {
        setRemaining((prev) => {
          if(prev <= 1) {
            clearInterval(intervalId);
            return claimCooldownMinutes * 60;
          }
          else{
            return prev - 1;
          }
        })
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [lastCapture])

  const handleClaim = (equipeKey: string) => {
    if(isOnCooldown) return;
    claim(coords, equipeKey)
  }

  const menuEntries = Object.entries(equipes).map(
    ([key, equipe]) => (
      <Menu.Item 
      key={key} 
      color={equipe.color}
      disabled={isOnCooldown}
      onClick={() => handleClaim(key)}
      >
        {equipe.name}
      </Menu.Item>
    ))

  

  return (
    <Center >
      <Menu>
        <Menu.Target>
          <Button radius={1000} h={150} w={150} size="lg"  variant="filled" color={owner?.color ?? "gray"}>
            <Stack align="center" gap={2}>

              <Text fw={700}>
                {name}
              </Text>
              {isOnCooldown && 
              <Text size="sm" c="grey.2">
                {remainingString}
              </Text>
              }
            </Stack>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {menuEntries}
          <Menu.Divider />
          <Menu.Item color={"gray"} onClick={()=>clearClaim(coords)}>Clear</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Center>
  )
}

export default Jeton