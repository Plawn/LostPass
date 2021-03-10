import React from 'react';
import { RecoilRoot } from 'recoil';
import MyRouter from './components/common/Router/Router';

const App = () => (
  <RecoilRoot>
    <MyRouter />
  </RecoilRoot>
);

export default App;