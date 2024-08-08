import React, { useEffect, useState } from 'react';
import HookForm from './HookForm';
import DynamicForm from './DynamicForm';
import { formConfig } from './config';

import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {


  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HookForm />}/>
          <Route path="/dynamic" element={<DynamicForm config={formConfig} />}/>
        </Routes>
      </BrowserRouter>
      {/*  */}
      
    </div>
  );
}

export default App;
