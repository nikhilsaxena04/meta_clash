// pages/index.js - FINAL CORRECTED VERSION (Automated Socket Init)
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Card from '../components/Card';
let socket;

export default function Home(){
  const [connected, setConnected] = useState(false);
  const [lobby, setLobby] = useState(null);
  const [name, setName] = useState('Player');
  const [theme, setTheme] = useState('One Piece');
  const [logs, setLogs] = useState([]);
  const mySocket = useRef(null);

  // 1. Main useEffect for initialization and socket connection
  useEffect(() => {
    // FIX: Load state from localStorage AFTER component mounts
    if (typeof window !== 'undefined') {
        setName(localStorage.getItem('lastPlayerName') || 'Player');
        setTheme(localStorage.getItem('lastTheme') || 'One Piece');
    
        // AUTOMATION FIX: Force the Socket.io API route to initialize
        fetch('/api/socket'); 
    }

    socket = io();
    socket.on('connect', ()=>{ setConnected(true); mySocket.current = socket.id; setLogs(l=>['connected',...l].slice(0,50)); });
    socket.on('lobbyUpdate', l => { setLobby(l); setLogs(lg=>['lobby updated',...lg].slice(0,50)); });
    
    // REDIRECT TO GAME SCREEN ON START
    socket.on('gameStarted', l => { 
        setLobby(l); 
        localStorage.setItem('lastLobbyId', l.id);
        window.location.href = '/game'; 
    });
    
    socket.on('connect_error', e => setLogs(l=>['conn err '+e.message,...l].slice(0,50)));
    return ()=> socket?.disconnect();
  },[]);

  // 2. Update localStorage whenever state changes
  useEffect(() => { 
      if (typeof window !== 'undefined') localStorage.setItem('lastPlayerName', name); 
  }, [name]);
  useEffect(() => { 
      if (typeof window !== 'undefined') localStorage.setItem('lastTheme', theme); 
  }, [theme]);

  function addLog(m){ setLogs(s => [m, ...s].slice(0,50)); }
  const create = ()=> socket.emit('createLobby', { name, theme }, res=>{ if (res.ok){ setLobby(res.lobby); addLog('created '+res.lobby.id);} });
  const join = ()=> { if (!lobby?.id) return alert('Enter a Lobby ID or Create first'); socket.emit('joinLobby', { lobbyId: lobby.id, name }, res=>{ if (res.ok) setLobby(res.lobby); else alert(res.err); }); };
  const addBot = ()=> socket.emit('addBot', { lobbyId: lobby.id }, res=>{ if (res.ok) setLobby(res.lobby); });
  const start = ()=> socket.emit('startGame', { lobbyId: lobby.id }, res=>{ if (res.ok) addLog('started'); else alert(res.err); });
  
  // Custom setter for lobby ID when joining
  const setLobbyId = (id) => setLobby(l => ({ ...l, id: id }));
  const canStart = lobby && lobby.players.length >= 2 && lobby.players.length <= 4 && lobby.state === 'waiting';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Instant Card Lobby (Setup)</h1>
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-slate-800 p-4 rounded mb-4">
            <div className="flex gap-2">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" className="p-2 rounded bg-slate-900" />
              <input value={theme} onChange={e=>setTheme(e.target.value)} placeholder="Anime Theme (e.g., One Piece)" className="p-2 rounded bg-slate-900 flex-1" />
              <button className="bg-emerald-500 px-3 rounded hover:bg-emerald-400" onClick={create} disabled={!name || !theme || !!lobby?.id}>Create</button>
            </div>
            
            <div className="mt-2 flex gap-2">
              <input value={lobby?.id||''} onChange={e => setLobbyId(e.target.value.toUpperCase())} placeholder="Lobby ID" className="p-2 rounded bg-slate-900 w-36" />
              <button className="bg-blue-500 px-3 rounded hover:bg-blue-400" onClick={join}>Join</button>
              <button className="bg-yellow-500 px-3 rounded hover:bg-yellow-400" onClick={addBot} disabled={!lobby}>Add Bot</button>
              <button className="bg-red-500 px-3 rounded hover:bg-red-400" onClick={start} disabled={!canStart}>Start ({lobby?.players.length}/4)</button>
            </div>
            
            <div className="mt-2 text-sm text-slate-400">
                Lobby Status: {lobby ? `${lobby.id} (${lobby.players.length}/4) - ${lobby.state}` : 'Not in a lobby'}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded">
            <h3 className="font-semibold">Lobby JSON (Server State)</h3>
            <pre className="text-xs bg-slate-900 p-3 rounded max-h-64 overflow-auto">{lobby ? JSON.stringify(lobby, null, 2) : 'No lobby'}</pre>
          </div>
        </div>

        <div className="w-[480px]">
             <div className="bg-slate-800 p-4 rounded">
                <h3 className="font-semibold">Players In Lobby</h3>
                <div className="mt-2 space-y-2">{lobby && lobby.players && lobby.players.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">{p.name[0]}</div>
                    <div className="flex-1"><div className="font-medium">{p.name} {p.isBot && <span className="text-xs text-yellow-300">BOT</span>}</div><div className="text-xs text-slate-400">Status: {p.hand?.length > 0 ? 'Ready' : 'Waiting'}</div></div>
                  </div>
                ))}</div>
            </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Logs</h3>
        <div className="bg-slate-900 p-3 rounded h-36 overflow-auto text-sm">{logs.map((l,i)=><div key={i}>{l}</div>)}</div>
      </div>
    </div>
  );
}