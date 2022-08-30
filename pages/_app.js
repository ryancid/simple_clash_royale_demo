import { CssVarsProvider } from "@mui/joy";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <CssVarsProvider>
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}

export default MyApp;
