import React from 'react'
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/Login/Login'
import NewSandBox from '../views/NewSandBox/NewSandBox'
import '../App.css'

export default function IndexRoute() {
  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login}></Route>
        {/* <Route path='/' component={NewSandBox}></Route> */}
        <Route path='/' render={() => (localStorage.getItem('token') ? <NewSandBox /> : <Redirect to='/login' />
        )}></Route>
      </Switch>
    </Router>
  )
}