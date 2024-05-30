import { useEffect, useState } from 'react';
import PermissionContextProvider from './src/Contexts/PermissionContext';
import WeatherContextProvider from './src/Contexts/WeatherContext';
import AppRouter from './src/MainRouter/AppRouter';
import AuthContextProvider from './src/Contexts/AuthContext';

function App() {
  return (
    <PermissionContextProvider>
      <AuthContextProvider>
        <WeatherContextProvider>
          <AppRouter />
        </WeatherContextProvider>
      </AuthContextProvider>
    </PermissionContextProvider>
  );
}

export default App;