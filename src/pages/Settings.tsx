import React from 'react';
import { useAuth } from '../store/AuthContext';
import { logOut } from '../lib/firebase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      </header>

      <Card className="space-y-4">
        <h2 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Account</h2>
        <div className="flex justify-between items-center py-2">
          <div>
            <p className="font-medium">Signed in as</p>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
          <Button variant="outline" onClick={logOut}>Sign Out</Button>
        </div>
      </Card>
      
      <Card className="space-y-4">
        <h2 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Preferences</h2>
        <div className="flex justify-between items-center py-2">
          <p className="font-medium">Theme</p>
          <select 
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
            onChange={(e) => {
              if (e.target.value === 'dark') {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
              } else {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
              }
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </Card>
    </div>
  );
};
