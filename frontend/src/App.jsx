// import { useState } from "react";
// import "./App.css";
// import AppRoutes from "./routes/AppRoutes";

// function App() {
  

//   return (
//    <div className="App">
//       <AppRoutes />
//    </div>
//   );
// }

// export default App;


import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Sidebar_Primary from "./components/Sidebar_Primary";
import Header from "./components/Header";
import InputField from "./components/InputField"; 

const App = () => {
  return (
    <div className="app-container">
      <Sidebar_Primary />  {/* Main Sidebar should be here */}
      <div className="content">
        <Header />
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;

