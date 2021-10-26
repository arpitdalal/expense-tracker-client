import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";

import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import theme from "./hooks/useStyles";
import AppContextProvider from "./context/appContext";
import Home from "./pages/Home";
import Presets from "./pages/Presets";
import Header from "./components/Header";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <Container maxWidth='xl'>
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
        </ThemeProvider>
      </AppContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) =>
    registration.waiting?.postMessage({ type: "SKIP_WAITING" }),
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
