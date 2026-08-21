import React from 'react';
import { useAuth } from './context/AuthContext';
import { LogIn, LogOut, Car, LayoutDashboard, Route } from 'lucide-react';

export default function App() {
  const { user, loading, login, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfbf9] text-[#2a2928] p-6 selection:bg-[#c8f264] selection:text-[#171717]">
      <main className="w-full max-w-md text-center relative">
        {/* Auth status corner */}
        <div className="absolute -top-16 right-0 flex items-center gap-4">
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-right">
                  <div className="font-bold">{user.displayName || 'User'}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                {user.photoURL && <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />}
                <button onClick={logout} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-red-50 text-red-500 transition-colors shadow-sm">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={login} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-gray-300 font-semibold text-sm transition-colors shadow-sm">
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )
          )}
        </div>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[#c4d1d1] bg-[#edf4f4] text-[#3d7a78] mb-8 shadow-sm">
          <Car className="w-7 h-7" />
        </div>
        
        <h1 className="text-4xl font-bold font-serif text-[#29302a] mb-3 tracking-tight">Lady Driver</h1>
        <p className="text-[#7a837b] mb-12 text-[11px] font-bold uppercase tracking-[0.14em]">Platform Access Portal</p>
        
        <div className="flex flex-col gap-4">
          <a href="/passenger.html" className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-[#e1dfdc] shadow-sm hover:border-[#b92f55] hover:shadow-md transition-all duration-300 outline-none focus:ring-4 focus:ring-[#f9e4e9]">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f9e4e9] text-[#b92f55] transition-transform group-hover:scale-105">
                <Route className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-[#2a2928]">Passenger Booking</span>
                <span className="block text-[13px] text-[#72706e] mt-0.5">Book and track rides</span>
              </div>
            </div>
          </a>
          
          <a href="/admin.html" className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-[#e1dfdc] shadow-sm hover:border-[#3d7a78] hover:shadow-md transition-all duration-300 outline-none focus:ring-4 focus:ring-[#edf4f4]">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf4f4] text-[#3d7a78] transition-transform group-hover:scale-105">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-[#2a2928]">Admin Dispatch</span>
                <span className="block text-[13px] text-[#72706e] mt-0.5">Manage fleet and reports</span>
              </div>
            </div>
          </a>
          
          <a href="/driver.html" className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-[#e1dfdc] shadow-sm hover:border-[#b27c38] hover:shadow-md transition-all duration-300 outline-none focus:ring-4 focus:ring-[#fdfaf2]">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fdfaf2] border border-[#eadfc1] text-[#b27c38] transition-transform group-hover:scale-105">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-[#2a2928]">Driver Console</span>
                <span className="block text-[13px] text-[#72706e] mt-0.5">Accept and complete trips</span>
              </div>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
