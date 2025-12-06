import { Container, useTheme } from '@mui/joy'
import { Box } from '@mui/system'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme()
  return (
    <Box sx={{ background: theme.palette.neutral[100] }}>
      <Box
        sx={{
          marginBottom: 1,
          paddingX: 0.5,
          background: theme.palette.neutral[700],
          color: theme.palette.common.white,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: theme.palette.neutral[600],
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
