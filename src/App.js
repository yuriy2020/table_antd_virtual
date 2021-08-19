import React from 'react'
import Incidents from "./components/_Incidents"
import {ThemeProvider} from 'react-jss-10'

import { theme } from './theme'


function App() {
  return (<ThemeProvider theme={theme}><Incidents /></ThemeProvider>
  )
}

export default App

