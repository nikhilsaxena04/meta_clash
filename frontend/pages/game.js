import { useEffect, useState, useRef } from 'react';
import wsClient from '../lib/ws';
import Card from '../components/Card';
import PlayerSeat from '../components/PlayerSeat';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

export default function Game() {
    const [lobby, setLobby] = useState(null);
    const [name, setName] = useState(''); 
    
    // Animation State Machine
    // IDLE -> PLAYING_CARDS -> REVEALING -> EVALUATING -> SWEEPING -> IDLE
    const [animState, setAnimState] = useState('IDLE');
    const [roundData, setRoundData] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setName(localStorage.getItem('lastPlayerName') || 'Player');
        }

        wsClient.connect();

        const onLobbyUpdate = l => { 
            if (animState === 'IDLE') setLobby(l); 
        };
        const onGameStarted = l => { setLobby(l); };
        
        const onRoundResult = data => { 
            setRoundData(data);
            setAnimState('PLAYING_CARDS'); 
            // We deliberately delay setting the lobby state so the animation plays out
        };
        const onConnectError = e => { console.error("Socket Error:", e); };

        wsClient.on('lobbyUpdate', onLobbyUpdate);
        wsClient.on('gameStarted', onGameStarted);
        wsClient.on('roundResult', onRoundResult);
        wsClient.on('connect_error', onConnectError);

        if (typeof window !== 'undefined') {
            const storedLobbyId = localStorage.getItem('lastLobbyId');
            const storedName = localStorage.getItem('lastPlayerName') || 'Player';
            
            if (storedLobbyId) {
                setTimeout(() => {
                    wsClient.emit('joinLobby', { lobbyId: storedLobbyId, name: storedName }, res => {
                        if (res.ok) setLobby(res.lobby);
                        else { localStorage.removeItem('lastLobbyId'); window.location.href = '/'; }
                    });
                }, 100);
            } else { window.location.href = '/'; }
        }
        
        return () => {
            wsClient.off('lobbyUpdate', onLobbyUpdate);
            wsClient.off('gameStarted', onGameStarted);
            wsClient.off('roundResult', onRoundResult);
            wsClient.off('connect_error', onConnectError);
        };
    }, [animState]);

    // Animation Orchestrator
    useEffect(() => {
        if (animState === 'PLAYING_CARDS') {
            // Cards fly to center face down
            const t = setTimeout(() => setAnimState('REVEALING'), 1500);
            return () => clearTimeout(t);
        }
        if (animState === 'REVEALING') {
            // Cards flip face up
            const t = setTimeout(() => setAnimState('EVALUATING'), 2500);
            return () => clearTimeout(t);
        }
        if (animState === 'EVALUATING') {
            // Highlight winning stat
            const t = setTimeout(() => setAnimState('SWEEPING'), 5000);
            return () => clearTimeout(t);
        }
        if (animState === 'SWEEPING') {
            // Cards fly to winner, then apply new state
            const t = setTimeout(() => {
                setLobby(roundData.lobby);
                setRoundData(null);
                setAnimState('IDLE');
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [animState, roundData]);

    const chooseAttr = (attr) => {
        if (!lobby || animState !== 'IDLE') return;
        const me = lobby.players.find(p => p.name === name);
        if (!me) return; 
        
        wsClient.emit('chooseAttribute', { lobbyId: lobby.id, playerId: me.id, attr }, res => {
            if (!res.ok) alert("Error: " + res.err);
        });
    };
    
    useEffect(() => {
        if (lobby && lobby.state !== 'playing' && lobby.state !== 'finished') { window.location.href = '/'; }
    }, [lobby]);

    if (!lobby || lobby.state === 'waiting') return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold tracking-widest animate-pulse select-none">CONNECTING...</div>;

    if (lobby.state === 'finished' && lobby.winner) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden font-sans select-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black z-0" />
                <div className="glass-panel p-16 rounded-3xl text-center relative z-10 border border-yellow-500/30 shadow-[0_0_100px_rgba(234,179,8,0.2)]">
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 mb-6 drop-shadow-xl">VICTORY</h1>
                    <div className="text-4xl font-bold text-white mb-4">🏆 {lobby.winner.name} 🏆</div>
                    <div className="text-xl text-yellow-200/80 font-mono tracking-widest mb-10">WINS: {lobby.winner.totalWins} / 6</div>
                    <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-white text-black font-black tracking-widest rounded-full hover:scale-105 transition-transform shadow-xl cursor-pointer pointer-events-auto">PLAY AGAIN</button>
                </div>
            </div>
        );
    }

    // Radial Seating Logic
    const meIndex = lobby.players.findIndex(p => p.name === name);
    const sortedPlayers = [];
    if (meIndex !== -1) {
        for (let i = 0; i < lobby.players.length; i++) {
            sortedPlayers.push(lobby.players[(meIndex + i) % lobby.players.length]);
        }
    } else {
        // Observer mode fallback
        sortedPlayers.push(...lobby.players);
    }

    // Assign positions based on player count (Max 4)
    const posMap = {
        1: ['bottom'],
        2: ['bottom', 'top'],
        3: ['bottom', 'left', 'right'],
        4: ['bottom', 'left', 'top', 'right']
    }[Math.min(sortedPlayers.length, 4)] || ['bottom'];

    const me = sortedPlayers[0];
    const isMyTurn = lobby.state === 'playing' && lobby.players[lobby.currentPlayerIndex]?.id === me?.id && animState === 'IDLE';
    const myTopCard = me?.hand?.[0];

    // Determine what cards are currently in the center table arena
    const getTableCards = () => {
        if (animState === 'IDLE') return [];
        return roundData?.reveals || [];
    };
    const tableCards = getTableCards();

    return (
        <LayoutGroup>
            <div className="min-h-screen bg-slate-950 p-6 flex flex-col font-sans overflow-hidden relative select-none">
                {/* Background Felt/Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 z-0 pointer-events-none" />

                {/* Header */}
                <header className="flex justify-between items-center p-4 z-20 absolute top-4 left-4 right-4 pointer-events-none">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">META CLASH</h1>
                        <span className="bg-white/5 px-3 py-1 rounded text-xs font-mono tracking-widest text-slate-400 border border-white/10">ROUND {lobby.round} / 6</span>
                    </div>
                    <div className="font-mono text-sm text-slate-500 bg-black/40 px-3 py-1 rounded-lg">ID: {lobby.id}</div>
                </header>

                {/* Player Seats */}
                {sortedPlayers.slice(0,4).map((p, i) => {
                    // Determine if we should hide their top card from their hand 
                    // (because it's in the center OR it's the local player's turn to act)
                    const isCardInCenter = animState !== 'IDLE' && roundData;
                    const isMyActiveCard = isMyTurn && p.id === me?.id;
                    const shouldHideTop = (isCardInCenter || isMyActiveCard) && p.hand;
                    const visualPlayer = { ...p, hand: shouldHideTop ? p.hand.slice(1) : p.hand };
                    
                    return (
                        <PlayerSeat 
                            key={p.id} 
                            player={visualPlayer} 
                            position={posMap[i]} 
                            isTurn={lobby.players[lobby.currentPlayerIndex]?.id === p.id && animState === 'IDLE'}
                            totalPlayers={sortedPlayers.length}
                        />
                    );
                })}

                {/* IDLE Center UI */}
                <AnimatePresence>
                    {animState === 'IDLE' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-y-[15vh] inset-x-4 md:inset-y-[20vh] md:inset-x-12 flex flex-col items-center justify-center z-40 pointer-events-none"
                        >
                            <div className="mb-2 md:mb-4 text-center bg-black/40 backdrop-blur-md px-6 py-3 md:px-8 md:py-4 rounded-3xl border border-white/10 shadow-2xl">
                                <h2 className={`text-2xl md:text-4xl font-black uppercase tracking-tighter ${isMyTurn ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]' : 'text-slate-500'}`}>{isMyTurn ? "YOUR TURN" : `${lobby.players[lobby.currentPlayerIndex]?.name}'s Turn`}</h2>
                                <p className="text-slate-400 mt-1 md:mt-2 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-70">{isMyTurn ? "Select an attack attribute" : "Waiting for opponent move..."}</p>
                            </div>

                            {isMyTurn && myTopCard && (
                                <div className="flex flex-col items-center pointer-events-auto">
                                    <motion.div layoutId={`card-${myTopCard.id}`} className="z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl mb-4 md:mb-6 mt-2 md:mt-4">
                                        <Card card={myTopCard} faceDown={false} />
                                    </motion.div>
                                    
                                    <div className="flex gap-2 md:gap-4 bg-black/50 p-3 md:p-4 rounded-2xl backdrop-blur-xl border border-white/5 shadow-2xl">
                                        {['rank', 'strength', 'speed', 'iq'].map(attr => (
                                            <button
                                                key={attr}
                                                onClick={() => chooseAttr(attr)}
                                                className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-white/5 hover:bg-white/20 text-white font-bold tracking-wider text-xs md:text-sm uppercase transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10 hover:border-white/30"
                                            >
                                                {attr}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Center Table Arena (Horizontal Row) */}
                <div className="absolute inset-y-[15vh] inset-x-4 md:inset-y-[20vh] md:inset-x-12 flex flex-col items-center justify-center z-20 pointer-events-none">
                    {/* Battle Arena Cards */}
                    {tableCards.length > 0 && (
                        <div className={`flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 md:gap-6 transition-all duration-1000 ease-in-out ${animState === 'SWEEPING' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}>
                            {tableCards.map((card, i) => {
                                if (!card) return null;
                                const p = lobby.players[i];
                                const isWinner = roundData.winnerIds && roundData.winnerIds.includes(p.id);
                                const isFaceDown = animState === 'PLAYING_CARDS';
                                const layoutId = card.id ? `card-${card.id}` : `card-hidden-${p.id}-0`;

                                return (
                                    <div key={i} className={`relative flex flex-col items-center`}>
                                        <span className="absolute -top-6 text-[10px] md:text-xs font-black text-slate-400 tracking-widest">{p.name}</span>
                                        <div className="scale-75 md:scale-90 shadow-2xl">
                                            <Card 
                                                card={card} 
                                                faceDown={isFaceDown} 
                                                selected={animState === 'EVALUATING' && isWinner} 
                                                layoutId={layoutId} 
                                            />
                                        </div>
                                        {animState === 'EVALUATING' && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`absolute -bottom-8 px-4 py-1 rounded-full text-xs font-black tracking-widest z-40 ${isWinner ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'bg-slate-800 text-slate-400'}`}
                                            >
                                                {card.stats[roundData.attr]} {roundData.attr}
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </LayoutGroup>
    );
}