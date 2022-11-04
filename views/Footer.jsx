
import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import * as React from 'react'
import { FaGithub, FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import { Logo } from './Logo'

export const Footer = () => (
  <Container as="footer" role="contentinfo">
    <Stack
      spacing="8"
      direction={{
        base: 'column',
        md: 'row',
      }}
      justify="space-between"
      py={{
        base: '12',
        md: '16',
      }}
    >
      <Stack
        spacing={{
          base: '6',
          md: '8',
        }}
        align="start"
      >
        <Logo />
        <Text color="muted">Spore Engineering, Blockchain & Web3 factory, DAOs, NFTs, DeFi. </Text>
      </Stack>
      <Stack
        direction={{
          base: 'column-reverse',
          md: 'column',
          lg: 'row',
        }}
        spacing={{
          base: '12',
          md: '8',
        }}
      >
        <Stack direction="row" spacing="8">
          <Stack spacing="4" minW="36" flex="1">
            <Text fontSize="sm" fontWeight="semibold" color="subtle">
              Ecosystem
            </Text>
            <Stack spacing="3" shouldWrapChildren>
              <Button variant="link" onClick={()=> window.open("https://spore.engineering", "_blank")}>Site</Button>
              <Button variant="link" onClick={()=> window.open("https://pancakeswap.finance/swap?inputCurrency=0x77f6a5f1b7a2b6d6c322af8581317d6bb0a52689", "_blank")}>Buy Spore</Button>
              <Button variant="link" onClick={()=> window.open("https://pancakeswap.finance/swap?inputCurrency=0x878b87Ce0d7D877855a65492EB6a4Ca50849aC97", "_blank")}>Buy Condor</Button>
              <Button variant="link" onClick={()=> window.open("https://snapshot.org/#/spore-engineering.eth", "_blank")}>Governance</Button>
            </Stack>
          </Stack>
          <Stack spacing="4" minW="36" flex="1">
            <Text fontSize="sm" fontWeight="semibold" color="subtle">
              Socials
            </Text>
            <Stack spacing="3" shouldWrapChildren>
              <Button variant="link" onClick={()=> window.open("https://twitter.com/spore_eng", "_blank")}>Twitter</Button>
              <Button variant="link" onClick={()=> window.open("https://spore-eng.medium.com", "_blank")}>Medium</Button>
              <Button variant="link" onClick={()=> window.open("https://discord.com/invite/J3v2tf7dwE", "_blank")}>Discord</Button>
              <Button variant="link" onClick={()=> window.open("https://t.me/spore_engineering", "_blank")}>Telegram</Button>
              <Button variant="link" onClick={()=> window.open("https://github.com/spore-engineering", "_blank")}>Github</Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
    <Divider />
    <Stack
      pt="8"
      pb="12"
      justify="space-between"
      direction={{
        base: 'column-reverse',
        md: 'row',
      }}
      align="center"
    >
      <Text fontSize="sm" color="subtle">
        &copy; {new Date().getFullYear()} Spore Engineering, All rights reserved.
      </Text>
      <ButtonGroup variant="ghost">
        <IconButton
          aria-label="Telegram"
          icon={<FaTelegramPlane fontSize="1.25rem" />}
          onClick={()=> window.open("https://t.me/spore_engineering", "_blank")}
        />
        <IconButton aria-label="GitHub" icon={<FaGithub fontSize="1.25rem" />} onClick={()=> window.open("https://github.com/spore-engineering", "_blank")} />
        <IconButton aria-label="Twitter" icon={<FaTwitter fontSize="1.25rem" />} onClick={()=> window.open("https://twitter.com/spore_eng", "_blank")} />
      </ButtonGroup>
    </Stack>
  </Container>
)