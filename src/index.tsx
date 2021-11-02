import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App";
import theme from "./hooks/useStyles";
import AppContextProvider from "./context/appContext";
import Home from "./pages/Home";
import Presets from "./pages/Presets";
import Header from "./components/Header";
import ServiceWorkerWrapper from "./components/ServiceWorkerWrapper";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth='xl' sx={{ py: "2rem" }}>
            <Header />

            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route path='/presets'>
                <Presets />
              </Route>
            </Switch>
          </Container>
          <App />
          <ServiceWorkerWrapper />
        </ThemeProvider>
      </AppContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
