import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { theme } from '@chakra-ui/pro-theme'
import '@fontsource/inter/variable.css'

function MyApp({ Component, pageProps }) {
  const myTheme = extendTheme(
    {
      colors: { ...theme.colors, brand: theme.colors.red },
    },
    theme,
  )
  
  return (
    <ChakraProvider theme={myTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
