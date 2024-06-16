import WeatherContextProvider from './src/Contexts/WeatherContext';
import AppRouter from './src/MainRouter/AppRouter';
import AuthContextProvider from './src/Contexts/AuthContext';
import ReminderContextProvider from './src/Contexts/RemindersContext';

function App() {
  return (
    <AuthContextProvider>
      <WeatherContextProvider>
        <ReminderContextProvider>
          <AppRouter />
        </ReminderContextProvider>
      </WeatherContextProvider>
    </AuthContextProvider>
  );
}

export default App;