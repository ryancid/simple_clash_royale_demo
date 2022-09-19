import { Container, useTheme } from '@mui/joy'
import { Box } from '@mui/system'
import Link from 'next/link'

const Layout = ({ children }) => {
  const theme = useTheme()
  return (
    <Box sx={{ background: theme.palette.neutral[100] }}>
      <Box
        border={`1px solid ${theme.palette.neutral.solidBorder}`}
        sx={{
          marginBottom: 1,
          paddingX: 0.5,
          background: theme.palette.neutral.solidBg,
          color: theme.palette.common.white,
          height: 40,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container
          sx={{ display: 'flex', justifyContent: 'space-between', paddingY: 0.5 }}
        >
          <Link href={'/'}> Home with Logo</Link>
          <Link href={'/cardList'}>Cards</Link>
          <Link href={'/players'}>players</Link>
        </Container>
      </Box>
      <Container sx={{minHeight: 'calc(100vh - 96px)'}}>{children}</Container>
      <Box
        sx={{
          marginTop: 1,
          padding: 0.5,
          background: theme.palette.neutral[500],
          color: theme.palette.common.white,
          height:40,
        }}
      >
        this is footer
      </Box>
    </Box>
  )
}

export default Layout
