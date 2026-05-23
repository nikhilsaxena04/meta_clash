// pages/index.js - PREMIUM GLASS LOBBY
import { useEffect, useRef, useState } from 'react';
import wsClient from '../lib/ws';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [lobby, setLobby] = useState(null);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('One Piece');
  const [loadingGame, setLoadingGame] = useState(false);
  const [loadingFact, setLoadingFact] = useState('');

  const facts = [
    "Did you know? The highest possible attribute value is 99.",
    "Did you know? Our bots use the MaxStat algorithm to pick their best attribute.",
    "Did you know? The game automatically adapts to the universe theme you type.",
    "Did you know? 'One Piece' and 'Pokemon' have special hand-curated character stats.",
    "Did you know? Meta Clash was rebuilt in Go for high-performance concurrent play."
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('lastPlayerName') || 'Player');
      setTheme(localStorage.getItem('lastTheme') || 'One Piece');
      setIsLoggedIn(!!localStorage.getItem('meta_clash_token'));
    }

    wsClient.connect();
    
    const onLobbyUpdate = (l) => { setLobby(l); };
    const onGameStarted = (l) => {
      setLobby(l);
      localStorage.setItem('lastLobbyId', l.id);
      setLoadingFact(facts[Math.floor(Math.random() * facts.length)]);
      setLoadingGame(true);
      setTimeout(() => {
        window.location.href = '/game';
      }, 10000);
    };

    wsClient.on('lobbyUpdate', onLobbyUpdate);
    wsClient.on('gameStarted', onGameStarted);
    
    return () => {
      wsClient.off('lobbyUpdate', onLobbyUpdate);
      wsClient.off('gameStarted', onGameStarted);
    };
  }, []);

  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('lastPlayerName', name); }, [name]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('lastTheme', theme); }, [theme]);

  const create = () => wsClient.emit('createLobby', { name, theme }, res => { if (res.ok) setLobby(res.lobby); });
  const join = () => { if (!lobby?.id) return alert('Enter ID'); wsClient.emit('joinLobby', { lobbyId: lobby.id, name }, res => { if (res.ok) setLobby(res.lobby); else alert(res.err); }); };
  const addBot = () => wsClient.emit('addBot', { lobbyId: lobby.id }, res => { if (res.ok) setLobby(res.lobby); });
  const start = () => wsClient.emit('startGame', { lobbyId: lobby.id }, res => { if (!res.ok) alert(res.err); });
  const setLobbyId = (id) => setLobby(l => ({ ...l, id: id }));

  const players = lobby ? lobby.players : [];
  const emptySlots = Array(4 - players.length).fill(null);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">
      <AnimatePresence>
        {loadingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
          >
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8" />
            <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-4 animate-pulse">Summoning Cards...</h2>
            <p className="text-indigo-300 font-mono text-center max-w-lg">{loadingFact}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-premium" />
      <div className="bg-orb w-96 h-96 bg-purple-600 top-10 left-10 opacity-30" />
      <div className="bg-orb w-80 h-80 bg-blue-600 bottom-20 right-20 animation-delay-2000 opacity-30" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="glass-panel w-full max-w-5xl rounded-3xl p-8 md:p-12 relative z-10 grid md:grid-cols-2 gap-16 items-start"
      >
        <div className="space-y-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight leading-tight">
                META<br/>CLASH
              </h1>
              <p className="text-slate-400 text-lg mt-2 font-light tracking-wide">Generate. Battle. Conquer.</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {isLoggedIn ? (
                <a href="/profile" className="px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-bold tracking-widest text-xs hover:bg-indigo-500/30 transition-all uppercase">
                  My Profile
                </a>
              ) : (
                <div className="flex gap-2">
                  <a href="/login" className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-full font-bold tracking-widest text-xs hover:bg-white/10 transition-all uppercase">
                    Login
                  </a>
                  <a href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-full font-bold tracking-widest text-xs hover:bg-indigo-500 transition-all uppercase shadow-lg shadow-indigo-500/30">
                    Register
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest ml-1">Your Identity</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter Nickname" className="glass-input w-full p-4 rounded-xl text-lg font-medium placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-widest ml-1">Universe Theme</label>
              <input value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g. Naruto, Bleach, Sports" className="glass-input w-full p-4 rounded-xl text-lg font-medium placeholder-slate-600 focus:ring-2 focus:ring-purple-500/50" />
            </div>
          </div>

          <div className="pt-2 space-y-4">
             <button onClick={create} disabled={!name || !theme || !!lobby?.id} className={`w-full p-5 rounded-xl font-bold text-xl tracking-widest uppercase transition-all duration-300 ${!name || !theme || !!lobby?.id ? 'opacity-30 bg-slate-800' : 'btn-primary hover:scale-[1.02]'}`}>Create New Lobby</button>
             <div className="flex gap-3 h-14">
               <input value={lobby?.id || ''} onChange={e => setLobbyId(e.target.value.toUpperCase())} placeholder="LOBBY CODE" className="glass-input flex-1 h-full px-4 rounded-xl text-center font-mono text-xl font-bold tracking-widest uppercase border-2 border-transparent focus:border-blue-500" />
               <button onClick={join} className="h-full px-8 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white rounded-xl text-sm font-bold tracking-wider transition-all">JOIN</button>
             </div>
          </div>
          
          {lobby?.id && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 flex justify-between items-center mt-4 backdrop-blur-md">
               <div><div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Status: Active</div><div className="text-3xl font-mono font-bold tracking-widest text-white">{lobby.id}</div></div>
               <div className="flex gap-3">
                 <button onClick={addBot} className="px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-200 rounded-lg text-xs font-bold border border-yellow-500/30 uppercase tracking-wide transition-colors">+ Bot</button>
                 <button onClick={start} disabled={lobby.players.length < 2} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg shadow-red-900/40 uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed">Start</button>
               </div>
            </motion.div>
          )}
        </div>

        <div className="h-full min-h-[500px] bg-black/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
            <div><h3 className="font-bold text-2xl text-white">Lobby List</h3></div>
            <span className="text-sm font-mono bg-white/5 px-3 py-1 rounded-full text-indigo-300 border border-white/10">{players.length} / 4</span>
          </div>
          <div className="space-y-4 flex-1">
            {players.map((p, i) => (
              <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">{p.name[0]}</div>
                <div className="font-bold text-white text-lg">{p.name} {p.isBot && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">BOT</span>}</div>
              </div>
            ))}
            {emptySlots.map((_, i) => (
              <div key={i} className="flex items-center gap-5 p-4 rounded-2xl border-2 border-dashed border-white/5 opacity-40"><div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">+</div><div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Open Slot</div></div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}