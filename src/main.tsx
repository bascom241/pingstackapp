import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { theme } from './ui/theme.ts'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from "notistack"
import {Fade, Grow, Slide} from '@mui/material'
import { SlowSlide } from './ui/Slide.tsx'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <QueryClientProvider client={queryClient}>
      <BrowserRouter>

        <SnackbarProvider maxSnack={2} anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
          autoHideDuration={3000}
        TransitionComponent={SlowSlide}
        >
          <App />
        </SnackbarProvider>

      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>

)
