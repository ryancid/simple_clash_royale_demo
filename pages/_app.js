import { CssVarsProvider } from '@mui/joy'
import Layout from 'src/layout/layout'
import 'styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <CssVarsProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CssVarsProvider>
  )
}

export default MyApp
