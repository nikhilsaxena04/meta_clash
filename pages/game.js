// pages/game.js - THE NEW DEDICATED GAME SCREEN (FINAL CORRECTED VERSION)
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Card from '../components/Card';

let socket;

export default function Game() {
    const [lobby, setLobby] = useState(null);
    const [logs, setLogs] = useState([]);
    const [lastRound, setLastRound] = useState(null);
    const mySocket = useRef(null);

    // pages/game.js - Simplified useEffect for robust localStorage recovery

useEffect(() => {
    socket = io();
    socket.on('connect', () => { mySocket.current = socket.id; setLogs(l => ['connected', ...l].slice(0, 50)); });
    socket.on('lobbyUpdate', l => { setLobby(l); setLogs(lg => ['lobby updated', ...lg].slice(0, 50)); });
    socket.on('gameStarted', l => { setLobby(l); setLogs(lg => ['game started', ...lg].slice(0, 50)); });
    socket.on('roundResult', data => { setLastRound(data); setLobby(data.lobby); setLogs(lg => [`round ${data.lobby.round - 1} ${data.attr}`, ...lg].slice(0, 50)); });
    socket.on('connect_error', e => setLogs(l => ['conn err ' + e.message, ...l].slice(0, 50)));

    // SIMPLIFIED RECOVERY LOGIC (Since useEffect guarantees browser environment)
    const storedLobbyId = localStorage.getItem('lastLobbyId');
    const storedName = localStorage.getItem('lastPlayerName') || 'Player';
    
    if (storedLobbyId) {
        socket.emit('joinLobby', { lobbyId: storedLobbyId, name: storedName }, res => {
            if (res.ok) {
                setLobby(res.lobby);
                // If game is already running (state='playing'), the user is recovered
            } else if (res.err === 'full' || res.err === 'no lobby') {
                // If rejoin fails, clear local storage and redirect to setup
                localStorage.removeItem('lastLobbyId');
                window.location.href = '/'; 
            } else {
                setLogs(l => ['Failed to rejoin ' + res.err, ...l].slice(0, 50));
            }
        });
    } else {
        // If there's no stored ID, redirect to setup
        window.location.href = '/';
    }
    
    return () => socket?.disconnect();
}, []);

    const chooseAttr = (attr) => {
        if (!lobby) return;
        const me = lobby.players.find(p => p.socketId === mySocket.current);
        if (!me) return alert('not in lobby');
        socket.emit('chooseAttribute', { lobbyId: lobby.id, playerId: me.id, attr }, res => {
            if (!res.ok) setLogs(lg => ['choose err ' + res.err, ...lg].slice(0, 50));
        });
    };
    
    const me = lobby?.players?.find(p => p.socketId === mySocket.current);
    const isMyTurn = lobby?.state === 'playing' && lobby?.players[lobby.currentPlayerIndex]?.id === me?.id;
    const myTopCard = me?.hand?.[0];

    // Redirect to the main page if lobby state isn't right
    useEffect(() => {
        if (lobby && lobby.state !== 'playing' && lobby.state !== 'finished') {
            // Note: window.location is safe here because it's inside useEffect
            window.location.href = '/'; 
        }
    }, [lobby]);

    if (!lobby || lobby.state === 'waiting') return <div className="p-6 text-xl">Loading Game...</div>;

    // --- Winner Screen ---
    if (lobby.state === 'finished' && lobby.winner) {
        return (
            <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                <h1 className="text-5xl font-extrabold text-emerald-400 mb-4">GAME OVER!</h1>
                <div className="text-3xl font-bold mb-8">🏆 {lobby.winner.name} WINS! 🏆</div>
                <div className="text-xl">Final Score: {lobby.winner.totalWins} rounds won.</div>
                <button onClick={() => window.location.href = '/'} className="mt-8 bg-indigo-600 px-6 py-3 rounded text-lg">New Lobby</button>
            </div>
        );
    }


    return (
        <div className="p-6 flex gap-8 h-full">
            <div className="w-[300px] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Round {lobby.round} of 6</h2>
                
                <div className="bg-slate-800 p-4 rounded mb-4">
                    <h3 className="font-semibold text-xl mb-3">Players</h3>
                    <div className="space-y-3">{lobby.players.map(p => (
                        <div key={p.id} className={`flex items-center gap-3 p-2 rounded ${p.id === lobby.players[lobby.currentPlayerIndex]?.id ? 'bg-indigo-900 border border-indigo-500' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">{p.name[0]}</div>
                            <div className="flex-1">
                                <div className="font-medium">{p.name} {p.isBot && <span className="text-xs text-yellow-300">BOT</span>}</div>
                                <div className="text-xs text-slate-400">Score: {p.totalWins || 0}</div>
                            </div>
                        </div>
                    ))}</div>
                </div>

                <div className="bg-slate-800 p-4 rounded flex-grow overflow-auto">
                    <h3 className="font-semibold mb-2">Logs</h3>
                    <div className="text-xs bg-slate-900 p-2 rounded h-40 overflow-auto">{logs.map((l, i) => <div key={i}>{l}</div>)}</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold">Card Battle</h1>
                    <div className="text-lg font-mono bg-slate-700 px-4 py-2 rounded">Lobby ID: {lobby.id}</div>
                </div>

                {/* --- Current Card Section --- */}
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 rounded-xl p-6 mb-6 relative">
                    <div className="text-center mb-6">
                        <div className="text-3xl font-semibold">
                            {isMyTurn ? "YOUR TURN TO CHOOSE ATTRIBUTE" : `${lobby?.players[lobby.currentPlayerIndex]?.name || 'Player'}'s turn`}
                        </div>
                        <div className="text-lg text-slate-400">Hand: {me?.hand?.length} cards left.</div>
                    </div>
                    
                    <div className="mb-8">
                        {myTopCard ? <Card card={myTopCard} selected={isMyTurn} /> : <div className="text-xl text-red-400">No cards left!</div>}
                    </div>

                    {/* Controls/Attributes */}
                    {isMyTurn && (
                        <div className="flex gap-4 p-4 bg-slate-800 rounded-lg">
                            {Object.keys(myTopCard?.stats || {}).map(attr => (
                                <button key={attr} 
                                        onClick={() => chooseAttr(attr)} 
                                        className="bg-indigo-600 px-4 py-3 rounded text-sm font-bold capitalize hover:bg-indigo-500 transition-colors">
                                    {attr} ({myTopCard.stats[attr]})
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Last Round Results --- */}
                <div className="bg-slate-800 p-4 rounded">
                    <h3 className="font-semibold text-xl mb-3">Last Round Result</h3>
                    {lastRound ? (
                        <div>
                            <div className="mb-2">Winner: <b className="text-emerald-400">{lobby.players.find(p => p.id === lastRound.winnerId)?.name || lastRound.winnerId}</b> won using attribute: <b>{lastRound.attr}</b></div>
                            <div className="flex gap-4 mt-2 overflow-x-auto pb-2">{lastRound.reveals.map((c, i) => (c ? <Card key={i} card={c} revealed /> : <div key={i} className="w-44 h-72 bg-slate-900 rounded opacity-50" />))}</div>
                        </div>
                    ) : <div className="text-sm text-slate-400">No rounds played yet.</div>}
                </div>
            </div>
        </div>
    );
}