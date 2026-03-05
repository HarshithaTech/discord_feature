import React, { useRef, useEffect, useState } from 'react';
import {
    Pencil,
    Square,
    Circle as CircleIcon,
    Eraser,
    Trash2,
    X,
    Minus,
    Plus,
    Undo2,
    Redo2,
    Monitor,
    Layout
} from 'lucide-react';

interface WhiteboardProps {
    onClose: () => void;
}

type Tool = 'pencil' | 'rectangle' | 'circle' | 'eraser';

export const Whiteboard: React.FC<WhiteboardProps> = ({ onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<Tool>('pencil');
    const [color, setColor] = useState('#00f0ff');
    const [lineWidth, setLineWidth] = useState(3);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [snapshot, setSnapshot] = useState<ImageData | null>(null);

    // History for Undo/Redo
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isSolidBackground, setIsSolidBackground] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set high resolution
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) return;

        context.scale(dpr, dpr);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;

        // Initialize with empty state (always transparent internally)
        context.clearRect(0, 0, canvas.width, canvas.height);

        const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialState]);
        setHistoryIndex(0);
    }, []);

    // Handle background toggle
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;

        // We don't want to clear the lines, just change the base layer
        // But ImageData includes the background. This is tricky.
        // For now, let's just clear and reset when toggling to avoid artifacts,
        // or accept that toggling background might clear the current board.
        // Better: Just change the container's background class.
    }, [isSolidBackground]);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
            contextRef.current.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        }
    }, [color, lineWidth, tool]);

    const saveToHistory = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;

        const newState = context.getImageData(0, 0, canvas.width, canvas.height);
        const newHistory = history.slice(0, historyIndex + 1);

        // Limit history to 20 steps to save memory
        if (newHistory.length >= 20) {
            newHistory.shift();
            setHistory([...newHistory, newState]);
            setHistoryIndex(newHistory.length);
        } else {
            setHistory([...newHistory, newState]);
            setHistoryIndex(newHistory.length);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            contextRef.current?.putImageData(history[newIndex], 0, 0);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            contextRef.current?.putImageData(history[newIndex], 0, 0);
        }
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCoordinates(e);
        setIsDrawing(true);
        setStartPos({ x, y });

        const context = contextRef.current;
        if (!context) return;

        if (tool === 'pencil' || tool === 'eraser') {
            context.beginPath();
            context.moveTo(x, y);
        }

        // Take snapshot for shape preview OR for saving after pencil stroke
        const canvas = canvasRef.current;
        if (canvas) {
            setSnapshot(context.getImageData(0, 0, canvas.width, canvas.height));
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        const context = contextRef.current;
        if (!context) return;

        if (tool === 'pencil' || tool === 'eraser') {
            context.lineTo(x, y);
            context.stroke();
        } else if (snapshot) {
            context.putImageData(snapshot, 0, 0);

            if (tool === 'rectangle') {
                context.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
            } else if (tool === 'circle') {
                const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
                context.beginPath();
                context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                context.stroke();
            }
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        contextRef.current?.closePath();
        saveToHistory();
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
    };

    return (
        <div className="absolute inset-0 z-20 flex flex-col pointer-events-none overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-center p-4 pointer-events-auto">
                <div className="bg-[#1e1f22]/90 backdrop-blur-md p-2 rounded-2xl border border-[#00f0ff]/20 flex items-center gap-3 shadow-2xl">
                    <div className="flex items-center gap-1 border-r border-[#313338] pr-3 mr-1">
                        <button
                            onClick={() => setIsSolidBackground(!isSolidBackground)}
                            className={`p-2 rounded-lg transition-all flex items-center gap-2 ${isSolidBackground ? 'text-[#949ba4] hover:bg-[#313338]' : 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`}
                            title={isSolidBackground ? "Switch to Annotation Mode" : "Switch to Whiteboard Mode"}
                        >
                            {isSolidBackground ? <Layout className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{isSolidBackground ? 'Board' : 'Draw'}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1 border-r border-[#313338] pr-3 mr-1">
                        {[
                            { id: 'pencil', icon: Pencil },
                            { id: 'rectangle', icon: Square },
                            { id: 'circle', icon: CircleIcon },
                            { id: 'eraser', icon: Eraser },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTool(t.id as Tool)}
                                className={`p-2 rounded-lg transition-all ${tool === t.id ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'text-[#949ba4] hover:bg-[#313338] hover:text-white'}`}
                            >
                                <t.icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 border-r border-[#313338] pr-3">
                        {['#00f0ff', '#ffffff', '#ff4655', '#4caf50', '#ffeb3b'].map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 border-r border-[#313338] pr-3">
                        <button
                            onClick={() => setLineWidth(Math.max(1, lineWidth - 1))}
                            className="p-1 text-[#949ba4] hover:text-white transition"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white text-xs font-bold w-4 text-center">{lineWidth}</span>
                        <button
                            onClick={() => setLineWidth(Math.min(20, lineWidth + 1))}
                            className="p-1 text-[#949ba4] hover:text-white transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 border-r border-[#313338] pr-3">
                        <button
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className={`p-2 rounded-lg transition-all ${historyIndex <= 0 ? 'text-[#313338] cursor-not-allowed' : 'text-[#949ba4] hover:bg-[#313338] hover:text-white'}`}
                            title="Undo"
                        >
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className={`p-2 rounded-lg transition-all ${historyIndex >= history.length - 1 ? 'text-[#313338] cursor-not-allowed' : 'text-[#949ba4] hover:bg-[#313338] hover:text-white'}`}
                            title="Redo"
                        >
                            <Redo2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={clearCanvas}
                            className="p-2 text-[#949ba4] hover:text-[#ff4655] transition rounded-lg hover:bg-[#ff4655]/10"
                            title="Clear All"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-[#949ba4] hover:text-white transition rounded-lg hover:bg-black/20"
                            title="Close Whiteboard"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Drawing Surface */}
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className={`flex-1 w-full h-full pointer-events-auto cursor-crosshair transition-colors duration-500 ${isSolidBackground ? 'bg-black' : 'bg-transparent'}`}
            />

            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
                <p className="text-[10px] text-[#00f0ff]/50 uppercase font-black tracking-[0.2em] bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-[#00f0ff]/10">
                    EduSphere Presentation Overlay Active
                </p>
            </div>
        </div>
    );
};
