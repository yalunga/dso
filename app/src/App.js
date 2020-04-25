import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './scenes/Home';
import User from './scenes/User';
import Product from './scenes/Product';
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/user' component={User} />
        <Route path='/product/:id' component={Product} />
        <Route path='/' component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
