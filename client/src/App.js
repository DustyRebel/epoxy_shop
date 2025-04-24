import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from './components/NavBar';
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
//import './App.css';

const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('token')) {
        check().then(data => {
            user.setUser(data)
            user.setIsAuth(true)
        }).catch(() => {
            user.setIsAuth(false)
            localStorage.removeItem('token')
        }).finally(() => setLoading(false))
    } else {
        setLoading(false)
    }
}, [])

  if (loading){
    return <Spinner animation={"grow"}/>
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
