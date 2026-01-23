import React, { useState, useEffect } from 'react';
import { 
    Volume2, ArrowRight, Check, X, Globe, BookOpen, Info, RefreshCw, 
    Users, MapPin, Briefcase, Stethoscope, GraduationCap, PenTool, 
    Wrench, ChevronDown, ChevronRight, Layout, Star, Zap, Award, ArrowLeft,
    Clock, Calendar, Heart, User, Home, Sun, Moon, Coffee, Briefcase as WorkIcon,
    Palette, Gavel, Truck, Search, Music, Camera, Scissors, MessageCircle, Sunrise, Sunset,
    Flag, Layers, Type, AlertTriangle, Calculator, Hand, MoveRight, Hash,
    Smile, Frown, ThumbsUp, ThumbsDown, StopCircle, Play, Pause, Repeat, Mic, Headphones, 
    Sofa, Bed, Utensils, Bath, Tv, Watch, CalendarDays, HelpCircle, Target, Battery, 
    BatteryCharging, BatteryFull, Lock, Key, Baby, UserPlus, Monitor, Shield, Sprout, Landmark,
    Sparkles, ShieldCheck, Rocket, ZapIcon
} from 'lucide-react';

// --- Styles ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Nunito:wght@400;700&family=Playfair+Display:wght@700&display=swap');
  body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
  .font-hand { font-family: 'Nunito', sans-serif; }
  .font-serif-display { font-family: 'Playfair Display', serif; }
  
  /* Animations */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in { animation: fadeIn 0.8s ease-out; }
  
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .animate-slide-up { animation: slideUp 0.6s ease-out; }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* Glassmorphism */
  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .glass-card:hover {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .sidebar-glass {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

// --- Helper: Speech Synthesis ---
const speak = (text: string, lang = 'en-US', rate = 0.9) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
        (voice.lang === 'en-US' && (
            voice.name.includes('Google US English') || 
            voice.name.includes('Samantha') ||          
            voice.name.includes('Zira') ||              
            voice.name.includes('Female')               
        ))
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.lang = lang;
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
};

// --- CONTENT COMPONENTS ---

const GreetingsFarewells = () => {
    const timeGreetings = [
        { phrase: "Good morning", time: "05:00 - 12:00", icon: <Sunrise className="text-orange-400"/>, context: "Start of the day" },
        { phrase: "Good afternoon", time: "12:00 - 18:00", icon: <Sun className="text-yellow-500"/>, context: "After lunch" },
        { phrase: "Good evening", time: "18:00 - 21:00", icon: <Sunset className="text-indigo-400"/>, context: "Arrival / Dinner" },
        { phrase: "Good night", time: "End of day", icon: <Moon className="text-slate-600"/>, context: "Sleeping / Bye" },
    ];
    const socialGreetings = [
        { type: 'Formal', color: 'bg-slate-100 border-slate-200', items: ['Hello', 'How are you?', 'Nice to meet you', 'Goodbye'] },
        { type: 'Informal', color: 'bg-indigo-50 border-indigo-200', items: ['Hi', "What's up?", 'Good to see you', 'See ya'] }
    ];
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-900">
                    <strong>Teacher's Tip:</strong> "Good evening" is used when you <em>arrive</em> somewhere at night. "Good night" is ONLY used when you are <em>leaving</em> or going to sleep.
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-600" /> Time of Day</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {timeGreetings.map((item, idx) => (
                        <button key={idx} onClick={() => speak(item.phrase)} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-slate-50 transition-all group text-left">
                            <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-700 text-lg group-hover:text-indigo-700">{item.phrase}</h4>
                                <span className="text-xs text-slate-400 font-mono">{item.time} • {item.context}</span>
                            </div>
                            <Volume2 className="ml-auto w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {socialGreetings.map((group) => (
                    <div key={group.type} className={`p-6 rounded-2xl border-2 ${group.color}`}>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            {group.type === 'Formal' ? <Briefcase className="w-5 h-5"/> : <MessageCircle className="w-5 h-5"/>}
                            {group.type}
                        </h3>
                        <div className="space-y-2">
                            {group.items.map((text) => (
                                <button key={text} onClick={() => speak(text)} className="w-full text-left px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                                    <span className="font-medium text-slate-700">{text}</span>
                                    <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500"/>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AlphabetSpelling = () => {
    const soundGroups = [
        { sound: '/eɪ/ (ay)', letters: ['A', 'H', 'J', 'K'] },
        { sound: '/iː/ (ee)', letters: ['B', 'C', 'D', 'E', 'G', 'P', 'T', 'V', 'Z*'] },
        { sound: '/ɛ/ (eh)', letters: ['F', 'L', 'M', 'N', 'S', 'X'] },
        { sound: '/aɪ/ (eye)', letters: ['I', 'Y'] },
        { sound: '/oʊ/ (oh)', letters: ['O'] },
        { sound: '/juː/ (you)', letters: ['Q', 'U', 'W'] },
        { sound: '/ɑːr/ (ar)', letters: ['R'] },
    ];
    const [activeLetter, setActiveLetter] = useState<string | null>(null);
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Phonetic Groups</h3>
                <p className="text-slate-500 text-sm mb-6">Letters in English are easier to remember when grouped by their vowel sound.</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {soundGroups.map((group, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-indigo-200 transition-colors">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between">
                                <span>Sound: {group.sound}</span>
                                <Volume2 className="w-3 h-3 cursor-pointer" onClick={() => speak(group.letters.join(', '))} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {group.letters.map(letter => (
                                    <button key={letter} onClick={() => { setActiveLetter(letter); speak(letter.replace('*','')); }}
                                        className={`w-10 h-10 rounded-lg font-bold text-lg shadow-sm transition-all ${activeLetter === letter ? 'bg-indigo-600 text-white scale-110' : 'bg-white text-slate-700 hover:bg-indigo-50'}`}
                                    > {letter.replace('*','')} </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 text-right">* In US English, Z is /ziː/. In UK English, it's /zɛd/.</p>
            </div>
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PenTool className="w-5 h-5" /> Spelling Practice</h3>
                <p className="text-indigo-200 mb-6 text-sm">How do you spell your name?</p>
                <div className="bg-indigo-800/50 p-6 rounded-xl border border-indigo-700 w-full max-w-lg">
                    <p className="font-hand text-2xl mb-4">"My name is <span className="text-yellow-400">Sarah</span>"</p>
                    <div className="flex justify-center gap-2">
                        {['S', 'A', 'R', 'A', 'H'].map((l, i) => (
                            <button key={i} onClick={() => speak(l)} className="w-12 h-12 rounded-lg bg-white text-indigo-900 font-bold text-xl hover:scale-110 transition-transform shadow-lg border-b-4 border-indigo-300 active:border-b-0 active:translate-y-1"> {l} </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SubjectPronouns = () => {
    const pronouns = [
        { group: "Singular (1 Person)", color: "bg-emerald-50 border-emerald-100", list: [
            { word: 'I', desc: 'Me (The speaker)', icon: '🙋‍♂️' },
            { word: 'You', desc: 'The person listening', icon: '🫵' },
            { word: 'He', desc: 'A man / Boy', icon: '👨' },
            { word: 'She', desc: 'A woman / Girl', icon: '👩' },
            { word: 'It', desc: 'Object / Animal', icon: '🐶' },
        ]},
        { group: "Plural (2+ People)", color: "bg-blue-50 border-blue-100", list: [
            { word: 'We', desc: 'Me + You + Others', icon: '👨‍👩‍👧‍👦' },
            { word: 'You', desc: 'You guys / Y\'all', icon: '👥' },
            { word: 'They', desc: 'Other people / Things', icon: '👉👉' },
        ]}
    ];
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-600" /> The Subjects</h3>
                <p className="text-slate-500 mb-8">Subject pronouns replace the <strong>name</strong> of the person or thing doing the action.</p>
                <div className="grid md:grid-cols-2 gap-8">
                    {pronouns.map((cat, idx) => (
                        <div key={idx} className={`rounded-2xl p-6 border-2 ${cat.color}`}>
                            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-sm mb-4 border-b pb-2 border-slate-200/50">{cat.group}</h4>
                            <div className="space-y-3">
                                {cat.list.map(p => (
                                    <div key={p.word} onClick={() => speak(p.word)} className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                        <div className="text-2xl w-10 text-center">{p.icon}</div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-800">{p.word}</div>
                                            <div className="text-xs text-slate-400 font-bold">{p.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const VerbToBeAffirmative = () => {
    const structure = [
        { person: 'I', verb: 'am', contract: "I'm" },
        { person: 'He / She / It', verb: 'is', contract: "He's / She's" },
        { person: 'We / You / They', verb: 'are', contract: "We're / They're" }
    ];
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">The "Equals" Sign (=) of English</h3>
                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    <div className="grid grid-cols-3 bg-slate-100 p-3 font-bold text-slate-500 text-xs uppercase tracking-wider">
                        <div>Subject</div><div>Verb</div><div>Contraction</div>
                    </div>
                    {structure.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-3 p-4 border-b border-slate-200 last:border-0 hover:bg-white transition-colors cursor-pointer" onClick={() => speak(`${row.person} ${row.verb}`)}>
                            <div className="font-bold text-slate-700">{row.person}</div>
                            <div className="text-indigo-600 font-bold">{row.verb}</div>
                            <div className="text-emerald-600 font-mono">{row.contract}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const VerbToBeNegInt = () => {
    const [mode, setMode] = useState<'neg' | 'int'>('neg');
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex bg-slate-200 p-1 rounded-xl w-full max-md mx-auto">
                <button onClick={() => setMode('neg')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'neg' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>
                    <X className="w-4 h-4"/> Negative (NOT)
                </button>
                <button onClick={() => setMode('int')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'int' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
                    <RefreshCw className="w-4 h-4"/> Interrogative (?)
                </button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col items-center justify-center">
                {mode === 'neg' ? (
                    <div className="w-full max-w-lg animate-fade-in">
                        <h3 className="text-xl font-bold text-center text-slate-800 mb-2">The Power of "NOT"</h3>
                        <p className="text-center text-slate-500 mb-8">Just add <strong>NOT</strong> after the verb (am, is, are).</p>
                        <div className="flex items-center justify-center gap-3 text-lg md:text-2xl p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="font-bold text-slate-700">She</span><span className="font-bold text-indigo-600">is</span><span className="font-extrabold text-white bg-rose-500 px-3 py-1 rounded-lg shadow-sm animate-bounce-slow">not</span><span className="text-slate-600">sad.</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-lg animate-fade-in text-center">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">The Switch Trick</h3>
                        <p className="text-slate-500 mb-8">To ask a question, the Verb and the Subject <strong>switch places</strong>.</p>
                        <div className="relative h-32 flex items-center justify-center gap-8 text-2xl font-bold">
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-xs uppercase text-slate-400 tracking-wider">Statement</div>
                                <div className="flex gap-4 p-3 bg-slate-50 rounded-xl opacity-50"><span className="text-slate-700">You</span><span className="text-indigo-600">are</span></div>
                            </div>
                            <ArrowRight className="w-8 h-8 text-slate-300" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-xs uppercase text-indigo-400 font-bold tracking-wider">Question</div>
                                <div className="flex gap-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm"><span className="text-indigo-600 order-first">Are</span><span className="text-slate-700">you?</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const IndefiniteArticles = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">A</div>
                <h3 className="font-bold text-slate-800 mb-2">+ Consonant SOUND</h3>
                <div className="space-y-2 w-full">
                    {['A cat', 'A house', 'A university'].map(t => <button key={t} onClick={() => speak(t)} className="w-full p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-slate-700 font-bold">{t}</button>)}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">AN</div>
                <h3 className="font-bold text-slate-800 mb-2">+ Vowel SOUND</h3>
                <div className="space-y-2 w-full">
                    {['An apple', 'An elephant', 'An hour'].map(t => <button key={t} onClick={() => speak(t)} className="w-full p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-slate-700 font-bold">{t}</button>)}
                </div>
            </div>
        </div>
    </div>
);

const JobsOccupations = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        {[
            { title: 'Doctor', icon: '👨‍⚕️' }, { title: 'Nurse', icon: '👩‍⚕️' }, { title: 'Teacher', icon: '👨‍🏫' }, { title: 'Engineer', icon: '👷' },
            { title: 'Artist', icon: '🎨' }, { title: 'Chef', icon: '👨‍🍳' }, { title: 'Pilot', icon: '✈️' }, { title: 'Police', icon: '👮' }
        ].map(job => (
            <button key={job.title} onClick={() => speak(`A ${job.title}`)} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col items-center">
                <span className="text-4xl mb-2">{job.icon}</span><span className="font-bold text-slate-700">{job.title}</span>
            </button>
        ))}
    </div>
);

const SingularPlural = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        {[
            { rule: 'Standard', plus: '+S', ex: 'Car → Cars' },
            { rule: 'Ch/Sh/X/S', plus: '+ES', ex: 'Bus → Buses' },
            { rule: 'Consonant+Y', plus: '-Y +IES', ex: 'Baby → Babies' }
        ].map(r => (
            <div key={r.rule} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                <h4 className="font-bold text-indigo-600 uppercase text-xs tracking-wider mb-2">{r.rule}</h4>
                <div className="text-3xl font-bold text-slate-800 mb-4">{r.plus}</div>
                <div className="text-slate-500 font-medium">{r.ex}</div>
            </div>
        ))}
    </div>
);

const ColorsAdjectives = () => {
    const colors = [
        { name: 'Red', hex: '#ef4444', text: 'white' }, { name: 'Blue', hex: '#3b82f6', text: 'white' },
        { name: 'Green', hex: '#22c55e', text: 'white' }, { name: 'Yellow', hex: '#eab308', text: 'black' },
        { name: 'Purple', hex: '#a855f7', text: 'white' }, { name: 'Black', hex: '#0f172a', text: 'white' }
    ];
    const opposites = [
        { w1: 'Big', t1: 'Large', w2: 'Small', t2: 'Small' },
        { w1: 'Fast', t1: 'Fast', w2: 'Slow', t2: 'Slow' },
        { w1: 'Happy', t1: 'Happy', w2: 'Sad', t2: 'Sad' },
        { w1: 'Rich', t1: 'Rich', w2: 'Poor', t2: 'Poor' }
    ];
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colors.map(c => (
                    <button key={c.name} onClick={() => speak(c.name)} className="h-20 rounded-xl flex items-center justify-center font-bold shadow-sm" style={{ backgroundColor: c.hex, color: c.text }}> {c.name} </button>
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {opposites.map((pair, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <button onClick={() => speak(pair.w1)} className="text-left group">
                            <div className="font-bold text-slate-700 group-hover:text-indigo-600">{pair.w1}</div>
                        </button>
                        <div className="h-px bg-slate-100 w-full"></div>
                        <button onClick={() => speak(pair.w2)} className="text-left group">
                            <div className="font-bold text-slate-700 group-hover:text-rose-600">{pair.w2}</div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NumbersZeroToTwenty = () => (
    <div className="grid grid-cols-4 gap-4 animate-fade-in">
        {Array.from({length: 21}, (_, i) => i).map(n => (
            <button key={n} onClick={() => speak(n.toString())} className="p-6 bg-white rounded-2xl shadow-sm font-bold text-xl text-center hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105">{n}</button>
        ))}
    </div>
);

const NumbersTwentyHundred = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-3 gap-4">
            {[20, 30, 40, 50, 60, 70, 80, 90, 100].map(n => (
                <button key={n} onClick={() => speak(n.toString())} className="p-6 bg-white rounded-2xl shadow-sm font-bold text-xl text-center hover:bg-indigo-600 hover:text-white transition-all">{n}</button>
            ))}
        </div>
    </div>
);

const DemonstrativesNew = () => (
    <div className="grid grid-cols-2 gap-6 animate-fade-in">
        {['This', 'That', 'These', 'Those'].map(word => (
            <button key={word} onClick={() => speak(word)} className="p-8 bg-white rounded-3xl border border-slate-100 text-center shadow-sm hover:border-indigo-400 transition-all">
                <h4 className="font-bold text-indigo-600 text-3xl">{word}</h4>
            </button>
        ))}
    </div>
);

const CountriesNationalities = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
        {[{c: 'USA', n: 'American'}, {c: 'UK', n: 'British'}, {c: 'Brazil', n: 'Brazilian'}, {c: 'Japan', n: 'Japanese'}].map(item => (
            <button key={item.c} onClick={() => speak(`I am from ${item.c}. I am ${item.n}.`)} className="p-6 bg-white rounded-2xl border border-slate-100 text-left hover:border-indigo-400 flex justify-between items-center transition-all">
                <div><div className="font-bold text-slate-800">{item.c}</div><div className="text-indigo-500 text-sm">{item.n}</div></div>
                <Globe className="w-5 h-5 text-slate-200" />
            </button>
        ))}
    </div>
);

const FamilyVocabulary = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
        {['Mother', 'Father', 'Sister', 'Brother', 'Daughter', 'Son', 'Grandmother', 'Grandfather'].map(word => (
            <button key={word} onClick={() => speak(word)} className="p-6 bg-white rounded-2xl shadow-sm font-bold text-slate-700 hover:text-indigo-600 border border-slate-100 transition-all">{word}</button>
        ))}
    </div>
);

const PossessiveAdjectives = () => (
    <div className="space-y-3 animate-fade-in">
        {[
            {s: 'I', p: 'My'}, {s: 'You', p: 'Your'}, {s: 'He', p: 'His'}, {s: 'She', p: 'Her'},
            {s: 'It', p: 'Its'}, {s: 'We', p: 'Our'}, {s: 'They', p: 'Their'}
        ].map(item => (
            <div key={item.s} onClick={() => speak(`This is ${item.p} book.`)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all">
                <span className="text-slate-500 font-medium">Subject: <strong className="text-slate-800">{item.s}</strong></span>
                <span className="font-bold text-2xl text-indigo-600 tracking-tight">{item.p}</span>
            </div>
        ))}
    </div>
);

const GenitiveCase = () => (
    <div className="p-12 bg-white rounded-3xl text-center space-y-8 animate-fade-in shadow-sm border border-slate-100">
        <h3 className="font-bold text-2xl text-slate-800">Ownership with ('s)</h3>
        <div className="grid gap-4 max-w-sm mx-auto">
            <button onClick={() => speak("John's car")} className="p-6 bg-slate-50 rounded-2xl font-bold text-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all">John's Car</button>
            <button onClick={() => speak("The teacher's book")} className="p-6 bg-slate-50 rounded-2xl font-bold text-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all">Teacher's Book</button>
        </div>
    </div>
);

const HouseFurniture = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
        {['Kitchen', 'Bedroom', 'Bathroom', 'Living Room', 'Sofa', 'Bed', 'Fridge', 'Chair'].map(item => (
            <button key={item} onClick={() => speak(item)} className="p-6 bg-white rounded-2xl shadow-sm font-bold text-slate-700 border border-slate-100 hover:text-indigo-600 transition-all">{item}</button>
        ))}
    </div>
);

const PrepositionsPlace = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
        {['In', 'On', 'Under', 'Next to', 'Behind', 'In front of'].map(prep => (
            <button key={prep} onClick={() => speak(`The ball is ${prep} the box.`)} className="p-8 bg-indigo-50 rounded-3xl font-bold text-xl text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-all">{prep}</button>
        ))}
    </div>
);

const ThereIsAre = () => (
    <div className="space-y-6 animate-fade-in">
        <button onClick={() => speak("There is a book on the table.")} className="w-full p-8 bg-emerald-50 border-2 border-emerald-100 rounded-3xl text-left hover:border-emerald-300 transition-all">
            <div className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-2">Singular</div>
            <span className="font-bold text-2xl text-emerald-800">There is...</span>
        </button>
        <button onClick={() => speak("There are two books on the table.")} className="w-full p-8 bg-blue-50 border-2 border-blue-100 rounded-3xl text-left hover:border-blue-300 transition-all">
            <div className="text-xs font-black uppercase text-blue-500 tracking-widest mb-2">Plural</div>
            <span className="font-bold text-2xl text-blue-800">There are...</span>
        </button>
    </div>
);

const DaysMonths = () => (
    <div className="space-y-12 animate-fade-in">
        <div>
            <h4 className="font-bold text-xl mb-4 text-slate-800">Days of the Week</h4>
            <div className="flex flex-wrap gap-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <button key={day} onClick={() => speak(day)} className="px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-100 font-bold text-slate-600 hover:text-indigo-600 transition-all">{day}</button>
                ))}
            </div>
        </div>
        <div>
            <h4 className="font-bold text-xl mb-4 text-slate-800">Months</h4>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <button key={month} onClick={() => speak(month)} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 font-bold text-slate-600 hover:text-indigo-600 transition-all text-sm">{month}</button>
                ))}
            </div>
        </div>
    </div>
);

const TellingTime = () => (
    <div className="space-y-4 animate-fade-in">
        {["It's 3 o'clock", "It's 3:30", "It's quarter past 3", "It's 10 to 4"].map(t => (
            <button key={t} onClick={() => speak(t)} className="w-full p-6 bg-white border border-slate-100 rounded-2xl font-bold text-xl text-slate-700 hover:border-indigo-400 transition-all shadow-sm">{t}</button>
        ))}
    </div>
);

const WhQuestions = () => (
    <div className="space-y-3 animate-fade-in">
        {[
            {q: 'What', a: 'Thing / Object'}, {q: 'Where', a: 'Place / Location'}, {q: 'When', a: 'Time / Date'},
            {q: 'Who', a: 'Person'}, {q: 'Why', a: 'Reason'}, {q: 'How', a: 'Method / Manner'}
        ].map(item => (
            <button key={item.q} onClick={() => speak(item.q)} className="w-full flex justify-between items-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-400 transition-all">
                <span className="font-bold text-3xl text-indigo-600">{item.q}</span>
                <span className="text-slate-400 font-medium tracking-tight uppercase text-xs">{item.a}</span>
            </button>
        ))}
    </div>
);

const PresentSimpleRules = ({ mode }: { mode: 'base' | 'third' }) => (
    <div className="p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 animate-fade-in">
        <div className="text-xs font-black uppercase text-indigo-500 tracking-[0.3em] mb-4">{mode === 'base' ? 'Everyday Habits' : 'He, She, It'}</div>
        <h3 className="text-4xl font-serif-display text-slate-800 mb-8">{mode === 'base' ? 'Present Simple' : 'The Third Person S'}</h3>
        <button onClick={() => speak(mode === 'base' ? "I speak English every day." : "She speaks English.")} className="w-full p-8 bg-indigo-50 rounded-3xl text-indigo-700 font-bold text-xl flex items-center justify-center gap-4 hover:bg-indigo-100 transition-all">
            <Volume2 className="w-6 h-6" /> {mode === 'base' ? "I speak English." : "She speaks English."}
        </button>
    </div>
);

const DailyRoutine = () => (
    <div className="grid gap-3 animate-fade-in">
        {['Wake up', 'Have a shower', 'Brush my teeth', 'Go to work', 'Have lunch', 'Watch TV', 'Go to sleep'].map(act => (
            <button key={act} onClick={() => speak(`I ${act.toLowerCase()} every day.`)} className="w-full p-4 bg-white rounded-2xl shadow-sm text-left flex items-center gap-4 border border-slate-50 hover:border-indigo-200 hover:translate-x-2 transition-all">
                <div className="p-2 bg-slate-50 rounded-lg"><Clock className="w-5 h-5 text-indigo-500" /></div>
                <span className="font-bold text-slate-700">{act}</span>
            </button>
        ))}
    </div>
);

const AdverbsFrequency = () => (
    <div className="space-y-4 animate-fade-in">
        {[{w: 'Always', p: '100%'}, {w: 'Usually', p: '80%'}, {w: 'Often', p: '60%'}, {w: 'Sometimes', p: '40%'}, {w: 'Never', p: '0%'}].map(item => (
            <button key={item.w} onClick={() => speak(`I ${item.w.toLowerCase()} study English.`)} className="flex items-center gap-6 w-full p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-md transition-all">
                <div className="font-bold text-2xl text-indigo-600 w-32 text-left">{item.w}</div>
                <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full" style={{width: item.p}}></div>
                </div>
                <div className="text-sm font-black text-slate-400 tracking-tighter w-12">{item.p}</div>
            </button>
        ))}
    </div>
);

const InteractionSection = ({ type }: { type: 'object' | 'imp' | 'can' }) => {
    if (type === 'object') return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            {['Me', 'You', 'Him', 'Her', 'It', 'Us', 'Them'].map(p => (
                <button key={p} onClick={() => speak(`Help ${p}.`)} className="p-10 bg-white rounded-3xl shadow-sm font-bold text-2xl text-slate-800 border border-slate-100 hover:border-indigo-400 transition-all">{p}</button>
            ))}
        </div>
    );
    if (type === 'imp') return (
        <div className="grid gap-6 animate-fade-in">
            <button onClick={() => speak("Open the door.")} className="p-10 bg-emerald-50 text-emerald-800 rounded-3xl font-black text-2xl border-2 border-emerald-100 hover:bg-emerald-100 transition-all">Open the door!</button>
            <button onClick={() => speak("Don't speak.")} className="p-10 bg-rose-50 text-rose-800 rounded-3xl font-black text-2xl border-2 border-rose-100 hover:bg-rose-100 transition-all">Don't speak!</button>
        </div>
    );
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <button onClick={() => speak("I can swim.")} className="p-12 bg-white rounded-[3rem] border-2 border-emerald-100 text-center hover:border-emerald-400 transition-all">
                <h4 className="text-4xl font-serif-display text-emerald-600 mb-2">Can</h4>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Ability</p>
            </button>
            <button onClick={() => speak("I can't fly.")} className="p-12 bg-white rounded-[3rem] border-2 border-rose-100 text-center hover:border-rose-400 transition-all">
                <h4 className="text-4xl font-serif-display text-rose-600 mb-2">Can't</h4>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Inability</p>
            </button>
        </div>
    );
};

const Placeholder = ({ title }: { title: string }) => <div className="p-12 bg-white rounded-3xl border border-slate-100 text-center text-slate-400 italic">Content for {title} coming soon.</div>;

// --- LAYOUT COMPONENTS ---

const WelcomeScreen = ({ onSelectLevel }: { onSelectLevel: (level: number) => void }) => (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0f172a]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-6xl w-full px-6 relative z-10 py-20 flex flex-col items-center">
            <div className="text-center mb-16 space-y-6 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-indigo-300 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" /> Mastering English with Intelligence
                </div>
                <h1 className="text-5xl md:text-7xl font-serif-display text-white tracking-tight leading-tight">
                    Learning English <br />
                    <span className="text-indigo-400">with Matthew</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    Master the global language with a structured, high-level curriculum designed for clarity, rapid fluency, and professional growth.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl animate-fade-in">
                <LevelCard title="Basic" desc="Essential foundations: Grammar, phonetics & basic vocabulary." icon={<ZapIcon className="w-6 h-6" />} onClick={() => onSelectLevel(1)} available color="from-indigo-600 to-indigo-700" />
                <LevelCard title="Pre-Intermediate" desc="Expanding reach with complex structures." icon={<Layers className="w-6 h-6" />} onClick={() => onSelectLevel(2)} color="from-blue-600 to-blue-700" />
                <LevelCard title="Intermediate" desc="Fluent conversations & professional writing." icon={<Globe className="w-6 h-6" />} onClick={() => onSelectLevel(3)} color="from-emerald-600 to-emerald-700" />
                <LevelCard title="Advanced" desc="Native-level nuance & logic." icon={<Award className="w-6 h-6" />} onClick={() => onSelectLevel(4)} color="from-rose-600 to-rose-700" />
            </div>
        </div>
    </div>
);

const LevelCard = ({ title, desc, icon, onClick, available, color }: any) => (
    <button onClick={onClick} className={`group relative p-8 glass-card rounded-[2rem] text-left transition-all duration-500 flex flex-col h-full ${available ? 'hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-indigo-500/20' : 'opacity-60 cursor-not-allowed'}`}>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${available ? color : 'from-slate-700 to-slate-800'} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between">
            {title} {!available && <Lock className="w-4 h-4 text-slate-500" />}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{desc}</p>
        {available ? (
            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-sm">Start Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
        ) : (
            <div className="inline-flex items-center gap-2 text-slate-600 font-bold text-sm">Locked</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
    </button>
);

const UnderConstruction = ({ title, onBack }: any) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-center p-6">
        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 animate-float">
            <Wrench className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-4xl font-serif-display text-white mb-4">{title} is Coming Soon</h2>
        <button onClick={onBack} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Return to Dashboard
        </button>
    </div>
);

const Sidebar = ({ activeModule, onToggleModule, activeSection, onSelectSection, onBack, currentLevel }: any) => {
    const modules = [
        { id: 1, title: 'First Steps', icon: <Star className="w-4 h-4"/>, range: [0, 4] },
        { id: 2, title: 'Nouns & Characteristics', icon: <BookOpen className="w-4 h-4"/>, range: [5, 9] },
        { id: 3, title: 'Quantity & Pointers', icon: <Hash className="w-4 h-4"/>, range: [10, 12] },
        { id: 4, title: 'Belonging & Family', icon: <User className="w-4 h-4"/>, range: [13, 15] },
        { id: 5, title: 'Space & Existence', icon: <MapPin className="w-4 h-4"/>, range: [16, 18] },
        { id: 6, title: 'Time & Routine', icon: <Clock className="w-4 h-4"/>, range: [19, 25] },
        { id: 7, title: 'Interaction & Ability', icon: <MessageCircle className="w-4 h-4"/>, range: [26, 28] },
    ];
    
    const levelNames: any = { 1: 'Basic', 2: 'Pre-Intermediate', 3: 'Intermediate', 4: 'Advanced' };

    const getTitle = (idx: number) => {
        const titles: Record<number, string> = {
            0: 'Greetings & Farewells', 1: 'Alphabet & Spelling', 2: 'Subject Pronouns', 3: 'Verb To Be (+)', 4: 'Verb To Be (-/?)',
            5: 'Indefinite Articles', 6: 'Jobs & Occupations', 7: 'Singular/Plural', 8: 'Colors & Adjectives', 9: 'Countries & Nationalities',
            10: 'Numbers 0-20', 11: 'Numbers 20-100', 12: 'Demonstratives',
            13: 'Family Vocabulary', 14: 'Possessive Adjectives', 15: "Genitive Case ('s)",
            16: 'House & Furniture', 17: 'Prepositions of Place', 18: 'There Is / There Are',
            19: 'Days & Months', 20: 'Telling Time', 21: 'Wh- Questions', 22: 'Present Simple Rules', 23: 'Third Person S', 24: 'Daily Routine', 25: 'Adverbs of Frequency',
            26: 'Object Pronouns', 27: 'Imperatives', 28: "Can / Can't"
        };
        return titles[idx] || `Lesson ${idx + 1}`;
    };

    return (
        <aside className="w-full md:w-80 sidebar-glass h-screen overflow-y-auto flex flex-col shadow-2xl relative z-20">
            <div className="p-8 border-b border-white/5 flex flex-col gap-6 sticky top-0 bg-[#0f172a]/80 backdrop-blur-xl z-10">
                <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-all text-xs font-bold tracking-widest uppercase">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Menu
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <div>
                        <div className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">Level {currentLevel}</div>
                        <div className="font-serif-display text-2xl text-white">{levelNames[currentLevel]}</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-6">
                {modules.map(m => (
                    <div key={m.id} className="rounded-2xl overflow-hidden transition-all duration-300">
                        <button onClick={() => onToggleModule(m.id)}
                            className={`w-full p-4 flex items-center justify-between text-sm font-semibold transition-all ${activeModule === m.id ? 'bg-indigo-500/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${activeModule === m.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                    {m.icon}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-black text-indigo-400 tracking-widest uppercase">M{m.id}</span>
                                    <span className="truncate">{m.title}</span>
                                </div>
                            </div>
                            {activeModule === m.id ? <ChevronDown className="w-4 h-4 text-indigo-400"/> : <ChevronRight className="w-4 h-4 opacity-30"/>}
                        </button>
                        
                        {activeModule === m.id && (
                            <div className="mt-1 ml-4 border-l border-white/5 space-y-1 pl-2 animate-fade-in">
                                {Array.from({ length: m.range[1] - m.range[0] + 1 }, (_, i) => m.range[0] + i).map(idx => (
                                    <button key={idx} onClick={() => onSelectSection(idx)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all flex items-center gap-3 ${activeSection === idx ? 'bg-white/10 text-indigo-400 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <div className={`w-1 h-1 rounded-full transition-all ${activeSection === idx ? 'bg-indigo-400 scale-150 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-slate-700'}`}/>
                                        {getTitle(idx)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default function App() {
    const [currentLevel, setCurrentLevel] = useState<number | null>(null); 
    const [activeModule, setActiveModule] = useState<number | null>(1);
    const [activeSection, setActiveSection] = useState(0); 

    const renderContent = () => {
        switch(activeSection) {
            case 0: return <GreetingsFarewells />;
            case 1: return <AlphabetSpelling />;
            case 2: return <SubjectPronouns />;
            case 3: return <VerbToBeAffirmative />;
            case 4: return <VerbToBeNegInt />;
            case 5: return <IndefiniteArticles />;
            case 6: return <JobsOccupations />;
            case 7: return <SingularPlural />;
            case 8: return <ColorsAdjectives />;
            case 9: return <CountriesNationalities />;
            case 10: return <NumbersZeroToTwenty />;
            case 11: return <NumbersTwentyHundred />;
            case 12: return <DemonstrativesNew />;
            case 13: return <FamilyVocabulary />;
            case 14: return <PossessiveAdjectives />;
            case 15: return <GenitiveCase />;
            case 16: return <HouseFurniture />;
            case 17: return <PrepositionsPlace />;
            case 18: return <ThereIsAre />;
            case 19: return <DaysMonths />;
            case 20: return <TellingTime />;
            case 21: return <WhQuestions />;
            case 22: return <PresentSimpleRules mode="base" />;
            case 23: return <PresentSimpleRules mode="third" />;
            case 24: return <DailyRoutine />;
            case 25: return <AdverbsFrequency />;
            case 26: return <InteractionSection type="object" />;
            case 27: return <InteractionSection type="imp" />;
            case 28: return <InteractionSection type="can" />;
            default: return <Placeholder title={`Lesson ${activeSection + 1}`} />;
        }
    };

    if (!currentLevel) {
        return <><style>{globalStyles}</style><WelcomeScreen onSelectLevel={setCurrentLevel} /></>;
    }

    if (currentLevel !== 1) {
        const levelNames: any = { 2: 'Pre-Intermediate', 3: 'Intermediate', 4: 'Advanced' };
        return <><style>{globalStyles}</style><UnderConstruction title={levelNames[currentLevel]} onBack={() => setCurrentLevel(null)} /></>;
    }

    return (
        <>
            <style>{globalStyles}</style>
            <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
                <Sidebar 
                    activeModule={activeModule}
                    onToggleModule={(id: any) => setActiveModule(activeModule === id ? null : id)}
                    activeSection={activeSection}
                    onSelectSection={setActiveSection}
                    onBack={() => setCurrentLevel(null)}
                    currentLevel={currentLevel}
                />
                <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12 lg:p-20">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-16 animate-fade-in">
                            <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-4">
                                <Sparkles className="w-4 h-4" /> Matthew's Curriculum
                            </div>
                            <h2 className="text-5xl font-serif-display text-slate-900 tracking-tight">Lesson Context</h2>
                            <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-6"></div>
                        </header>
                        <div className="pb-32">
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}