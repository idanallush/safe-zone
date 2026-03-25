import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ClientDetail from './components/ClientDetail';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Budget Pacer</h1>
            <p className="text-sm text-blue-200">Spend Pacing & Overspend Forecasting</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/client/:id" element={<ClientDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
