
import React, { useState, useEffect } from 'react';
import {
    Box, Menu, BookOpen, Star, Brain, ArrowRight, PlayCircle, Settings, Globe, Mic,
    MessageCircle, Volume2, Award, Calendar, ChevronRight, ChevronLeft, Search, Check, X, Info, RefreshCw,
    Users, MapPin, Briefcase, Stethoscope, GraduationCap, PenTool,
    Wrench, ChevronDown, Layout, Zap, ArrowLeft,
    Clock, Heart, User, Home, Sun, Moon, Coffee, Briefcase as WorkIcon,
    Palette, Gavel, Truck, Music, Camera, Scissors, Sunrise, Sunset,
    Flag, Layers, Type, AlertTriangle, Calculator, Hand, MoveRight, Hash,
    Smile, Frown, ThumbsUp, ThumbsDown, StopCircle, Play, Pause, Repeat, Headphones,
    Sofa, Bed, Utensils, Bath, Tv, Watch, CalendarDays, HelpCircle, Target, Battery,
    BatteryCharging, BatteryFull, Lock, Key, Baby, UserPlus, Monitor, Shield, Sprout, Landmark,
    Sparkles, ShieldCheck, Rocket, ZapIcon, Quote, Lightbulb, GraduationCap as TeacherIcon,
    Languages, Keyboard, Fingerprint, MousePointer2, SpellCheck, UserCheck, Flame, HelpCircle as QuestionIcon,
    Ear, Zap as FastIcon, Laptop, HardHat, Camera as PhotoIcon, Music as AudioIcon,
    ChefHat, ShoppingBag, Shield as SecurityIcon, Plane, Scale, Plus, Minus, IterationCw, Eye,
    Maximize, Minimize, Activity, Compass, Navigation, List, MessageSquare, Link,
    CheckCircle2, XCircle, Trophy, AlertCircle, LogIn, User as UserIcon, Mail, Lock as LockIcon, LogOut, Loader2,
    LogIn as LoginIcon
} from 'lucide-react';
// Firebase removed for Offline Mode
// import { auth } from './firebase';
// import { signOut, onAuthStateChanged, updateProfile, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { progressService, UserProgress } from './progressService';
import { userService, UserProfile, UserRole } from './userService';

// --- Types ---
interface User extends UserProfile {
    avatar?: string;
}


// --- Offline Components Removed (Guest Mode Active) ---

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

  .language-toggle-shadow {
    box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3), 0 8px 10px -6px rgba(99, 102, 241, 0.3);
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

const GreetingsFarewells = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const timeGreetings = [
        { phrase: "Good morning", ipa: "/ɡʊd ˈmɔːrnɪŋ/", trans: "Bom dia", time: isPortuguese ? "05:00 - 12:00" : "05:00 AM - 12:00 PM", icon: "🌅", bg: "from-orange-50 to-amber-50", text: "text-amber-700" },
        { phrase: "Good afternoon", ipa: "/ɡʊd ˌæftərˈnuːn/", trans: "Boa tarde", time: isPortuguese ? "12:00 - 18:00" : "12:00 PM - 06:00 PM", icon: "☀️", bg: "from-blue-50 to-indigo-50", text: "text-blue-700" },
        { phrase: "Good evening", ipa: "/ɡʊd ˈiːvnɪŋ/", trans: "Boa noite", time: isPortuguese ? "18:00 - 21:00 (Chegada)" : "06:00 PM - 09:00 PM (Arrival)", icon: "🌇", bg: "from-indigo-50 to-purple-50", text: "text-indigo-700" },
        { phrase: "Good night", ipa: "/ɡʊd naɪt/", trans: "Boa noite", time: isPortuguese ? "Despedida / Dormir" : "Leaving / Sleeping", icon: "🌙", bg: "from-slate-50 to-slate-100", text: "text-slate-700" },
    ];

    const formalGreetings = [
        { phrase: "Hello", ipa: "/həˈloʊ/", trans: "Olá", example: "Hello, Mr. Smith. How are you today?" },
        { phrase: "How do you do?", ipa: "/haʊ duː juː duː/", trans: "Como vai?", example: "Pleasure to meet you. How do you do?" },
        { phrase: "Nice to meet you", ipa: "/naɪs tu miːt juː/", trans: "Prazer em conhecer", example: "It's a great honor, nice to meet you." },
    ];

    const informalGreetings = [
        { phrase: "Hi / Hey", ipa: "/haɪ/ /heɪ/", trans: "Oi", example: "Hey Matthew! How's it going?" },
        { phrase: "What's up?", ipa: "/wʌts ʌp?", trans: "E aí?", example: "Hey man, what's up? Nothing much." },
        { phrase: "How's it going?", ipa: "/haʊz ɪt ˈɡoʊɪŋ/", trans: "Como vão as coisas?", example: "How's it going with the new job?" },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Introduction */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><TeacherIcon className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Uma mensagem do Matthew" : "A Message from Matthew"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"As saudações são a base de qualquer relacionamento. Em inglês, a forma como você diz 'olá' define o tone de toda a conversa. Hoje, vamos dominar não apenas as palavras, mas a cultura por trás delas. Preste atenção na armadilha do 'Good Night'—é o erro mais comum entre iniciantes!\""
                                : "\"Greetings are the foundation of any relationship. In English, the way you say 'hello' defines the tone of the entire conversation. Today, we'll master not just the words, but the culture behind them. Pay attention to the 'Good Night' trap—it's the most common mistake for beginners!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Time-Based Greetings */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Clock className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Saudações por Período" : "Time-Based Greetings"}
                    </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {timeGreetings.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(item.phrase)}
                            className={`group relative p-6 rounded-3xl border-2 border-transparent hover:border-indigo-200 transition-all flex items-start gap-4 text-left bg-gradient-to-br ${item.bg} shadow-sm hover:shadow-md`}
                        >
                            <span className="text-4xl">{item.icon}</span>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h5 className={`text-xl font-bold ${item.text}`}>{item.phrase}</h5>
                                    <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                                </div>
                                <div className="flex gap-2 items-baseline">
                                    <span className="text-[10px] font-mono text-slate-400">{item.ipa}</span>
                                    {isPortuguese && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">— {item.trans}</span>}
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.time}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* The Trap Box */}
            <div className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2rem] flex gap-5 shadow-sm">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <h5 className="font-black text-rose-800 uppercase tracking-widest text-xs mb-1">
                        {isPortuguese ? "A ARMADILHA DO \"GOOD NIGHT\"" : "The \"Good Night\" Trap"}
                    </h5>
                    <p className="text-sm text-rose-700 leading-relaxed">
                        {isPortuguese
                            ? <>Nunca diga <strong>"Good night"</strong> ao chegar em uma festa ou jantar. Use <strong>"Good evening"</strong>. Reserve o <strong>"Good night"</strong> estritamente para quando estiver <strong>indo embora</strong> ou indo dormir.</>
                            : <>Never say <strong>"Good night"</strong> when you arrive at a party or dinner. Use <strong>"Good evening"</strong>. Save <strong>"Good night"</strong> strictly for when you are <strong>leaving</strong> or going to sleep.</>
                        }
                    </p>
                </div>
            </div>

            {/* Formal vs Informal */}
            <section className="grid md:grid-cols-2 gap-8">
                {/* Formal Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Briefcase className="w-5 h-5" /></div>
                        <h4 className="text-xl font-bold text-slate-800">
                            {isPortuguese ? "Situações Formais" : "Formal Situations"}
                        </h4>
                    </div>
                    <div className="space-y-4">
                        {formalGreetings.map((g, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-700 text-lg">{g.phrase}</span>
                                    <button onClick={() => speak(g.phrase)} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-indigo-600"><Volume2 className="w-4 h-4" /></button>
                                </div>
                                <div className="flex gap-2 items-center mb-3">
                                    <span className="text-[10px] text-slate-400 font-mono italic">{g.ipa}</span>
                                    {isPortuguese && <span className="text-[10px] font-bold text-indigo-400 tracking-wider">— {g.trans}</span>}
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-slate-200">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                                        {isPortuguese ? "Exemplo" : "Example"}
                                    </div>
                                    <p className="text-xs text-slate-600 italic">"{g.example}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Informal Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><MessageCircle className="w-5 h-5" /></div>
                        <h4 className="text-xl font-bold text-slate-800">
                            {isPortuguese ? "Informal / Amigos" : "Informal / Friends"}
                        </h4>
                    </div>
                    <div className="space-y-4">
                        {informalGreetings.map((g, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-700 text-lg">{g.phrase}</span>
                                    <button onClick={() => speak(g.phrase)} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-indigo-600"><Volume2 className="w-4 h-4" /></button>
                                </div>
                                <div className="flex gap-2 items-center mb-3">
                                    <span className="text-[10px] text-slate-400 font-mono italic">{g.ipa}</span>
                                    {isPortuguese && <span className="text-[10px] font-bold text-indigo-400 tracking-wider">— {g.trans}</span>}
                                </div>
                                <div className="p-3 bg-indigo-50/50 rounded-xl border-l-4 border-indigo-200">
                                    <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">
                                        {isPortuguese ? "Exemplo" : "Example"}
                                    </div>
                                    <p className="text-xs text-slate-600 italic">"{g.example}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Practice / Teacher's Note */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100">
                <div className="absolute top-0 left-10 -translate-y-1/2 bg-amber-400 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Dicas de Mestre" : "Pro Tips"}
                </div>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm"><Lightbulb className="w-5 h-5 text-amber-500" /></div>
                            <div>
                                <h6 className="font-bold text-amber-900 mb-1">
                                    {isPortuguese ? "Linguagem Corporal importa" : "Body Language Matters"}
                                </h6>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    {isPortuguese
                                        ? "Em culturas de língua inglesa, um aperto de mão firme e contato visual são esperados ao cumprimentar alguém formalmente. 🤝"
                                        : "In many English-speaking cultures, a firm handshake and eye contact are expected when greeting someone formally. 🤝"
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm"><Lightbulb className="w-5 h-5 text-amber-500" /></div>
                            <div>
                                <h6 className="font-bold text-amber-900 mb-1">
                                    {isPortuguese ? "O Segredo do \"What's up?\"" : "The \"What's up?\" Secret"}
                                </h6>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    {isPortuguese
                                        ? "Quando alguém diz \"What's up?\", nem sempre quer um relatório completo. Uma resposta comum é apenas: \"Not much, you?\" 🤙"
                                        : "When someone says \"What's up?\", they aren't always asking for a full report. A common reply is simply: \"Not much, you?\" 🤙"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-inner border border-amber-200/50">
                        <h6 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Quote className="w-4 h-4 text-amber-400" />
                            {isPortuguese ? "Foco na Pronúncia" : "Pronunciation Focus"}
                        </h6>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {isPortuguese
                                ? "Preste atenção no \"H\" de \"Hello\" e \"Hi\". Deve ser um sopro suave, como se estivesse limpando óculos. Evite o som de 'R' forte do português! 🌬️"
                                : "Watch the \"H\" in \"Hello\" and \"Hi\". It should be a soft breath of air, like you're cleaning glasses. Avoid the strong Brazilian 'R' sound! 🌬️"
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlphabetSpelling = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const alphabetIPA: Record<string, string> = {
        A: "/eɪ/", B: "/biː/", C: "/siː/", D: "/diː/", E: "/iː/", F: "/ɛf/", G: "/dʒiː/", H: "/eɪtʃ/", I: "/aɪ/", J: "/dʒeɪ/", K: "/keɪ/", L: "/ɛl/", M: "/ɛm/", N: "/ɛn/", O: "/oʊ/", P: "/piː/", Q: "/kjuː/", R: "/ɑːr/", S: "/ɛs/", T: "/tiː/", U: "/juː/", V: "/viː/", W: "/ˈdʌbəljuː/", X: "/ɛks/", Y: "/waɪ/", Z: "/ziː/"
    };
    const alphabetTrans: Record<string, string> = {
        A: "êi", B: "bi", C: "ci", D: "di", E: "i", F: "éf", G: "dji", H: "êitch", I: "ai", J: "djei", K: "kei", L: "él", M: "ém", N: "én", O: "ôu", P: "pi", Q: "kiu", R: "ár", S: "és", T: "ti", U: "iú", V: "vi", W: "dâbol iú", X: "éks", Y: "uai", Z: "zi"
    };

    const phoneticGroups = [
        { sound: "/eɪ/", color: "bg-orange-50 text-orange-700 border-orange-200", letters: ["A", "H", "J", "K"], description: isPortuguese ? "Som de 'ei' (EI)" : "The 'ay' sound" },
        { sound: "/iː/", color: "bg-blue-50 text-blue-700 border-blue-200", letters: ["B", "C", "D", "E", "G", "P", "T", "V", "Z"], description: isPortuguese ? "Som de 'i' longo (II)" : "The long 'ee' sound" },
        { sound: "/ɛ/", color: "bg-emerald-50 text-emerald-700 border-emerald-200", letters: ["F", "L", "M", "N", "S", "X"], description: isPortuguese ? "Som de 'é' (É)" : "The 'eh' sound" },
        { sound: "/aɪ/", color: "bg-purple-50 text-purple-700 border-purple-200", letters: ["I", "Y"], description: isPortuguese ? "Som de 'ai' (AI)" : "The 'eye' sound" },
        { sound: "/oʊ/", color: "bg-amber-50 text-amber-700 border-amber-200", letters: ["O"], description: isPortuguese ? "Som de 'ôu' (OU)" : "The 'oh' sound" },
        { sound: "/juː/", color: "bg-indigo-50 text-indigo-700 border-indigo-200", letters: ["Q", "U", "W"], description: isPortuguese ? "Som de 'iu' (IU)" : "The 'you' sound" },
        { sound: "/ɑːr/", color: "bg-rose-50 text-rose-700 border-rose-200", letters: ["R"], description: isPortuguese ? "Som de 'ar' (AR)" : "The 'ar' sound" },
    ];

    const acronyms = [
        { name: "FBI", full: isPortuguese ? "Agência Federal de Investigação" : "Federal Bureau of Investigation" },
        { name: "CEO", full: isPortuguese ? "Diretor Executivo" : "Chief Executive Officer" },
        { name: "VIP", full: isPortuguese ? "Pessoa Muito Importante" : "Very Important Person" },
        { name: "USA", full: isPortuguese ? "Estados Unidos da América" : "United States of America" },
    ];

    return (
        <div className="space-y-16 animate-fade-in pb-20">
            {/* Senior Teacher Introduction */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Keyboard className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "O Código de Matthew" : "Matthew's Code"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"O alfabeto é o código secreto do inglês. Se você não sabe soletrar, você não sabe se comunicar profissionalmente. Mas aqui está o segredo: não tente decorar a ordem, tente decorar os SONS. Vamos transformar essas 26 letras em sua primeira vitória!\""
                                : "\"The alphabet is the secret code of English. If you can't spell, you can't communicate professionally. But here's the secret: don't try to memorize the order, try to memorize the SOUNDS. Let's turn these 26 letters into your first victory!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Standard Alphabet Grid */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Type className="w-5 h-5" /></div>
                        <h4 className="text-2xl font-bold text-slate-800">
                            {isPortuguese ? "O Alfabeto Completo" : "The Full Alphabet"}
                        </h4>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                        26 {isPortuguese ? "Letras" : "Letters"}
                    </span>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
                    {alphabet.map(letter => (
                        <button
                            key={letter}
                            onClick={() => speak(letter)}
                            className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex flex-col items-center justify-center relative overflow-hidden"
                        >
                            <span className="text-3xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{letter}</span>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-mono text-slate-400 mt-1">{alphabetIPA[letter]}</span>
                                {isPortuguese && <span className="text-[9px] font-bold text-indigo-300 uppercase leading-none mt-0.5">({alphabetTrans[letter]})</span>}
                            </div>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Volume2 className="w-3 h-3 text-indigo-300" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Phonetic Groups - The Secret Sauce */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Fingerprint className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Grupos Fonéticos (O Atalho)" : "Phonetic Groups (The Shortcut)"}
                    </h4>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-sm text-emerald-800 mb-6 flex items-center gap-3">
                    <Info className="w-5 h-5 shrink-0" />
                    <p className="leading-relaxed">
                        {isPortuguese
                            ? "As letras nestes grupos compartilham o mesmo som de vogal. Memorizar o alfabeto através destes grupos é 7x mais eficiente do que tentar decorar a ordem de A a Z!"
                            : "Letters in these groups share the same vowel sound. Memorizing the alphabet through these groups is 7x more efficient than trying to memorize the A-Z order!"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phoneticGroups.map((group, idx) => (
                        <div key={idx} className={`p-6 rounded-3xl border ${group.color} flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="flex justify-between items-center border-b border-current/10 pb-2">
                                <span className="text-lg font-black tracking-widest">{group.sound}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{group.description}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {group.letters.map(l => (
                                    <button
                                        key={l}
                                        onClick={() => speak(l)}
                                        className="w-12 h-12 rounded-xl bg-white/40 border border-current/10 font-black text-xl hover:bg-white shadow-sm transition-all flex items-center justify-center group/letter"
                                    >
                                        {l}
                                        <div className="absolute -bottom-2 opacity-0 group-hover/letter:opacity-100 transition-opacity text-[8px] font-mono">{alphabetIPA[l]}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Practical Application: Acronyms */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><MousePointer2 className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Aplicações Reais" : "Real-World Applications"}
                    </h4>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform"></div>
                        <h5 className="text-lg font-bold text-slate-800 mb-6 relative">
                            {isPortuguese ? "Soletrando Siglas Famosas" : "Spelling Famous Acronyms"}
                        </h5>
                        <div className="space-y-4 relative">
                            {acronyms.map(a => (
                                <button
                                    key={a.name}
                                    onClick={() => speak(a.name.split("").join(", "))}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-indigo-600 text-xl tracking-[0.2em]">{a.name}</span>
                                        <div className="w-px h-6 bg-slate-200"></div>
                                        <span className="text-xs text-slate-500 font-medium">{a.full}</span>
                                    </div>
                                    <Volume2 className="w-4 h-4 text-slate-300" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                        <h5 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <SpellCheck className="w-5 h-5" />
                            {isPortuguese ? "Prática Interativa" : "Interactive Practice"}
                        </h5>
                        <div className="space-y-8">
                            <div className="p-6 bg-indigo-800/50 rounded-2xl border border-indigo-700">
                                <p className="text-indigo-300 text-[10px] font-black uppercase mb-4 tracking-widest">
                                    {isPortuguese ? "Como soletrar seu nome?" : "How to spell your name?"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["M", "A", "T", "T", "H", "E", "W"].map((l, i) => (
                                        <button
                                            key={i}
                                            onClick={() => speak(l)}
                                            className="w-10 h-10 bg-white text-indigo-900 rounded-lg font-black hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all shadow-lg flex items-center justify-center"
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 text-[10px] text-indigo-300/60 font-mono italic">
                                    {isPortuguese ? "Clique em cada letra para ouvir o som individual" : "Click each letter to hear its individual sound"}
                                </div>
                            </div>
                            <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 flex gap-4 items-start">
                                <Quote className="w-5 h-5 text-indigo-400 shrink-0" />
                                <p className="text-xs text-indigo-100 leading-relaxed">
                                    {isPortuguese
                                        ? "Dica de Mestre: Em hotéis, aeroportos e chamadas de vídeo, pedir para soletrar é vital. Se não entender algo, diga: \"Could you spell that, please?\""
                                        : "Master Tip: In hotels, airports, and video calls, asking to spell is vital. If you don't understand something, say: \"Could you spell that, please?\""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Teacher's Corner: Master Notes */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 relative border border-rose-100">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-rose-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Observações de Mestre" : "Master Notes"}
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="flex gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 font-black text-2xl text-rose-500">Z</div>
                        <div>
                            <h6 className="font-black text-rose-900 uppercase text-xs tracking-widest mb-2">The 'Z' Dilemma</h6>
                            <p className="text-sm text-rose-800 leading-relaxed">
                                {isPortuguese
                                    ? <>No <strong>Inglês Americano</strong> (EUA), dizemos <strong>"Zee"</strong> (/ziː/). No <strong>Inglês Britânico</strong> (Reino Unido), dizemos <strong>"Zed"</strong> (/zɛd/). Ambos estão corretos!</>
                                    : <>In <strong>American English</strong> (USA), we say <strong>"Zee"</strong> (/ziː/). In <strong>British English</strong> (UK), we say <strong>"Zed"</strong> (/zɛd/). Both are correct!</>}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 font-black text-2xl text-rose-500">W</div>
                        <div>
                            <h6 className="font-black text-rose-900 uppercase text-xs tracking-widest mb-2">The 'W' Identity</h6>
                            <p className="text-sm text-rose-800 leading-relaxed">
                                {isPortuguese
                                    ? <>A letra <strong>'W'</strong> é a única com três sílabas no nome: <strong>Double-U</strong>. Literalmente significa \"U Duplo\".</>
                                    : <>The letter <strong>'W'</strong> is the only one with three syllables in its name: <strong>Double-U</strong>. It literally means \"Double U\".</>}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-10 p-6 bg-white/50 rounded-2xl border border-rose-200/50">
                    <h6 className="font-black text-rose-900 uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        {isPortuguese ? "Exercício Final de Mestre" : "Master Final Exercise"}
                    </h6>
                    <p className="text-sm text-rose-800">
                        {isPortuguese
                            ? "Tente soletrar seu e-mail em voz alta agora. Lembre-se: o ponto (.) se diz 'DOT' e o arroba (@) se diz 'AT'. Pratique até soar natural!"
                            : "Try spelling your email out loud right now. Remember: the dot (.) is said 'DOT' and the at (@) is said 'AT'. Practice until it sounds natural!"}
                    </p>
                </div>
            </div>
        </div>
    );
};

const SubjectPronouns = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const singularPronouns = [
        { word: 'I', ipa: '/aɪ/', trans: '(Eu)', desc: isPortuguese ? 'Sempre em maiúsculo' : 'Always capitalized', icon: '🙋‍♂️', bg: 'bg-indigo-50', text: 'text-indigo-700' },
        { word: 'You', ipa: '/juː/', trans: '(Você)', desc: isPortuguese ? 'Singular e informal/formal' : 'Singular and informal/formal', icon: '🫵', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        { word: 'He', ipa: '/hiː/', trans: '(Ele)', desc: isPortuguese ? 'Para homens e meninos' : 'For men and boys', icon: '👨', bg: 'bg-blue-50', text: 'text-blue-700' },
        { word: 'She', ipa: '/ʃiː/', trans: '(Ela)', desc: isPortuguese ? 'Para mulheres e meninas' : 'For women and girls', icon: '👩', bg: 'bg-rose-50', text: 'text-rose-700' },
        { word: 'It', ipa: '/ɪt/', trans: '(Ele/Ela)', desc: isPortuguese ? 'Objetos, animais, ideias' : 'Objects, animals, ideas', icon: '📦', bg: 'bg-amber-50', text: 'text-amber-700' },
    ];

    const pluralPronouns = [
        { word: 'We', ipa: '/wiː/', trans: '(Nós)', desc: isPortuguese ? 'Eu + outros' : 'Me + others', icon: '👨‍👩‍👧‍👦', bg: 'bg-purple-50', text: 'text-purple-700' },
        { word: 'You', ipa: '/juː/', trans: '(Vocês)', desc: isPortuguese ? 'Plural de "você"' : 'Plural of "you"', icon: '👥', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        { word: 'They', ipa: '/ðeɪ/', trans: '(Eles/Elas)', desc: isPortuguese ? 'Pessoas ou coisas' : 'People or things', icon: '👉👉', bg: 'bg-slate-50', text: 'text-slate-700' },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Introduction */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><UserCheck className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Os Protagonistas da Frase" : "The Sentence Protagonists"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Pronomes sujeitos são as palavras que executam a ação. Em inglês, você NUNCA pode esconder o sujeito como fazemos em português. Cada frase precisa de um dono! Vamos conhecer quem manda na conversa.\""
                                : "\"Subject pronouns are the words that perform the action. In English, you can NEVER hide the subject like we sometimes do in Portuguese. Every sentence needs an owner! Let's meet who's in charge of the conversation.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Concepts: Replacing Nouns */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-indigo-500" />
                    {isPortuguese ? "A Função: Substituir Nomes" : "The Function: Replacing Nouns"}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600">
                        "<strong>Mary</strong> is a teacher." &rarr; "<strong>She</strong> is a teacher."
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600">
                        "<strong>The dog</strong> is happy." &rarr; "<strong>It</strong> is happy."
                    </div>
                </div>
            </section>

            {/* Pronoun Lists */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Singular */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><User className="w-5 h-5" /></div>
                        <h4 className="text-xl font-bold text-slate-800">
                            {isPortuguese ? "Singular (1 Pessoa)" : "Singular (1 Person)"}
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {singularPronouns.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => speak(p.word)}
                                className={`w-full group relative p-6 rounded-3xl border-2 border-transparent hover:border-indigo-200 transition-all flex items-center gap-4 text-left ${p.bg} shadow-sm`}
                            >
                                <span className="text-3xl">{p.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <div className="flex items-baseline gap-2">
                                            <h5 className={`text-2xl font-black ${p.text}`}>{p.word}</h5>
                                            <span className="text-[10px] font-mono text-slate-400 opacity-60">{p.ipa}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.trans}</span>
                                        </div>
                                        <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">{p.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Plural */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
                        <h4 className="text-xl font-bold text-slate-800">
                            {isPortuguese ? "Plural (2+ Pessoas)" : "Plural (2+ People)"}
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {pluralPronouns.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => speak(p.word)}
                                className={`w-full group relative p-6 rounded-3xl border-2 border-transparent hover:border-blue-200 transition-all flex items-center gap-4 text-left ${p.bg} shadow-sm`}
                            >
                                <span className="text-3xl">{p.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <div className="flex items-baseline gap-2">
                                            <h5 className={`text-2xl font-black ${p.text}`}>{p.word}</h5>
                                            <span className="text-[10px] font-mono text-slate-400 opacity-60">{p.ipa}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.trans}</span>
                                        </div>
                                        <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">{p.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* The You/You Distinction */}
                    <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <h5 className="font-bold text-emerald-800 text-xs uppercase tracking-widest mb-2">
                            {isPortuguese ? "Curiosidade: O Duplo 'You'" : "Fun Fact: The Double 'You'"}
                        </h5>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                            {isPortuguese
                                ? "Reparou que 'You' está nas duas colunas? Em inglês, a palavra é a mesma para 'você' e 'vocês'. O contexto da frase dirá se estamos falando com uma ou mais pessoas."
                                : "Did you notice 'You' is in both columns? In English, the word is the same for singular and plural 'you'. The context will tell us if we are talking to one or more people."
                            }
                        </p>
                    </div>
                </section>
            </div>

            {/* Special Focus: The 'It' pronoun */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100 overflow-visible">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Foco no 'IT'" : "Focus on 'IT'"}
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-4xl shrink-0">📦</div>
                    <div>
                        <h5 className="text-lg font-bold text-amber-900 mb-3">
                            {isPortuguese ? "O Pronome Neutro" : "The Neutral Pronoun"}
                        </h5>
                        <p className="text-sm text-amber-800 leading-relaxed mb-4">
                            {isPortuguese
                                ? "Usamos 'It' para tudo que não seja um ser humano específico. Animais de estimação podem ser 'he' ou 'she', mas um animal na rua ou um objeto inanimado (como uma mesa) é sempre 'IT'."
                                : "We use 'It' for everything that isn't a specific human being. Pets can be 'he' or 'she', but a stray animal or an inanimate object (like a table) is always 'IT'."
                            }
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['It is a car.', 'It is raining.', 'It is cold.'].map((ex, i) => (
                                <button key={i} onClick={() => speak(ex)} className="px-3 py-1.5 bg-white/60 hover:bg-white rounded-full text-xs font-bold text-amber-700 transition-colors border border-amber-200">
                                    {ex}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Teacher's Master Tip: The Invisible Subject */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 relative border border-rose-100">
                <div className="absolute top-0 left-10 -translate-y-1/2 bg-rose-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Dica de Mestre" : "Master Note"}
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <AlertTriangle className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-rose-900 mb-2">
                            {isPortuguese ? "Sujeito Inexistente? Não no Inglês!" : "No Dropped Subjects!"}
                        </h5>
                        <p className="text-sm text-rose-800 leading-relaxed">
                            {isPortuguese
                                ? <>Em português dizemos: "(Ele) É professor". Em inglês, <strong>nunca</strong> começamos com o verbo direto. Precisamos do pronome: "<strong>He</strong> is a teacher." Mesmo para o tempo: "<strong>It</strong> is raining."</>
                                : <>In Portuguese, you can say "(Ele) É professor". In English, you <strong>never</strong> start directly with the verb. We need the pronoun: "<strong>He</strong> is a teacher." Even for weather: "<strong>It</strong> is raining."</>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VerbToBeAffirmative = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const conjugations = [
        { person: 'I', verb: 'am', contract: "'m", ipa: '/æm/', trans: '(sou/estou)', ex: 'I am happy.', icon: '🙋‍♂️', color: 'indigo' },
        { person: 'He', verb: 'is', contract: "'s", ipa: '/ɪz/', trans: '(é/está)', ex: 'He is a doctor.', icon: '👨', color: 'blue' },
        { person: 'She', verb: 'is', contract: "'s", ipa: '/ɪz/', trans: '(é/está)', ex: 'She is at work.', icon: '👩', color: 'rose' },
        { person: 'It', verb: 'is', contract: "'s", ipa: '/ɪz/', trans: '(é/está)', ex: 'It is cold.', icon: '☁️', color: 'amber' },
        { person: 'We', verb: 'are', contract: "'re", ipa: '/ɑːr/', trans: '(somos/estamos)', ex: 'We are friends.', icon: '👨‍👩‍👧‍👦', color: 'purple' },
        { person: 'You', verb: 'are', contract: "'re", ipa: '/ɑːr/', trans: '(é/está/são/estão)', ex: 'You are welcome.', icon: '🫵', color: 'emerald' },
        { person: 'They', verb: 'are', contract: "'re", ipa: '/ɑːr/', trans: '(são/estão)', ex: 'They are students.', icon: '👥', color: 'slate' },
    ];

    const colors: any = {
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
        blue: 'bg-blue-50 border-blue-100 text-blue-700',
        rose: 'bg-rose-50 border-rose-100 text-rose-700',
        amber: 'bg-amber-50 border-amber-100 text-amber-700',
        purple: 'bg-purple-50 border-purple-100 text-purple-700',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        slate: 'bg-slate-50 border-slate-100 text-slate-700'
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-slate-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Flame className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-4xl shadow-lg border-2 border-slate-600">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "O Motor do Inglês" : "The Engine of English"}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"O 'Verb To Be' é o verbo mais importante que você vai aprender. Ele funciona como o sinal de 'IGUAL' (=). Ele diz quem somos, como estamos e onde estamos. Entenda este verbo e você abrirá 50% das portas da conversação!\""
                                : "\"The 'Verb To Be' is the most important verb you will learn. It works like an 'EQUALS' sign (=). It says who we are, how we are, and where we are. Understand this verb and you'll open 50% of conversation doors!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Conjugation Grid */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Layers className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Conjugação Afirmativa" : "Affirmative Conjugation"}
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conjugations.map((c, idx) => (
                        <div
                            key={idx}
                            className={`p-8 rounded-[2rem] border-2 transition-all hover:shadow-lg flex flex-col items-center text-center ${colors[c.color]}`}
                        >
                            <span className="text-4xl mb-4 grayscale hover:grayscale-0 transition-all cursor-default">{c.icon}</span>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-black">{c.person}</span>
                                <span className="text-2xl font-bold text-indigo-500">{c.verb}</span>
                            </div>
                            <div className="flex flex-col items-center mb-4">
                                <span className="text-[10px] font-mono opacity-50">{c.ipa}</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{c.trans}</span>
                            </div>

                            <div className="w-full h-px bg-current opacity-10 mb-4"></div>

                            <button
                                onClick={() => speak(c.ex)}
                                className="group w-full p-3 bg-white/40 hover:bg-white rounded-2xl flex items-center justify-between border border-current/5 transition-all"
                            >
                                <div className="text-left">
                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">
                                        {isPortuguese ? "Exemplo" : "Example"}
                                    </div>
                                    <p className="text-xs font-bold leading-tight">{c.ex}</p>
                                </div>
                                <Volume2 className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contractions - Professional Efficiency */}
            <section className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-indigo-800 rounded-lg"><Zap className="w-5 h-5 text-indigo-400" /></div>
                        <h4 className="text-xl font-bold">{isPortuguese ? "Contrações (Agilidade)" : "Contractions (Fluency)"}</h4>
                    </div>
                    <p className="text-indigo-200 text-sm mb-8 max-w-lg leading-relaxed">
                        {isPortuguese
                            ? "No dia a dia e em ambientes profissionais, falantes nativos raramente dizem 'I am'. Eles preferem a contração. É mais rápido e natural."
                            : "In daily life and professional settings, native speakers rarely say 'I am'. They prefer the contraction. It's faster and more natural."}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {conjugations.slice(0, 4).map((c, i) => (
                            <button
                                key={i}
                                onClick={() => speak(`${c.person}${c.contract}`)}
                                className="bg-indigo-800/40 border border-indigo-700 p-4 rounded-2xl hover:bg-indigo-700 transition-all flex flex-col items-center group"
                            >
                                <span className="text-xs font-bold text-indigo-400 mb-1">{c.person} + {c.verb}</span>
                                <span className="text-xl font-black group-hover:scale-110 transition-transform">{c.person}{c.contract}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practical Application: Identity Card */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><BookOpen className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Aplicações Práticas" : "Practical Applications"}
                    </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {isPortuguese ? "Profissional" : "Professional"}
                        </h5>
                        <ul className="space-y-4">
                            <li className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all">
                                <span className="text-2xl shrink-0">👔</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">"I am a CEO."</p>
                                    <p className="text-[10px] text-slate-400">{isPortuguese ? "(Eu sou Diretor Executivo)" : "(I am Chief Executive Officer)"}</p>
                                </div>
                            </li>
                            <li className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all">
                                <span className="text-2xl shrink-0">📍</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">"He is in London."</p>
                                    <p className="text-[10px] text-slate-400">{isPortuguese ? "(Ele está em Londres)" : "(He is located in London)"}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Smile className="w-4 h-4 text-slate-400" />
                            {isPortuguese ? "Pessoal" : "Personal"}
                        </h5>
                        <ul className="space-y-4">
                            <li className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all">
                                <span className="text-2xl shrink-0">😊</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">"They are happy."</p>
                                    <p className="text-[10px] text-slate-400">{isPortuguese ? "(Eles estão felizes)" : "(They feel happy)"}</p>
                                </div>
                            </li>
                            <li className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all">
                                <span className="text-2xl shrink-0">🏠</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">"She is at home."</p>
                                    <p className="text-[10px] text-slate-400">{isPortuguese ? "(Ela está em casa)" : "(She is currently at home)"}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Teacher's Corner: The "Equals" Logic */}
            <div className="bg-emerald-50 rounded-[2.5rem] p-10 relative border border-emerald-100">
                <div className="absolute top-0 left-10 -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Dica de Mestre" : "Master Tip"}
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Lightbulb className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-emerald-900 mb-2">
                            {isPortuguese ? "A Lógica do 'Igual' (=)" : "The 'Equals' Logic"}
                        </h5>
                        <p className="text-sm text-emerald-800 leading-relaxed">
                            {isPortuguese
                                ? <>Pense no Verb To Be como uma balança equilibrada. <strong>Sujeito = Qualidade/Lugar</strong>. Ele não indica uma ação em movimento (como correr ou comer), mas sim um estado fixo ou permanente. No português temos dois verbos (ser/estar), mas no inglês temos apenas um para os dois casos!</>
                                : <>Think of the Verb To Be as a balanced scale. <strong>Subject = Quality/Place</strong>. It doesn't indicate a moving action (like running or eating), but rather a fixed or permanent state. In many languages you have two different verbs for 'to be', but in English, one verb rules them all!</>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VerbToBeNegInt = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [mode, setMode] = useState<'neg' | 'int'>('neg');

    const negExamples = [
        { full: 'I am not', contract: "I'm not", ipa: '/aɪ æm nɒt/', trans: '(Eu não sou/estou)', icon: '🙋‍♂️' },
        { full: 'He is not', contract: "He isn't", ipa: '/hiː ɪz nɒt/', trans: '(Ele não é/está)', icon: '👨' },
        { full: 'She is not', contract: "She isn't", ipa: '/ʃiː ɪz nɒt/', trans: '(Ela não é/está)', icon: '👩' },
        { full: 'It is not', contract: "It isn't", ipa: '/ɪt ɪz nɒt/', trans: '(Ele/ela não é/está)', icon: '☁️' },
        { full: 'We are not', contract: "We aren't", ipa: '/wiː ɑːr nɒt/', trans: '(Nós não somos/estamos)', icon: '👨‍👩‍👧‍👦' },
        { full: 'You are not', contract: "You aren't", ipa: '/juː ɑːr nɒt/', trans: '(Você/Vocês não é/está/são/estão)', icon: '🫵' },
        { full: 'They are not', contract: "They aren't", ipa: '/ðeɪ ɑːr nɒt/', trans: '(Eles/elas não são/estão)', icon: '👥' },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-slate-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><QuestionIcon className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Negando e Perguntando" : "Denying and Asking"}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Dizer 'não' e fazer perguntas são as ferramentas de sobrevivência em qualquer idioma. O inglês usa regras de posicionamento muito rígidas para isso. Aprenda o 'lugar' de cada palavra e você nunca mais terá medo de errar!\""
                                : "\"Saying 'no' and asking questions are the survival tools of any language. English uses very strict positioning rules for this. Learn the 'place' of each word and you'll never fear making a mistake again!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-200 p-1.5 rounded-2xl w-full max-w-md mx-auto shadow-inner">
                <button
                    onClick={() => setMode('neg')}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${mode === 'neg' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <X className="w-4 h-4" />
                    {isPortuguese ? "Negativa" : "Negative"}
                </button>
                <button
                    onClick={() => setMode('int')}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${mode === 'int' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <QuestionIcon className="w-4 h-4" />
                    {isPortuguese ? "Interrogativa" : "Interrogative"}
                </button>
            </div>

            {mode === 'neg' ? (
                <div className="space-y-12 animate-fade-in">
                    {/* The NOT Rule */}
                    <div className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-20 h-20 bg-rose-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shrink-0">
                            <span className="text-3xl font-black">NOT</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-rose-900 text-lg mb-2">
                                {isPortuguese ? "A Regra de Ouro da Negação" : "The Golden Rule of Negation"}
                            </h5>
                            <p className="text-rose-800 text-sm leading-relaxed mb-4">
                                {isPortuguese
                                    ? "Para negar no Verb To Be, basta colocar a palavra 'NOT' logo após o verbo (am, is, are). É um processo mecânico e simples."
                                    : "To negate in Verb To Be, simply place the word 'NOT' right after the verb (am, is, are). It's a mechanical and simple process."}
                            </p>
                            <div className="inline-flex items-center gap-3 p-3 bg-white rounded-2xl border border-rose-200 shadow-sm">
                                <span className="text-slate-400 font-bold">She</span>
                                <span className="text-indigo-600 font-bold">is</span>
                                <span className="px-3 py-1 bg-rose-500 text-white font-black rounded-lg text-xs animate-pulse">NOT</span>
                                <span className="text-slate-700 font-medium">sad.</span>
                            </div>
                        </div>
                    </div>

                    {/* Conjugation List Negative */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {negExamples.map((ex, i) => (
                            <div key={i} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                                <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{ex.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-black text-slate-800 text-lg">{ex.full}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{ex.ipa}</span>
                                        </div>
                                        <button onClick={() => speak(ex.full)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                            <Volume2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">{ex.contract}</span>
                                        <span className="text-[9px] font-medium text-slate-400">{ex.trans}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-12 animate-fade-in">
                    {/* The Switch Rule */}
                    <div className="p-10 bg-indigo-50 border-2 border-indigo-100 rounded-[3rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-400"></div>
                        <h5 className="font-serif-display text-2xl text-indigo-900 mb-6">
                            {isPortuguese ? "O 'Switch' (A Troca)" : "The Switch"}
                        </h5>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400 mb-2">Statement</span>
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-100 flex gap-3 text-xl font-bold">
                                    <span className="text-slate-700">You</span>
                                    <span className="text-indigo-600">are</span>
                                    <span className="text-slate-400 font-normal">...</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <ArrowRight className="w-8 h-8 text-indigo-300 animate-bounce-x" />
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Inversion</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-indigo-500 mb-2">Question</span>
                                <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg flex gap-3 text-xl font-bold text-white scale-110 ring-4 ring-indigo-100">
                                    <span className="animate-pulse">Are</span>
                                    <span>you</span>
                                    <span>?</span>
                                </div>
                            </div>
                        </div>
                        <p className="mt-8 text-indigo-700 text-sm max-w-lg mx-auto leading-relaxed">
                            {isPortuguese
                                ? "Em inglês, não basta mudar a entonação. O verbo deve vir ANTES do sujeito para indicar que é uma pergunta."
                                : "In English, changing your tone isn't enough. The verb MUST come BEFORE the subject to indicate a question."}
                        </p>
                    </div>

                    {/* Short Answers Section */}
                    <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-emerald-50 rounded-lg"><Check className="w-5 h-5 text-emerald-500" /></div>
                            <h4 className="font-bold text-slate-800 text-lg">
                                {isPortuguese ? "Respostas Curtas (Short Answers)" : "Short Answers"}
                            </h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border-b pb-2">Yes...</h5>
                                <div className="space-y-2">
                                    {['Yes, I am.', 'Yes, he is.', 'Yes, they are.'].map(a => (
                                        <button key={a} onClick={() => speak(a)} className="w-full text-left p-3 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-colors font-bold text-emerald-700 flex justify-between items-center group">
                                            {a}
                                            <Volume2 className="w-3 h-3 opacity-20 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-rose-500 border-b pb-2">No...</h5>
                                <div className="space-y-2">
                                    {["No, I'm not.", "No, he isn't.", "No, they aren't."].map(a => (
                                        <button key={a} onClick={() => speak(a)} className="w-full text-left p-3 bg-rose-50/50 rounded-xl hover:bg-rose-50 transition-colors font-bold text-rose-700 flex justify-between items-center group">
                                            {a}
                                            <Volume2 className="w-3 h-3 opacity-20 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* Master Corner: Pro Tip */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Dica Profissional" : "Pro Tip"}
                </div>
                <div className="flex gap-8 items-start">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Lightbulb className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-amber-900 mb-3">
                            {isPortuguese ? "A Contração de Am Not" : "The 'Am Not' Contraction"}
                        </h5>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            {isPortuguese
                                ? <>Diferente de <strong>is not (isn't)</strong> e <strong>are not (aren't)</strong>, a combinação <strong>am + not</strong> não pode ser contraída em uma única palavra (<s>amn't</s> não existe). Você deve sempre contrair o sujeito com o verbo: <strong>I'm not</strong>.</>
                                : <>Unlike <strong>is not (isn't)</strong> and <strong>are not (aren't)</strong>, the combination <strong>am + not</strong> cannot be contracted into a single word (<s>amn't</s> doesn't exist). You must always contract the subject with the verb: <strong>I'm not</strong>.</>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IndefiniteArticles = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const examplesA = [
        { phrase: 'A car', ipa: '/ə kɑːr/', trans: '(Um carro)' },
        { phrase: 'A book', ipa: '/ə bʊk/', trans: '(Um livro)' },
        { phrase: 'A house', ipa: '/ə haʊs/', trans: '(Uma casa)' },
    ];
    const examplesAn = [
        { phrase: 'An apple', ipa: '/ən ˈæpl/', trans: '(Uma maçã)' },
        { phrase: 'An egg', ipa: '/ən ɛɡ/', trans: '(Um ovo)' },
        { phrase: 'An ice cream', ipa: '/ən aɪs kriːm/', trans: '(Um sorvete)' },
    ];
    const trickyExamples = [
        { phrase: 'A university', reason: isPortuguese ? "Som de 'yu' (consoante)" : "Starts with 'yu' sound", ipa: '/ə ˌjuːnɪˈvɜːrsəti/', icon: '🏫' },
        { phrase: 'An hour', reason: isPortuguese ? "'H' mudo (som de vogal)" : "Silent 'H' (vowel sound)", ipa: '/ən ˈaʊər/', icon: '⌛' },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-emerald-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Ear className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-4xl shadow-lg border-2 border-emerald-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "O Segredo está no Ouvido" : "The Secret is in the Ear"}
                        </h3>
                        <p className="text-emerald-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"A e AN significam a mesma coisa: 'um' ou 'uma'. O segredo para não errar nunca é ouvir o SOM da próxima palavra, não olhar a letra. Se o som travar na garganta, use AN. Se o som fluir, use A.\""
                                : "\"A and AN mean the same thing: 'a' or 'an'. The secret to never missing is listening to the SOUND of the next word, not looking at the letter. If the sound blocks in your throat, use AN. If it flows, use A.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* A Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-indigo-50 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 text-6xl font-black text-indigo-50 group-hover:text-indigo-100 transition-colors">A</div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg">A</div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">
                            {isPortuguese ? "+ Som de Consoante" : "+ Consonant Sound"}
                        </h4>
                        <p className="text-slate-500 text-xs mb-8">
                            {isPortuguese ? "Usamos 'A' quando a próxima palavra começa com som de consoante." : "Use 'A' when the next word starts with a consonant sound."}
                        </p>
                        <div className="space-y-3">
                            {examplesA.map((ex, i) => (
                                <button key={i} onClick={() => speak(ex.phrase)} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 group/btn">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-700">{ex.phrase}</span>
                                        <span className="text-[10px] font-mono text-slate-400">{ex.ipa}</span>
                                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{ex.trans}</span>
                                    </div>
                                    <Volume2 className="w-4 h-4 text-slate-300 group-hover/btn:text-indigo-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AN Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-50 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 text-6xl font-black text-emerald-50 group-hover:text-emerald-100 transition-colors">AN</div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg">AN</div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">
                            {isPortuguese ? "+ Som de Vogal" : "+ Vowel Sound"}
                        </h4>
                        <p className="text-slate-500 text-xs mb-8">
                            {isPortuguese ? "Usamos 'AN' quando a próxima palavra começa com som de vogal." : "Use 'AN' when the next word starts with a vowel sound."}
                        </p>
                        <div className="space-y-3">
                            {examplesAn.map((ex, i) => (
                                <button key={i} onClick={() => speak(ex.phrase)} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 group/btn">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-700">{ex.phrase}</span>
                                        <span className="text-[10px] font-mono text-slate-400">{ex.ipa}</span>
                                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{ex.trans}</span>
                                    </div>
                                    <Volume2 className="w-4 h-4 text-slate-300 group-hover/btn:text-emerald-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tricky Cases Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertTriangle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "As Armadilhas (Tricky Cases)" : "Tricky Cases"}
                    </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {trickyExamples.map((ex, i) => (
                        <div key={i} className="p-6 bg-amber-50/50 border border-amber-100 rounded-3xl flex gap-5 items-center group">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">{ex.icon}</div>
                            <div>
                                <button onClick={() => speak(ex.phrase)} className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xl font-black text-amber-900">{ex.phrase}</span>
                                    <span className="text-[10px] font-mono text-amber-700/50">{ex.ipa}</span>
                                </button>
                                <p className="text-[11px] font-bold text-amber-800/70 uppercase tracking-widest leading-tight">
                                    {ex.reason}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Master Notes: When NOT to use */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 relative border border-rose-100">
                <div className="absolute top-0 left-10 -translate-y-1/2 bg-rose-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Importante!" : "Crucial Note!"}
                </div>
                <div className="grid md:grid-cols-2 gap-10 items-start">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-rose-500" /></div>
                            <div>
                                <h6 className="font-bold text-rose-900 mb-1">{isPortuguese ? "Apenas no Singular" : "Singular Only"}</h6>
                                <p className="text-xs text-rose-800 leading-relaxed">
                                    {isPortuguese
                                        ? "A e AN significam 'UM/UMA'. Por isso, nunca use com palavras no plural. Diga 'Cars', não 'A cars'."
                                        : "A and AN mean 'ONE'. Therefore, never use them with plural words. Say 'Cars', not 'A cars'."}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0"><FastIcon className="w-5 h-5 text-rose-500" /></div>
                            <div>
                                <h6 className="font-bold text-rose-900 mb-1">{isPortuguese ? "Profissões" : "Jobs & Titles"}</h6>
                                <p className="text-xs text-rose-800 leading-relaxed">
                                    {isPortuguese
                                        ? "Em inglês, somos obrigados a usar artigos com profissões. 'I am a doctor', não 'I am doctor'."
                                        : "In English, we MUST use articles with jobs. 'I am a doctor', not 'I am doctor'."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/50 p-6 rounded-3xl border border-rose-200">
                        <h6 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            {isPortuguese ? "Desafio de Mestre" : "Master Challenge"}
                        </h6>
                        <p className="text-xs text-rose-700 leading-relaxed italic">
                            {isPortuguese
                                ? "\"Como você diria 'um agente do FBI'? Pense no som da letra F (/ɛf/). A resposta correta é AN FBI AGENT. Viu como o som manda em tudo?\""
                                : "\"How would you say 'an FBI agent'? Think of the sound of the letter F (/ɛf/). The correct answer is AN FBI AGENT. See how sound rules everything?\""}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobsOccupations = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const jobCategories = [
        {
            name: isPortuguese ? "Saúde & Bem-estar" : "Healthcare & Wellness",
            icon: <Stethoscope className="w-5 h-5" />,
            color: "rose",
            jobs: [
                { title: 'Doctor', ipa: '/ˈdɒktər/', trans: 'Médico', icon: '👨‍⚕️' },
                { title: 'Nurse', ipa: '/nɜːrs/', trans: 'Enfermeiro', icon: '👩‍⚕️' },
                { title: 'Dentist', ipa: '/ˈdentɪst/', trans: 'Dentista', icon: '🦷' },
                { title: 'Surgeon', ipa: '/ˈsɜːrdʒən/', trans: 'Cirurgião', icon: '😷' },
                { title: 'Psychologist', ipa: '/saɪˈkɒlədʒɪst/', trans: 'Psicólogo', icon: '🧠' },
            ]
        },
        {
            name: isPortuguese ? "Tecnologia & Escritório" : "Tech & Office",
            icon: <Laptop className="w-5 h-5" />,
            color: "indigo",
            jobs: [
                { title: 'Software Developer', ipa: '/ˈsɒftwer dɪˈveləpər/', trans: 'Desenvolvedor', icon: '💻' },
                { title: 'Manager', ipa: '/ˈmænɪdʒər/', trans: 'Gerente', icon: '💼' },
                { title: 'Accountant', ipa: '/əˈkaʊntənt/', trans: 'Contador', icon: '📊' },
                { title: 'Secretary', ipa: '/ˈsekrəteri/', trans: 'Secretário', icon: '📞' },
                { title: 'Data Scientist', ipa: '/ˈdeɪtə ˈsaɪəntɪst/', trans: 'Cientista de Dados', icon: '📉' },
            ]
        },
        {
            name: isPortuguese ? "Educação & Ciência" : "Education & Science",
            icon: <TeacherIcon className="w-5 h-5" />,
            color: "blue",
            jobs: [
                { title: 'Teacher', ipa: '/ˈtiːtʃər/', trans: 'Professor', icon: '👨‍🏫' },
                { title: 'Student', ipa: '/ˈstjuːdnt/', trans: 'Estudante', icon: '🎓' },
                { title: 'Professor', ipa: '/prəˈfesər/', trans: 'Professor Univ.', icon: '🏫' },
                { title: 'Researcher', ipa: '/rɪˈsɜːrtʃər/', trans: 'Pesquisador', icon: '🔬' },
                { title: 'Scientist', ipa: '/ˈsaɪəntɪst/', trans: 'Cientista', icon: '🧪' },
            ]
        },
        {
            name: isPortuguese ? "Artes & Mídia" : "Arts & Media",
            icon: <Palette className="w-5 h-5" />,
            color: "purple",
            jobs: [
                { title: 'Artist', ipa: '/ˈɑːrtɪst/', trans: 'Artista', icon: '🎨' },
                { title: 'Photographer', ipa: '/fəˈtɒɡrəfər/', trans: 'Fotógrafo', icon: '📸' },
                { title: 'Musician', ipa: '/mjuˈzɪʃn/', trans: 'Músico', icon: '🎸' },
                { title: 'Actor', ipa: '/ˈæktər/', trans: 'Ator', icon: '🎭' },
                { title: 'Designer', ipa: '/dɪˈzaɪnər/', trans: 'Designer', icon: '🖍️' },
            ]
        },
        {
            name: isPortuguese ? "Serviços & Comércio" : "Services & Trade",
            icon: <ShoppingBag className="w-5 h-5" />,
            color: "emerald",
            jobs: [
                { title: 'Chef', ipa: '/ʃef/', trans: 'Chef de Cozinha', icon: '👨‍🍳' },
                { title: 'Waiter', ipa: '/ˈweɪtər/', trans: 'Garçom', icon: '🍽️' },
                { title: 'Driver', ipa: '/ˈdraɪvər/', trans: 'Motorista', icon: '🚗' },
                { title: 'Salesperson', ipa: '/ˈseɪlzpɜːrsn/', trans: 'Vendedor', icon: '🛍️' },
                { title: 'Baker', ipa: '/ˈbeɪkər/', trans: 'Padeiro', icon: '🥐' },
            ]
        },
        {
            name: isPortuguese ? "Técnico & Segurança" : "Technical & Security",
            icon: <SecurityIcon className="w-5 h-5" />,
            color: "slate",
            jobs: [
                { title: 'Police Officer', ipa: '/pəˈliːs ˈɒfɪsər/', trans: 'Policial', icon: '👮' },
                { title: 'Firefighter', ipa: '/ˈfaɪəfaɪtər/', trans: 'Bombeiro', icon: '👩‍🚒' },
                { title: 'Engineer', ipa: '/ˌendʒɪˈnɪər/', trans: 'Engenheiro', icon: '👷' },
                { title: 'Pilot', ipa: '/ˈpaɪlət/', trans: 'Piloto', icon: '✈️' },
                { title: 'Lawyer', ipa: '/ˈlɔɪər/', trans: 'Advogado', icon: '⚖️' },
            ]
        }
    ];

    const colorClasses: any = {
        rose: "bg-rose-50 border-rose-100 text-rose-700",
        indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
        blue: "bg-blue-50 border-blue-100 text-blue-700",
        purple: "bg-purple-50 border-purple-100 text-purple-700",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
        slate: "bg-slate-50 border-slate-100 text-slate-700"
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Introduction Section */}
            <div className="relative p-8 rounded-[2rem] bg-slate-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><WorkIcon className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "O Que Você Faz?" : "What Do You Do?"}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Falar sobre o trabalho é o início de qualquer networking. Hoje vamos aprender como nomear as profissões e, o mais importante: a regra gramatical obrigatória que muitos esquecem. Prepare-se para atualizar seu 'LinkedIn' mental!\""
                                : "\"Talking about work is the beginning of any networking. Today we'll learn how to name professions and, most importantly: the mandatory grammatical rule many forget. Get ready to update your mental 'LinkedIn'!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Categories and Jobs */}
            {jobCategories.map((category, catIdx) => (
                <section key={catIdx} className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClasses[category.color].split(' ')[0]} ${colorClasses[category.color].split(' ')[2]}`}>
                            {category.icon}
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">{category.name}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.jobs.map((job, jobIdx) => (
                            <button
                                key={jobIdx}
                                onClick={() => speak(`I am a ${job.title}`)}
                                className={`group p-6 rounded-[2rem] border-2 transition-all hover:shadow-lg flex items-center gap-4 text-left ${colorClasses[category.color]}`}
                            >
                                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{job.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h5 className="font-black text-lg leading-tight">{job.title}</h5>
                                        <Volume2 className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono opacity-50">{job.ipa}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{job.trans}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            ))}

            {/* Master Tip: The Article Rule */}
            <div className="p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Info className="w-32 h-32 text-indigo-900" /></div>
                <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shrink-0">
                    <Check className="w-10 h-10" />
                </div>
                <div className="relative z-10">
                    <h5 className="font-bold text-indigo-900 text-lg mb-2">
                        {isPortuguese ? "A Regra de Ouro: O Artigo Obrigatório" : "The Golden Rule: Mandatory Articles"}
                    </h5>
                    <p className="text-indigo-800 text-sm leading-relaxed mb-6">
                        {isPortuguese
                            ? <>Diferente do português, em inglês <strong>sempre</strong> usamos <strong>A</strong> ou <strong>AN</strong> antes de uma profissão no singular.</>
                            : <>Unlike in some languages, in English you <strong>must always</strong> use <strong>A</strong> or <strong>AN</strong> before a singular profession.</>
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-indigo-100">
                            <span className="text-emerald-600 font-black">✓</span>
                            <p className="text-sm font-bold text-slate-700 italic">"I am <span className="text-indigo-600 underline">a</span> doctor."</p>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-rose-100 opacity-60">
                            <span className="text-rose-500 font-black">✗</span>
                            <p className="text-sm font-medium text-slate-400 italic">"I am doctor."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interaction: What do you do? */}
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                <h5 className="font-serif-display text-2xl text-slate-800 mb-2">
                    {isPortuguese ? "Hora de Praticar" : "Practice Time"}
                </h5>
                <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">
                    {isPortuguese
                        ? "Quando alguém perguntar sua profissão, use a estrutura abaixo. Clique para ouvir a pergunta mais comum:"
                        : "When someone asks your job, use the structure below. Click to hear the most common question:"}
                </p>

                <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
                    <button
                        onClick={() => speak("What do you do?")}
                        className="p-8 bg-indigo-600 text-white rounded-3xl shadow-xl hover:scale-105 transition-all group"
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">
                            {isPortuguese ? "A Pergunta" : "The Question"}
                        </div>
                        <div className="text-2xl font-bold flex items-center justify-center gap-3">
                            "What do you do?" <Volume2 className="w-5 h-5 group-hover:animate-pulse" />
                        </div>
                        <div className="mt-2 text-[10px] font-mono opacity-50 italic">/wɒt duː juː duː/</div>
                        {isPortuguese && <div className="mt-1 text-[10px] font-medium opacity-60">(O que você faz?)</div>}
                    </button>

                    <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400">
                            {isPortuguese ? "Sua Resposta" : "Your Answer"}
                        </div>
                        <div className="text-2xl font-black text-slate-700 flex items-center justify-center gap-3">
                            "I am a/an <span className="text-indigo-600">_____</span>."
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {['Teacher', 'Student', 'Engineer'].map(j => (
                                <button key={j} onClick={() => speak(`I am a ${j}`)} className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-indigo-500 border border-indigo-100 hover:bg-indigo-50 transition-colors">
                                    + {j}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Master Note: Gender in English Jobs */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Nota Linguística" : "Linguistic Note"}
                </div>
                <div className="flex gap-8 items-start">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Hand className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-amber-900 mb-3">
                            {isPortuguese ? "Gênero Neutro" : "Gender Neutrality"}
                        </h5>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            {isPortuguese
                                ? <>Diferente do português, a maioria das profissões em inglês não tem gênero. <strong>"Teacher"</strong> serve para professor e professora. <strong>"Doctor"</strong> para médico e médica. Apenas alguns casos raros como <strong>Actor/Actress</strong> ou <strong>Waiter/Waitress</strong> ainda mantêm distinção, mas a tendência moderna é usar a forma neutra para todos!</>
                                : <>Unlike many languages, most jobs in English are gender-neutral. <strong>"Teacher"</strong> works for everyone. <strong>"Doctor"</strong> works for everyone. Only rare cases like <strong>Actor/Actress</strong> still have distinctions, but the modern trend is to use one form for all!</>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SingularPlural = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const rules = [
        {
            title: isPortuguese ? "Regra Geral (+S)" : "General Rule (+S)",
            desc: isPortuguese ? "A maioria das palavras ganha apenas um 'S'." : "Most words just add 'S'.",
            color: "bg-indigo-50 border-indigo-100 text-indigo-700",
            icon: <Plus className="w-5 h-5" />,
            examples: [
                { s: 'Car', p: 'Cars', sipa: '/kɑːr/', pipa: '/kɑːrz/', trans: 'Carro' },
                { s: 'Book', p: 'Books', sipa: '/bʊk/', pipa: '/bʊks/', trans: 'Livro' },
                { s: 'Dog', p: 'Dogs', sipa: '/dɒɡ/', pipa: '/dɒɡz/', trans: 'Cachorro' },
            ]
        },
        {
            title: isPortuguese ? "Sibilantes (+ES)" : "Sibilants (+ES)",
            desc: isPortuguese ? "Palavras que terminam em S, SS, CH, SH, X, Z." : "Words ending in S, SS, CH, SH, X, Z.",
            color: "bg-emerald-50 border-emerald-100 text-emerald-700",
            icon: <Zap className="w-5 h-5" />,
            examples: [
                { s: 'Bus', p: 'Buses', sipa: '/bʌs/', pipa: '/ˈbʌsɪz/', trans: 'Ônibus' },
                { s: 'Watch', p: 'Watches', sipa: '/wɒtʃ/', pipa: '/ˈwɒtʃɪz/', trans: 'Relógio' },
                { s: 'Box', p: 'Boxes', sipa: '/bɒks/', pipa: '/ˈbɒksɪz/', trans: 'Caixa' },
            ]
        },
        {
            title: isPortuguese ? "Consonante + Y (-IES)" : "Consonant + Y (-IES)",
            desc: isPortuguese ? "Troque o Y por IES." : "Change Y to IES.",
            color: "bg-rose-50 border-rose-100 text-rose-700",
            icon: <Scissors className="w-5 h-5" />,
            examples: [
                { s: 'Baby', p: 'Babies', sipa: '/ˈbeɪbi/', pipa: '/ˈbeɪbiz/', trans: 'Bebê' },
                { s: 'City', p: 'Cities', sipa: '/ˈsɪti/', pipa: '/ˈsɪtiz/', trans: 'Cidade' },
                { s: 'Party', p: 'Parties', sipa: '/ˈpɑːrti/', pipa: '/ˈpɑːrtiz/', trans: 'Festa' },
            ]
        },
        {
            title: isPortuguese ? "F / FE (-VES)" : "F / FE (-VES)",
            desc: isPortuguese ? "Troque o F por VES." : "Change F to VES.",
            color: "bg-amber-50 border-amber-100 text-amber-700",
            icon: <Gavel className="w-5 h-5" />,
            examples: [
                { s: 'Leaf', p: 'Leaves', sipa: '/liːf/', pipa: '/liːvz/', trans: 'Folha' },
                { s: 'Knife', p: 'Knives', sipa: '/naɪf/', pipa: '/naɪvz/', trans: 'Faca' },
                { s: 'Wolf', p: 'Wolves', sipa: '/wʊlf/', pipa: '/wʊlvz/', trans: 'Lobo' },
            ]
        }
    ];

    const irregulars = [
        { s: 'Man', p: 'Men', sipa: '/mæn/', pipa: '/men/', icon: '👨' },
        { s: 'Woman', p: 'Women', sipa: '/ˈwʊmən/', pipa: '/ˈwɪmɪn/', icon: '👩' },
        { s: 'Child', p: 'Children', sipa: '/tʃaɪld/', pipa: '/ˈtʃɪldrən/', icon: '🧒' },
        { s: 'Person', p: 'People', sipa: '/ˈpɜːrsn/', pipa: '/ˈpiːpl/', icon: '👤' },
        { s: 'Tooth', p: 'Teeth', sipa: '/tuːθ/', pipa: '/tiːθ/', icon: '🦷' },
        { s: 'Foot', p: 'Feet', sipa: '/fʊt/', pipa: '/fiːt/', icon: '🦶' },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Introduction */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Mais de Um!" : "More Than One!"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Plural em inglês parece simples—basta colocar um 'S', certo? Quase sempre! Mais existem grupos de palavras que gostam de ser diferentes. Hoje vamos dominar as 4 regras principais e os famosos irregulares que pegam todo mundo de surpresa.\""
                                : "\"Plural in English seems simple—just add an 'S', right? Most of the time! But there are groups of words that like to be different. Today we'll master the 4 main rules and the famous irregulars that catch everyone by surprise.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Rule Categories */}
            <div className="grid md:grid-cols-2 gap-6">
                {rules.map((rule, idx) => (
                    <section key={idx} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${rule.color.split(' ')[0]} ${rule.color.split(' ')[2]}`}>
                                {rule.icon}
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">{rule.title}</h4>
                        </div>
                        <div className={`p-6 rounded-[2rem] border-2 ${rule.color} shadow-sm`}>
                            <p className="text-xs font-medium mb-6 opacity-70 italic">{rule.desc}</p>
                            <div className="space-y-4">
                                {rule.examples.map((ex, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white/40 p-3 rounded-2xl border border-current/5 group hover:bg-white transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="text-left">
                                                <span className="font-bold text-slate-700">{ex.s}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-mono opacity-40">{ex.sipa}</span>
                                                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-30">{ex.trans}</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-current/30 group-hover:translate-x-1 transition-transform" />
                                            <div className="text-left">
                                                <span className="font-black text-indigo-600">{ex.p}</span>
                                                <span className="block text-[9px] font-mono opacity-40">{ex.pipa}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => speak(`${ex.s}, ${ex.p}`)} className="p-2 text-current/20 hover:text-indigo-500 transition-colors">
                                            <Volume2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Irregular Plurals Section */}
            <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-indigo-800 rounded-lg"><AlertTriangle className="w-5 h-5 text-indigo-400" /></div>
                        <h4 className="text-xl font-bold">{isPortuguese ? "Os Irregulares (Sem 'S')" : "The Irregulars (No 'S')"}</h4>
                    </div>
                    <p className="text-slate-400 text-sm mb-10 max-w-lg leading-relaxed">
                        {isPortuguese
                            ? "Essas palavras são 'rebeldes' e não seguem regras. Elas mudam completamente de forma no plural. Estes são os mais comuns que você DEVE memorizar."
                            : "These words are 'rebels' and don't follow rules. They change form completely in plural. These are the most common ones you MUST memorize."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {irregulars.map((ex, i) => (
                            <button
                                key={i}
                                onClick={() => speak(`${ex.s}, ${ex.p}`)}
                                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left group"
                            >
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{ex.icon}</span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-400">{ex.s}</span>
                                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                                        <span className="text-lg font-black text-white">{ex.p}</span>
                                    </div>
                                    <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                                        <span>{ex.sipa}</span>
                                        <span>•</span>
                                        <span className="text-indigo-400">{ex.pipa}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Same Form Section */}
            <div className="p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shrink-0">
                    <IterationCw className="w-10 h-10" />
                </div>
                <div>
                    <h5 className="font-bold text-emerald-900 text-lg mb-2">
                        {isPortuguese ? "Palavras que Não Mudam" : "Unchanging Words"}
                    </h5>
                    <p className="text-emerald-800 text-sm leading-relaxed mb-4">
                        {isPortuguese
                            ? "Algumas palavras (geralmente animais) têm a mesma forma para o singular e para o plural. O contexto dirá de quantos estamos falando."
                            : "Some words (usually animals) have the same form for singular and plural. Context will tell you how many we are talking about."}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {['1 Fish → 2 Fish', '1 Sheep → 2 Sheep', '1 Deer → 2 Deer'].map(t => (
                            <span key={t} className="px-4 py-2 bg-white rounded-full text-xs font-black text-emerald-600 shadow-sm border border-emerald-100">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pro Tip: Pronunciation Focus */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100 overflow-visible">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Segredo de Pronúncia" : "Pronunciation Secret"}
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Ear className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-amber-900 mb-3">
                            {isPortuguese ? "Os 3 Sons do 'S'" : "The 3 Sounds of 'S'"}
                        </h5>
                        <p className="text-sm text-amber-800 leading-relaxed mb-6">
                            {isPortuguese
                                ? "O 'S' final nem sempre soa como 'S'. Dependendo do som anterior, ele pode soar como /s/, /z/ ou /ɪz/."
                                : "The final 'S' doesn't always sound like 'S'. Depending on the previous sound, it can sound like /s/, /z/, or /ɪz/."}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                            <div className="p-4 bg-white/60 rounded-2xl border border-amber-200">
                                <span className="block text-xl font-black text-amber-600 mb-1">/s/</span>
                                <span className="text-[10px] text-slate-500">Books, Cats, Maps</span>
                            </div>
                            <div className="p-4 bg-white/60 rounded-2xl border border-amber-200">
                                <span className="block text-xl font-black text-amber-600 mb-1">/z/</span>
                                <span className="text-[10px] text-slate-500">Dogs, Cars, Pens</span>
                            </div>
                            <div className="p-4 bg-white/60 rounded-2xl border border-amber-200">
                                <span className="block text-xl font-black text-amber-600 mb-1">/ɪz/</span>
                                <span className="text-[10px] text-slate-500">Buses, Boxes, Watches</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Master Challenge */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 relative border border-rose-100">
                <div className="absolute top-0 left-10 -translate-y-1/2 bg-rose-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Desafio de Mestre" : "Master Challenge"}
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Quote className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-rose-900 mb-2">
                            {isPortuguese ? "O Erro que Entrega o Iniciante" : "The Beginner's Tell"}
                        </h5>
                        <p className="text-sm text-rose-800 italic leading-relaxed italic">
                            {isPortuguese
                                ? "\"Muitos alunos esquecem que Adjetivos (cores, tamanhos) NUNCA vão para o plural. Dizemos 'The red cars', nunca 'The reds cars'. O plural fica guardado apenas no substantivo!\""
                                : "\"Many students forget that Adjectives (colors, sizes) NEVER go into plural. We say 'The red cars', never 'The reds cars'. The plural is only kept in the noun!\""}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ColorsAdjectives = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const colorLibrary = [
        {
            category: isPortuguese ? "Cores Básicas" : "Basic Colors",
            colors: [
                { name: 'Red', hex: '#ef4444', ipa: '/red/', trans: 'Vermelho' },
                { name: 'Blue', hex: '#3b82f6', ipa: '/bluː/', trans: 'Azul' },
                { name: 'Green', hex: '#22c55e', ipa: '/ɡriːn/', trans: 'Verde' },
                { name: 'Yellow', hex: '#eab308', ipa: '/ˈjeloʊ/', trans: 'Amarelo' },
                { name: 'Orange', hex: '#f97316', ipa: '/ˈɔːrɪndʒ/', trans: 'Laranja' },
                { name: 'Purple', hex: '#a855f7', ipa: '/ˈpɜːrpl/', trans: 'Roxo' },
                { name: 'Pink', hex: '#ec4899', ipa: '/pɪŋk/', trans: 'Rosa' },
                { name: 'Brown', hex: '#78350f', ipa: '/braʊn/', trans: 'Marrom' },
                { name: 'Black', hex: '#0f172a', ipa: '/blæk/', trans: 'Preto' },
                { name: 'White', hex: '#ffffff', ipa: '/waɪt/', trans: 'Branco', border: true },
                { name: 'Gray', hex: '#64748b', ipa: '/ɡreɪ/', trans: 'Cinza' },
            ]
        },
        {
            category: isPortuguese ? "Cores Complexas & Tons" : "Complex Colors & Shades",
            colors: [
                { name: 'Teal', hex: '#14b8a6', ipa: '/tiːl/', trans: 'Ciano/Verde-azulado' },
                { name: 'Maroon', hex: '#7f1d1d', ipa: '/məˈruːn/', trans: 'Vinho/Bordô' },
                { name: 'Turquoise', hex: '#06b6d4', ipa: '/ˈtɜːrkwɔɪz/', trans: 'Turquesa' },
                { name: 'Beige', hex: '#f5f5dc', ipa: '/beɪʒ/', trans: 'Bege' },
                { name: 'Navy', hex: '#1e3a8a', ipa: '/ˈneɪvi/', trans: 'Azul-marinho' },
                { name: 'Gold', hex: '#fbbf24', ipa: '/ɡoʊld/', trans: 'Dourado' },
                { name: 'Silver', hex: '#cbd5e1', ipa: '/ˈsɪlvər/', trans: 'Prateado' },
                { name: 'Violet', hex: '#8b5cf6', ipa: '/ˈvaɪələt/', trans: 'Violeta' },
                { name: 'Emerald', hex: '#10b981', ipa: '/ˈemərəld/', trans: 'Esmeralda' },
                { name: 'Amber', hex: '#f59e0b', ipa: '/ˈæmbər/', trans: 'Âmbar' },
            ]
        }
    ];

    const adjectivePairs = [
        {
            category: isPortuguese ? "Aparência & Condição" : "Appearance & Condition",
            pairs: [
                { w1: 'Beautiful', ipa1: '/ˈbjuːtɪfl/', trans1: 'Bonito(a)', w2: 'Ugly', ipa2: '/ˈʌɡli/', trans2: 'Feio(a)' },
                { w1: 'Clean', ipa1: '/kliːn/', trans1: 'Limpo(a)', w2: 'Dirty', ipa2: '/ˈdɜːrti/', trans2: 'Sujo(a)' },
                { w1: 'New', ipa1: '/njuː/', trans1: 'Novo(a)', w2: 'Old', ipa2: '/oʊld/', trans2: 'Velho(a)' },
                { w1: 'Rich', ipa1: '/rɪtʃ/', trans1: 'Rico(a)', w2: 'Poor', ipa2: '/pʊər/', trans2: 'Pobre' },
                { w1: 'Strong', ipa1: '/strɒŋ/', trans1: 'Forte', w2: 'Weak', ipa2: '/wiːk/', trans2: 'Fraco(a)' },
                { w1: 'Fast', ipa1: '/fɑːst/', trans1: 'Rápido(a)', w2: 'Slow', ipa2: '/sloʊ/', trans2: 'Lento(a)' },
            ]
        },
        {
            category: isPortuguese ? "Tamanho & Forma" : "Size & Shape",
            pairs: [
                { w1: 'Big', ipa1: '/bɪɡ/', trans1: 'Grande', w2: 'Small', ipa2: '/smɔːl/', trans2: 'Pequeno(a)' },
                { w1: 'Tall', ipa1: '/tɔːl/', trans1: 'Alto(a)', w2: 'Short', ipa2: '/ʃɔːrt/', trans2: 'Baixo(a)' },
                { w1: 'Long', ipa1: '/lɒŋ/', trans1: 'Comprido(a)', w2: 'Short', ipa2: '/ʃɔːrt/', trans2: 'Curto(a)' },
                { w1: 'Wide', ipa1: '/waɪd/', trans1: 'Largo(a)', w2: 'Narrow', ipa2: '/ˈnæroʊ/', trans2: 'Estreito(a)' },
                { w1: 'Thick', ipa1: '/θɪk/', trans1: 'Grosso(a)', w2: 'Thin', ipa2: '/θɪn/', trans2: 'Fino(a)' },
                { w1: 'Huge', ipa1: '/hjuːdʒ/', trans1: 'Enorme', w2: 'Tiny', ipa2: '/ˈtaɪni/', trans2: 'Minúsculo(a)' },
            ]
        },
        {
            category: isPortuguese ? "Personalidade & Emoção" : "Personality & Emotion",
            pairs: [
                { w1: 'Happy', ipa1: '/ˈhæpi/', trans1: 'Feliz', w2: 'Sad', ipa2: '/sæd/', trans2: 'Triste' },
                { w1: 'Kind', ipa1: '/kaɪnd/', trans1: 'Gentil', w2: 'Cruel', ipa2: '/ˈkruːəl/', trans2: 'Cruel' },
                { w1: 'Brave', ipa1: '/breɪv/', trans1: 'Corajoso(a)', w2: 'Cowardly', ipa2: '/ˈkaʊərdli/', trans2: 'Covarde' },
                { w1: 'Funny', ipa1: '/ˈfʌni/', trans1: 'Engraçado(a)', w2: 'Serious', ipa2: '/ˈsɪəriəs/', trans2: 'Sério(a)' },
                { w1: 'Smart', ipa1: '/smɑːrt/', trans1: 'Inteligente', w2: 'Stupid', ipa2: '/ˈstjuːpɪd/', trans2: 'Burro(a)' },
                { w1: 'Excited', ipa1: '/ɪkˈsaɪtɪd/', trans1: 'Animado(a)', w2: 'Bored', ipa2: '/bɔːrd/', trans2: 'Entediado(a)' },
            ]
        },
        {
            category: isPortuguese ? "Sensação & Utilidade" : "Sensation & Utility",
            pairs: [
                { w1: 'Hot', ipa1: '/hɒt/', trans1: 'Quente', w2: 'Cold', ipa2: '/koʊld/', trans2: 'Frio' },
                { w1: 'Hard', ipa1: '/hɑːrd/', trans1: 'Duro/Difícil', w2: 'Soft/Easy', ipa2: '/sɒft/ /ˈiːzi/', trans2: 'Macio/Fácil' },
                { w1: 'Full', ipa1: '/fʊl/', trans1: 'Cheio(a)', w2: 'Empty', ipa2: '/ˈempti/', trans2: 'Vazio(a)' },
                { w1: 'Good', ipa1: '/ɡʊd/', trans1: 'Bom/Boa', w2: 'Bad', ipa2: '/bæd/', trans2: 'Mau/Ruim' },
                { w1: 'Cheap', ipa1: '/tʃiːp/', trans1: 'Barato(a)', w2: 'Expensive', ipa2: '/ɪkˈspensɪv/', trans2: 'Caro(a)' },
                { w1: 'Right', ipa1: '/raɪt/', trans1: 'Certo(a)', w2: 'Wrong', ipa2: '/rɒŋ/', trans2: 'Errado(a)' },
            ]
        }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Palette className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Dando Vida ao Mundo" : "Giving Life to the World"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Adjetivos são os temperos da língua. Sem eles, as frases são insossas. Hoje vamos colorir seu vocabulário com dezenas de cores e os opostos mais importantes. Preste atenção: em inglês, a descrição vem ANTES da coisa!\""
                                : "\"Adjectives are the spices of language. Without them, sentences are bland. Today we will color your vocabulary with dozens of colors and the most important opposites. Pay attention: in English, the description comes BEFORE the thing!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Colors Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Palette className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "O Espectro Completo" : "The Full Spectrum"}
                    </h4>
                </div>

                {colorLibrary.map((lib, idx) => (
                    <div key={idx} className="space-y-4">
                        <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-2">{lib.category}</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {lib.colors.map(c => (
                                <button
                                    key={c.name}
                                    onClick={() => speak(c.name)}
                                    className={`group h-24 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:scale-105 transition-all relative overflow-hidden border ${c.border ? 'border-slate-200' : 'border-transparent'}`}
                                    style={{ backgroundColor: c.hex }}
                                >
                                    <span className={`font-black text-sm drop-shadow-md ${['White', 'Beige', 'Silver', 'Amber', 'Yellow'].includes(c.name) ? 'text-slate-800' : 'text-white'}`}>
                                        {c.name}
                                    </span>
                                    <div className="flex flex-col items-center">
                                        <span className={`text-[8px] font-mono opacity-60 ${['White', 'Beige', 'Silver', 'Amber', 'Yellow'].includes(c.name) ? 'text-slate-500' : 'text-slate-200'}`}>
                                            {c.ipa}
                                        </span>
                                        {isPortuguese && (
                                            <span className={`text-[8px] font-bold uppercase tracking-tighter ${['White', 'Beige', 'Silver', 'Amber', 'Yellow'].includes(c.name) ? 'text-slate-400' : 'text-slate-300'}`}>
                                                {c.trans}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Volume2 className={`w-3 h-3 ${['White', 'Beige', 'Silver', 'Amber', 'Yellow'].includes(c.name) ? 'text-slate-400' : 'text-white/50'}`} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Modifiers for Colors */}
                <div className="p-6 bg-slate-100 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-black text-indigo-600 uppercase mb-2">Light + [Color]</span>
                        <div className="flex gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-200 border border-white"></div>
                            <div className="w-8 h-8 rounded-lg bg-blue-500"></div>
                        </div>
                        <p className="text-[10px] text-slate-500"><strong>Light Blue</strong> {isPortuguese ? "(Azul-claro)" : "(Light Blue)"}</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-black text-slate-900 uppercase mb-2">Dark + [Color]</span>
                        <div className="flex gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-900 border border-white"></div>
                            <div className="w-8 h-8 rounded-lg bg-blue-500"></div>
                        </div>
                        <p className="text-[10px] text-slate-500"><strong>Dark Blue</strong> {isPortuguese ? "(Azul-escuro)" : "(Dark Blue)"}</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-black text-rose-500 uppercase mb-2">Bright + [Color]</span>
                        <div className="flex gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-yellow-400 animate-pulse"></div>
                            <div className="w-8 h-8 rounded-lg bg-yellow-600"></div>
                        </div>
                        <p className="text-[10px] text-slate-500"><strong>Bright Yellow</strong> {isPortuguese ? "(Amarelo Vibrante)" : "(Vibrant Yellow)"}</p>
                    </div>
                </div>
            </section>

            {/* Adjectives & Opposites Section */}
            <section className="space-y-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Activity className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Adjetivos & Seus Opostos" : "Adjectives & Their Opposites"}
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {adjectivePairs.map((cat, idx) => (
                        <div key={idx} className="space-y-4">
                            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b pb-2">
                                <Star className="w-4 h-4 text-emerald-400" /> {cat.category}
                            </h5>
                            <div className="space-y-3">
                                {cat.pairs.map((pair, pIdx) => (
                                    <div key={pIdx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                        <button onClick={() => speak(pair.w1)} className="flex-1 text-left">
                                            <span className="font-black text-indigo-600 text-lg">{pair.w1}</span>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-mono text-slate-400">{pair.ipa1}</span>
                                                {isPortuguese && <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{pair.trans1}</span>}
                                            </div>
                                        </button>
                                        <div className="px-4 text-slate-300 font-bold">vs</div>
                                        <button onClick={() => speak(pair.w2)} className="flex-1 text-right">
                                            <span className="font-black text-rose-500 text-lg">{pair.w2}</span>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-mono text-slate-400">{pair.ipa2}</span>
                                                {isPortuguese && <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{pair.trans2}</span>}
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Grammar: Adjective Placement */}
            <section className="bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-4 opacity-5 rotate-12"><IterationCw className="w-40 h-40 text-indigo-900" /></div>
                <div className="relative z-10">
                    <h5 className="font-serif-display text-2xl text-indigo-900 mb-6 flex items-center gap-3">
                        <Scale className="w-8 h-8" />
                        {isPortuguese ? "Regra de Ouro: A Ordem dos Fatores" : "Golden Rule: The Order of Things"}
                    </h5>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div>
                            <p className="text-indigo-800 text-sm leading-relaxed mb-6">
                                {isPortuguese
                                    ? <>Em inglês, o adjetivo (qualidade) quase sempre vem <strong>ANTES</strong> do substantivo (objeto/pessoa). No português dizemos "carro azul", no inglês dizemos "azul carro".</>
                                    : <>In English, the adjective (quality) almost always comes <strong>BEFORE</strong> the noun (object/person). We don't say "car blue", we say "blue car".</>
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-indigo-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-black">ADJ</span>
                                        <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-black">NOUN</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-indigo-300" />
                                    <span className="font-black text-indigo-700">"A <span className="underline">red</span> car"</span>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-indigo-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-black">ADJ</span>
                                        <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-black">NOUN</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-indigo-300" />
                                    <span className="font-black text-indigo-700">"A <span className="underline">smart</span> student"</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/60 p-6 rounded-3xl border border-indigo-200 backdrop-blur-sm">
                            <h6 className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-4">
                                {isPortuguese ? "Exceção: Com o Verb TO BE" : "Exception: With Verb TO BE"}
                            </h6>
                            <p className="text-xs text-indigo-700 leading-relaxed mb-4">
                                {isPortuguese
                                    ? "Se estivermos usando o Verb To Be, o adjetivo vem depois do verbo, assim como no português."
                                    : "If we are using the Verb To Be, the adjective comes after the verb, just like in many other languages."}
                            </p>
                            <div className="space-y-2">
                                <button onClick={() => speak("The car is red.")} className="w-full p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-left text-xs font-bold text-indigo-900 flex justify-between group">
                                    "The car <u>is</u> <b>red</b>."
                                    <Volume2 className="w-3 h-3 opacity-20 group-hover:opacity-100" />
                                </button>
                                <button onClick={() => speak("You are happy.")} className="w-full p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-left text-xs font-bold text-indigo-900 flex justify-between group">
                                    "You <u>are</u> <b>happy</b>."
                                    <Volume2 className="w-3 h-3 opacity-20 group-hover:opacity-100" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Master Tips Corner */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Dicas de Mestre" : "Master Notes"}
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <IterationCw className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <h5 className="font-bold text-amber-900 mb-2">
                                {isPortuguese ? "Sem Plural para Adjetivos!" : "No Plural for Adjectives!"}
                            </h5>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                {isPortuguese
                                    ? <>Nunca coloque adjetivos no plural. O "S" vai apenas no substantivo. Dizemos <b>"Big houses"</b>, não <s>"Bigs houses"</s>.</>
                                    : <>Never put adjectives in plural. The "S" only goes on the noun. We say <b>"Big houses"</b>, not <s>"Bigs houses"</s>.</>
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <FastIcon className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <h5 className="font-bold text-amber-900 mb-2">
                                {isPortuguese ? "Aumentando a Intensidade" : "Boosting Intensity"}
                            </h5>
                            <p className="text-sm text-amber-800 leading-relaxed mb-3">
                                {isPortuguese
                                    ? "Use estas palavras para dar mais força aos seus adjetivos:"
                                    : "Use these words to give more strength to your adjectives:"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Very', 'Quite', 'Really', 'Extremely'].map(mod => (
                                    <span key={mod} className="px-2 py-1 bg-white border border-amber-200 rounded text-[10px] font-black text-amber-700">{mod}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teacher Matthew's Final Quote */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 relative border border-rose-100 flex gap-8 items-center">
                <div className="w-20 h-20 rounded-full bg-rose-500 border-4 border-white shadow-xl flex items-center justify-center text-4xl shrink-0 animate-float">👨‍🏫</div>
                <div>
                    <h6 className="font-black text-rose-900 uppercase text-xs tracking-widest mb-1">{isPortuguese ? "Desafio Final" : "Final Challenge"}</h6>
                    <p className="text-sm text-rose-800 italic leading-relaxed">
                        {isPortuguese
                            ? "\"Olhe ao seu redor agora. Escolha 3 objetos e tente descrevê-los usando uma cor e um adjetivo. Por exemplo: 'A blue small phone'. Pratique isso todo dia e você pensará em inglês em semanas!\""
                            : "\"Look around you now. Pick 3 objects and try to describe them using a color and an adjective. For example: 'A blue small phone'. Practice this every day and you'll be thinking in English in weeks!\""}
                    </p>
                </div>
            </div>
        </div>
    );
};

const NumbersZeroToTwenty = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const basicNumbers = [
        { n: 0, w: 'Zero', ipa: '/ˈzɪəroʊ/', trans: 'Zero', hint: 'zii-rou', icon: '⭕' },
        { n: 1, w: 'One', ipa: '/wʌn/', trans: 'Um', hint: 'uan', icon: '☝️' },
        { n: 2, w: 'Two', ipa: '/tuː/', trans: 'Dois', hint: 'tuu', icon: '✌️' },
        { n: 3, w: 'Three', ipa: '/θriː/', trans: 'Três', hint: 'th-rii', icon: '☘️' },
        { n: 4, w: 'Four', ipa: '/fɔːr/', trans: 'Quatro', hint: 'fór', icon: '🍀' },
        { n: 5, w: 'Five', ipa: '/faɪv/', trans: 'Cinco', hint: 'fa-iv', icon: '🖐️' },
        { n: 6, w: 'Six', ipa: '/sɪks/', trans: 'Seis', hint: 'siks', icon: '🎲' },
        { n: 7, w: 'Seven', ipa: '/ˈsevn/', trans: 'Sete', hint: 'sé-ven', icon: '🌈' },
        { n: 8, w: 'Eight', ipa: '/eɪt/', trans: 'Oito', hint: 'êit', icon: '🎱' },
        { n: 9, w: 'Nine', ipa: '/naɪn/', trans: 'Nove', hint: 'ná-in', icon: '🐱' },
        { n: 10, w: 'Ten', ipa: '/ten/', trans: 'Dez', hint: 'tén', icon: '🔟' },
        { n: 11, w: 'Eleven', ipa: '/ɪˈlevn/', trans: 'Onze', hint: 'i-lé-ven', icon: '⚽' },
        { n: 12, w: 'Twelve', ipa: '/twelv/', trans: 'Doze', hint: 'tu-él-v', icon: '🕛' },
    ];

    const teenNumbers = [
        { n: 13, w: 'Thirteen', ipa: '/ˌθɜːrˈtiːn/', trans: 'Treze', hint: 'th-er-tiin', icon: '🔞' },
        { n: 14, w: 'Fourteen', ipa: '/ˌfɔːrˈtiːn/', trans: 'Quatorze', hint: 'for-tiin', icon: '📅' },
        { n: 15, w: 'Fifteen', ipa: '/ˌfɪfˈtiːn/', trans: 'Quinze', hint: 'fif-tiin', icon: '🎂' },
        { n: 16, w: 'Sixteen', ipa: '/ˌsɪksˈtiːn/', trans: 'Dezesseis', hint: 'siks-tiin', icon: '🚗' },
        { n: 17, w: 'Seventeen', ipa: '/ˌsevnˈtiːn/', trans: 'Dezessete', hint: 'se-ven-tiin', icon: '🎓' },
        { n: 18, w: 'Eighteen', ipa: '/ˌeɪˈtiːn/', trans: 'Dezoito', hint: 'ei-tiin', icon: '🗽' },
        { n: 19, w: 'Nineteen', ipa: '/ˌnaɪnˈtiːn/', trans: 'Dezenove', hint: 'nain-tiin', icon: '🚀' },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Introduction */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Matthew's Counting Lab" : "Matthew's Counting Lab"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Números são a batida do coração da lógica. Sem eles, você não sabe sua idade, não paga o café e não dá seu telefone. O segredo de hoje está no sufixo '-teen'. Se você acentuar o som final corretamente, o mundo te entenderá perfeitamente!\""
                                : "\"Numbers are the heartbeat of logic. Without them, you don't know your age, you can't pay for coffee, and you can't give your phone number. Today's secret lies in the '-teen' suffix. If you stress that final sound correctly, the world will understand you perfectly!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Part 1: The Foundation (0-12) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Star className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "A Base (0-12)" : "The Foundation (0-12)"}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {basicNumbers.map(item => (
                        <button
                            key={item.n}
                            onClick={() => speak(item.w)}
                            className="group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-xl transition-all flex flex-col items-center relative overflow-hidden"
                        >
                            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="text-3xl font-black text-slate-800 leading-none mb-1">{item.n}</span>
                            <h5 className="font-bold text-indigo-600 text-sm group-hover:text-indigo-700 transition-colors">{item.w}</h5>
                            <div className="flex flex-col items-center mt-2">
                                <span className="text-[10px] font-mono text-slate-400 leading-none">{item.ipa}</span>
                                {isPortuguese && <span className="text-[9px] font-bold text-indigo-300 uppercase mt-0.5 opacity-60">({item.trans})</span>}
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Volume2 className="w-3 h-3 text-indigo-300" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Part 2: The Teens (13-19) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Zap className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Os 'Teens' (13-19)" : "The Teens (13-19)"}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {teenNumbers.map(item => (
                        <button
                            key={item.n}
                            onClick={() => speak(item.w)}
                            className="group bg-white p-6 rounded-[2.5rem] border-2 border-emerald-50 shadow-sm hover:border-emerald-500 hover:shadow-2xl transition-all flex flex-col items-center text-center relative"
                        >
                            <span className="text-2xl font-black text-emerald-600 mb-2">{item.n}</span>
                            <h5 className="font-black text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">
                                {item.w.split('t')[0]}<span className="text-emerald-500 underline decoration-2">teen</span>
                            </h5>
                            <div className="flex flex-col items-center mt-2">
                                <span className="text-[10px] font-mono text-slate-400">{item.ipa}</span>
                                {isPortuguese && <span className="text-[9px] font-bold text-emerald-300 uppercase mt-0.5">({item.trans})</span>}
                            </div>
                            <Volume2 className="w-4 h-4 text-emerald-200 mt-4 group-hover:scale-125 transition-transform" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Special Number 20 */}
            <section className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 rounded-[2rem] bg-indigo-600 border-4 border-indigo-400 flex items-center justify-center text-6xl font-black shadow-inner">20</div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                            <h4 className="text-4xl font-serif-display">Twenty</h4>
                            <button onClick={() => speak("Twenty")} className="p-2 bg-indigo-700 rounded-full hover:bg-indigo-500 transition-colors"><Volume2 className="w-5 h-5" /></button>
                        </div>
                        <p className="text-indigo-200 text-sm leading-relaxed max-w-lg">
                            {isPortuguese
                                ? "O número 20 marca o início das dezenas. Note a diferença no som final '-TY' em vez de '-TEEN'. Em muitos sotaques americanos, o 'T' quase não é pronunciado, soando como 'twenny'!"
                                : "The number 20 marks the beginning of the tens. Note the difference in the final sound '-TY' instead of '-TEEN'. In many American accents, the 'T' is barely pronounced, sounding like 'twenny'!"
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Pro Tip Box: TEEN vs TY */}
            <div className="p-8 bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Ear className="w-32 h-32 text-amber-900" /></div>
                <div className="w-20 h-20 bg-amber-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shrink-0">
                    <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="relative z-10">
                    <h5 className="font-bold text-amber-900 text-lg mb-2">
                        {isPortuguese ? "Dica de Pronúncia: O Estresse Tônico" : "Pronunciation Tip: The Tonic Stress"}
                    </h5>
                    <p className="text-amber-800 text-sm leading-relaxed mb-6">
                        {isPortuguese
                            ? <>Não confunda <b>13 (Thirteen)</b> com <b>30 (Thirty)</b>. Nos números "teen", a força da voz vai para o final: thir-<b>TEEN</b>. Nos números de dezena, a força vai para o início: <b>THIR</b>-ty.</>
                            : <>Don't confuse <b>13 (Thirteen)</b> with <b>30 (Thirty)</b>. In "teen" numbers, the stress is at the end: thir-<b>TEEN</b>. In tens, the stress is at the beginning: <b>THIR</b>-ty.</>
                        }
                    </p>
                </div>
            </div>

            {/* Applications: Numbers in Real Life */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Onde usamos?" : "Practical Usage"}
                    </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Age Application */}
                    <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                        <h5 className="font-bold text-slate-700 flex items-center gap-2">
                            <Baby className="w-5 h-5 text-indigo-400" />
                            {isPortuguese ? "Sua Idade" : "Your Age"}
                        </h5>
                        <button
                            onClick={() => speak("I am eighteen years old.")}
                            className="p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all text-left group"
                        >
                            <p className="text-sm font-bold text-slate-600 italic">"I am <span className="text-indigo-600 underline">eighteen</span> years old."</p>
                            <p className="text-[10px] text-slate-400 mt-1">{isPortuguese ? "(Eu tenho 18 anos)" : "(Literal: I am 18 years old)"}</p>
                        </button>
                        <p className="text-xs text-slate-500 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                            {isPortuguese
                                ? "Lembre-se: em inglês não 'temos' idade, nós 'somos' idade (use o Verb TO BE)."
                                : "Remember: in English we don't 'have' age, we 'are' age (use Verb TO BE)."}
                        </p>
                    </div>

                    {/* Phone Number Application */}
                    <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                        <h5 className="font-bold text-slate-700 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-emerald-400" />
                            {isPortuguese ? "Número de Telefone" : "Phone Numbers"}
                        </h5>
                        <button
                            onClick={() => speak("Oh nine eight seven six")}
                            className="p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-all text-left"
                        >
                            <p className="text-sm font-bold text-slate-600 italic">"0 - 9 - 8 - 7 - 6..."</p>
                            <p className="text-[10px] text-emerald-600 mt-1 font-bold">{isPortuguese ? "Dica: Fale dígito por dígito." : "Tip: Say it digit by digit."}</p>
                        </button>
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-center flex-1">
                                <span className="text-[10px] font-black text-slate-400 block uppercase">0 = Zero</span>
                            </div>
                            <span className="text-slate-300 font-bold">OR</span>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-center flex-1">
                                <span className="text-[10px] font-black text-emerald-500 block uppercase">0 = Oh</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Master Note: The 'TH' in Three */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 relative border border-rose-100">
                <div className="absolute top-0 left-10 -translate-y-1/2 bg-rose-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Atenção Total!" : "Full Attention!"}
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Mic className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-rose-900 mb-2">
                            {isPortuguese ? "O Som Fantasma: 'TH' em Three" : "The Ghost Sound: 'TH' in Three"}
                        </h5>
                        <p className="text-sm text-rose-800 leading-relaxed">
                            {isPortuguese
                                ? <>O número <b>3 (Three)</b> é um dos sons mais difíceis para brasileiros. Coloque a ponta da língua entre os dentes e sopre levemente. Se você disser "tree" (/triː/), você está dizendo <b>Árvore</b>. Pratique o sopro!</>
                                : <>The number <b>3 (Three)</b> is a tricky sound. Place the tip of your tongue between your teeth and blow gently. If you say "tree" (/triː/), you're saying <b>Árvore</b>. Practice the blow!</>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NumbersTwentyHundred = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const tens = [
        { n: 20, w: 'Twenty', ipa: '/ˈtwenti/', trans: 'Vinte', icon: '2️⃣0️⃣', hint: 'twen-y' },
        { n: 30, w: 'Thirty', ipa: '/ˈθɜːrti/', trans: 'Trinta', icon: '3️⃣0️⃣', hint: 'thir-ty' },
        { n: 40, w: 'Forty', ipa: '/ˈfɔːrti/', trans: 'Quarenta', icon: '4️⃣0️⃣', hint: 'for-ty' },
        { n: 50, w: 'Fifty', ipa: '/ˈfɪfti/', trans: 'Cinquenta', icon: '5️⃣0️⃣', hint: 'fif-ty' },
        { n: 60, w: 'Sixty', ipa: '/ˈsɪksti/', trans: 'Sessenta', icon: '6️⃣0️⃣', hint: 'six-ty' },
        { n: 70, w: 'Seventy', ipa: '/ˈsevnti/', trans: 'Setenta', icon: '7️⃣0️⃣', hint: 'seven-ty' },
        { n: 80, w: 'Eighty', ipa: '/ˈeɪti/', trans: 'Oitenta', icon: '8️⃣0️⃣', hint: 'ei-ty' },
        { n: 90, w: 'Ninety', ipa: '/ˈnaɪnti/', trans: 'Noventa', icon: '9️⃣0️⃣', hint: 'nain-ty' },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Dominando as Dezenas" : "Mastering the Tens"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Parabéns! Você já sabe contar até 19. Agora, o segredo é simples: aprenda 8 palavras (20, 30... 90) e você saberá contar até 99 instantaneamente! O padrão é sempre o mesmo: Dezena + Unidade. Vamos desbloquear esse superpoder?\""
                                : "\"Congratulations! You can already count to 19. Now, the secret is simple: learn 8 words (20, 30... 90) and you'll know how to count to 99 instantly! The pattern is always the same: Ten + Unit. Let's unlock this superpower?\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* The Tens Grid */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Layers className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "As Dezenas Cheias" : "The Round Tens"}
                    </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tens.map(item => (
                        <button
                            key={item.n}
                            onClick={() => speak(item.w)}
                            className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-xl transition-all flex flex-col items-center relative overflow-hidden"
                        >
                            <span className="text-3xl mb-3 tracking-widest">{item.icon}</span>
                            <h5 className="font-black text-slate-800 text-2xl group-hover:text-indigo-600 transition-colors">{item.w}</h5>
                            <div className="flex flex-col items-center mt-1">
                                <span className="text-[10px] font-mono text-slate-400">{item.ipa}</span>
                                {isPortuguese && <span className="text-[9px] font-bold text-indigo-300 uppercase mt-0.5">({item.trans})</span>}
                            </div>
                            <Volume2 className="w-4 h-4 text-indigo-200 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </section>

            {/* The Logic: Building Numbers */}
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-emerald-500" />
                    {isPortuguese ? "Como montar qualquer número" : "How to build any number"}
                </h4>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                    <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100 w-full md:w-auto">
                        <span className="block text-xs font-black uppercase text-indigo-400 mb-1">DECIMAL</span>
                        <div className="text-2xl font-black text-indigo-800">Twenty</div>
                    </div>
                    <div className="text-slate-300 text-2xl font-black">+</div>
                    <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100 w-full md:w-auto">
                        <span className="block text-xs font-black uppercase text-emerald-400 mb-1">UNIT</span>
                        <div className="text-2xl font-black text-emerald-800">One</div>
                    </div>
                    <div className="text-slate-300 text-2xl font-black">=</div>
                    <button onClick={() => speak("Twenty-one")} className="p-6 bg-slate-800 text-white rounded-2xl shadow-xl hover:scale-105 transition-transform w-full md:w-auto">
                        <span className="block text-xs font-black uppercase text-slate-500 mb-1">RESULT</span>
                        <div className="text-3xl font-black">Twenty-one</div>
                    </button>
                </div>
                <p className="text-center text-slate-500 text-sm mt-6 italic bg-slate-50 p-4 rounded-xl">
                    {isPortuguese
                        ? "Simples assim! Basta juntar a dezena com a unidade. Exemplo: 45 = Forty-five. 99 = Ninety-nine."
                        : "Simple as that! Just combine the ten with the unit. Example: 45 = Forty-five. 99 = Ninety-nine."}
                </p>
            </div>

            {/* The Big Boss: 100 */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2.5rem] p-1 text-white shadow-xl transform hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => speak("One hundred")}>
                <div className="bg-white/10 backdrop-blur-lg rounded-[2.3rem] p-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl font-black text-amber-500 shadow-md">100</div>
                        <div>
                            <h3 className="text-3xl font-black mb-1">One Hundred</h3>
                            <p className="text-white/80 text-sm font-medium">
                                {isPortuguese ? "O primeiro número de três dígitos!" : "The first three-digit number!"}
                            </p>
                        </div>
                    </div>
                    <Volume2 className="w-8 h-8 text-white/50" />
                </div>
            </div>

            {/* Real World Applications */}
            <section className="grid md:grid-cols-2 gap-6">
                <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                    <h5 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" />
                        {isPortuguese ? "Idades Avançadas" : "Older Ages"}
                    </h5>
                    <button onClick={() => speak("My father is fifty-two years old.")} className="w-full text-left space-y-2 group">
                        <p className="text-lg font-medium text-slate-600 leading-relaxed italic">"My father is <span className="font-black text-indigo-600 underline">fifty-two</span> years old."</p>
                        <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                    </button>
                </div>
                <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-emerald-200 transition-all">
                    <h5 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-500" />
                        {isPortuguese ? "Preços" : "Prices"}
                    </h5>
                    <button onClick={() => speak("That costs ninety-nine dollars.")} className="w-full text-left space-y-2 group">
                        <p className="text-lg font-medium text-slate-600 leading-relaxed italic">"That costs <span className="font-black text-emerald-600 underline">ninety-nine</span> dollars."</p>
                        <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-400" />
                    </button>
                    <div className="mt-3 inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg transform -rotate-2">
                        $99.00
                    </div>
                </div>
            </section>
        </div>
    );
};

const BigNumbers = ({ isPortuguese }: { isPortuguese: boolean }) => {
    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Globe className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "O Universo dos Grandes Números" : "The Universe of Big Numbers"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Você dominou até 100. Agora vamos olhar para o horizonte infinito! Centenas, Milhares, Milhões... A lógica se mantém: é tudo um jogo de padrões. E cuidado: sua conta bancária depende de saber usar a vírgula certa!\""
                                : "\"You mastered up to 100. Now let's look at the infinite horizon! Hundreds, Thousands, Millions... The logic holds: it's all a game of patterns. And be careful: your bank account depends on using the right comma!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* The Hundreds (100-900) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Layout className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "As Centenas" : "The Hundreds"}
                    </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(n => (
                        <button
                            key={n}
                            onClick={() => speak(n === 100 ? "One Hundred" : `${n.toString()[0]} Hundred`)}
                            className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between group"
                        >
                            <span className="font-black text-slate-700 text-xl">{n}</span>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-amber-600 group-hover:text-amber-700">
                                    {n === 100 ? "One" : n.toString()[0]} Hundred
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* The Titans: Big Numbers */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Globe className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Os Titãs (Números Grandes)" : "The Titans (Big Numbers)"}
                    </h4>
                </div>
                <div className="grid gap-4">
                    {[
                        { n: "1,000", w: "One Thousand", p: "Mil", icon: "🏘️" },
                        { n: "1,000,000", w: "One Million", p: "Milhão", icon: "🏙️" },
                        { n: "1,000,000,000", w: "One Billion", p: "Bilhão", icon: "🌎" },
                        { n: "1,000,000,000,000", w: "One Trillion", p: "Trilhão", icon: "🌌" },
                        { n: "1,000,000,000,000,000", w: "One Quadrillion", p: "Quadrilhão", icon: "🪐" },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(item.w)}
                            className="w-full p-6 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4 hover:scale-[1.01] transition-transform shadow-xl"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{item.icon}</span>
                                <div className="text-left">
                                    <h5 className="text-2xl font-black text-rose-400">{item.w}</h5>
                                    <p className="text-slate-400 text-sm">{isPortuguese ? item.p : "Scale"}</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-white/10 rounded-xl font-mono text-lg md:text-xl tracking-widest text-emerald-300 border border-white/5">
                                {item.n}
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* The Architect's Rule: Logic of Big Numbers */}
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-inner">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white"><Wrench className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "A Regra do Arquiteto" : "The Architect's Rule"}
                    </h4>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Rule 1: The Comma Breath */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-300 transition-all">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl mb-4 font-serif text-indigo-600">1</div>
                        <h5 className="font-bold text-slate-800 mb-2">
                            {isPortuguese ? "O Truque da Vírgula" : "The 'Name-Your-Comma' Trick"}
                        </h5>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                            {isPortuguese
                                ? "Em inglês, a vírgula não é silêncio. Ela tem NOME! Ao ver uma vírgula, diga o nome da escala."
                                : "In English, the comma isn't silent. It has a NAME! When you see a comma, say the scale name."}
                        </p>
                        <div className="p-4 bg-slate-900 rounded-xl text-center">
                            <span className="text-white font-mono text-lg">1<span className="text-amber-400 font-bold">,</span>000</span>
                            <div className="text-[10px] text-amber-400 font-black uppercase tracking-widest mt-1">SAY "THOUSAND"</div>
                        </div>
                    </div>

                    {/* Rule 2: No 'E' */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-rose-300 transition-all">
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl mb-4 font-serif text-rose-600">2</div>
                        <h5 className="font-bold text-slate-800 mb-2">
                            {isPortuguese ? "A Conexão Silenciosa" : "The Silent Connection"}
                        </h5>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                            {isPortuguese
                                ? "Cuidado! Não usamos 'E' entre milhares e centenas. Seja direto."
                                : "Watch out! We don't use 'And' between thousands and hundreds. Be direct."}
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 line-through opacity-60">
                                🇧🇷 Mil <span className="font-bold border-b-2 border-rose-400">E</span> quinhentos
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                                🇺🇸 One thousand <span className="w-4 h-4 rounded-full border border-emerald-200 bg-white flex items-center justify-center text-[8px] text-slate-300">∅</span> five hundred
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Assembly Line */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                        {isPortuguese ? "Linha de Montagem: 1,234" : "Assembly Line: 1,234"}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                        <div className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-black text-slate-700 shadow-sm">One</div>
                        <div className="px-4 py-2 bg-amber-100 border-2 border-amber-200 text-amber-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm">Thousand</div>
                        <div className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-black text-slate-700 shadow-sm">Two</div>
                        <div className="px-4 py-2 bg-emerald-100 border-2 border-emerald-200 text-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm">Hundred</div>
                        <div className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-black text-slate-700 shadow-sm">Thirty-four</div>
                    </div>
                </div>
            </div>

            {/* Mental Gymnastics: Compound Numbers */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><ZapIcon className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Ginástica Mental (Números Compostos)" : "Mental Gymnastics (Compound Numbers)"}
                    </h4>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { n: "150", w: "One hundred fifty", h: "100 + 50" },
                        { n: "342", w: "Three hundred forty-two", h: "300 + 42" },
                        { n: "1,500", w: "One thousand five hundred", h: "1000 + 500" },
                        { n: "2,024", w: "Two thousand twenty-four", h: "Year / 2000 + 24" },
                        { n: "10,500", w: "Ten thousand five hundred", h: "10k + 500" },
                        { n: "150,000", w: "One hundred fifty thousand", h: "150k" },
                    ].map(item => (
                        <button
                            key={item.n}
                            onClick={() => speak(item.w)}
                            className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all text-left group"
                        >
                            <span className="block text-3xl font-black text-slate-700 mb-1 group-hover:text-indigo-600 transition-colors">{item.n}</span>
                            <div className="h-0.5 w-8 bg-indigo-100 mb-3 group-hover:w-full transition-all duration-500"></div>
                            <p className="text-sm font-bold text-slate-500 mb-1">{item.w}</p>
                            <p className="text-[10px] font-mono text-indigo-300 bg-indigo-50 inline-block px-2 py-1 rounded-lg">{item.h}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Critical Tip: Comma vs Dot */}
            <div className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><AlertTriangle className="w-32 h-32 text-rose-900" /></div>
                <div className="w-20 h-20 bg-rose-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shrink-0">
                    <span className="text-5xl font-black">,</span>
                </div>
                <div className="relative z-10">
                    <h5 className="font-bold text-rose-900 text-lg mb-2">
                        {isPortuguese ? "Perigo Financeiro: Vírgula vs Ponto!" : "Financial Danger: Comma vs Dot!"}
                    </h5>
                    <p className="text-rose-800 text-sm leading-relaxed mb-4">
                        {isPortuguese
                            ? <>Em inglês, invertemos tudo! Usamos <b>VÍRGULA (,)</b> para separar milhares e <b>PONTO (.)</b> para separar centavos. Se você escrever <b>1.000</b> em um cheque nos EUA, eles vão ler como <b>UM dólar</b>!</>
                            : <>In English, we invert everything! We use <b>COMMA (,)</b> to separate thousands and <b>DOT (.)</b> to separate cents. If you write <b>1.000</b> on a check in the USA, they will read it as <b>ONE dollar</b>!</>
                        }
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white border border-rose-200 rounded-xl text-rose-900 font-mono text-sm">
                            🇺🇸 $1,234.56
                        </div>
                        <div className="px-4 py-2 bg-white border border-rose-200 rounded-xl text-rose-900 font-mono text-sm">
                            🇧🇷 R$ 1.234,56
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const DemonstrativesNew = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const demos = [
        {
            word: 'This',
            ipa: '/ðɪs/',
            type: 'Singular',
            dist: 'Near',
            icon: '👇',
            desc: isPortuguese ? 'Perto + Singular' : 'Near + Singular',
            ex: 'This is my book.',
            trans: 'Este é meu livro.'
        },
        {
            word: 'That',
            ipa: '/ðæt/',
            type: 'Singular',
            dist: 'Far',
            icon: '👉',
            desc: isPortuguese ? 'Longe + Singular' : 'Far + Singular',
            ex: 'That is my car.',
            trans: 'Aquele é meu carro.'
        },
        {
            word: 'These',
            ipa: '/ðiːz/',
            type: 'Plural',
            dist: 'Near',
            icon: '👇👇',
            desc: isPortuguese ? 'Perto + Plural' : 'Near + Plural',
            ex: 'These are my keys.',
            trans: 'Estas são minhas chaves.'
        },
        {
            word: 'Those',
            ipa: '/ðəʊz/',
            type: 'Plural',
            dist: 'Far',
            icon: '👉👉',
            desc: isPortuguese ? 'Longe + Plural' : 'Far + Plural',
            ex: 'Those are stars.',
            trans: 'Aquelas são estrelas.'
        },
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "O 'Laser' do Inglês" : "The 'Laser Pointer' of English"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Imagine que sua mão é um laser. Se você toca no objeto, usa THIS/THESE. Se você precisa apontar longe, usa THAT/THOSE. Não é sobre gramática, é sobre distância física. Vamos calibrar seu GPS mental?\""
                                : "\"Imagine your hand is a laser. If you touch the object, use THIS/THESE. If you need to point far away, use THAT/THOSE. It's not about grammar, it's about physical distance. Let's calibrate your mental GPS?\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* The Logic Matrix */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Layout className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "A Matriz da Distância" : "The Distance Matrix"}
                    </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Header Row */}
                    <div className="hidden md:block"></div>
                    <div className="text-center font-black text-slate-400 uppercase tracking-widest text-xs mb-2 md:mb-0 col-span-2 md:col-span-1 flex justify-around">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">SINGULAR (1)</span>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">PLURAL (2+)</span>
                    </div>

                    {/* Near Row */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-8 bg-white rounded-[2rem] border-l-4 border-indigo-500 shadow-sm col-span-2">
                        <div className="flex items-center gap-2 w-full md:w-32">
                            <span className="text-2xl">👇</span>
                            <div>
                                <span className="block font-bold text-slate-700">{isPortuguese ? "PERTO" : "NEAR"}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest">HERE</span>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                            <button onClick={() => speak("This")} className="p-4 bg-indigo-50 rounded-xl text-center hover:bg-indigo-100 transition-colors border border-indigo-100">
                                <span className="block text-2xl font-black text-indigo-700">THIS</span>
                                <span className="text-[10px] text-indigo-400 italic">/ðɪs/</span>
                            </button>
                            <button onClick={() => speak("These")} className="p-4 bg-indigo-50 rounded-xl text-center hover:bg-indigo-100 transition-colors border border-indigo-100">
                                <span className="block text-2xl font-black text-indigo-700">THESE</span>
                                <span className="text-[10px] text-indigo-400 italic">/ðiːz/</span>
                            </button>
                        </div>
                    </div>

                    {/* Far Row */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-8 bg-white rounded-[2rem] border-l-4 border-amber-500 shadow-sm col-span-2">
                        <div className="flex items-center gap-2 w-full md:w-32">
                            <span className="text-2xl">👉</span>
                            <div>
                                <span className="block font-bold text-slate-700">{isPortuguese ? "LONGE" : "FAR"}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest">THERE</span>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                            <button onClick={() => speak("That")} className="p-4 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition-colors border border-amber-100">
                                <span className="block text-2xl font-black text-amber-700">THAT</span>
                                <span className="text-[10px] text-amber-400 italic">/ðæt/</span>
                            </button>
                            <button onClick={() => speak("Those")} className="p-4 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition-colors border border-amber-100">
                                <span className="block text-2xl font-black text-amber-700">THOSE</span>
                                <span className="text-[10px] text-amber-400 italic">/ðəʊz/</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deep Dive Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {demos.map((d, i) => (
                    <button
                        key={d.word}
                        onClick={() => speak(d.ex)}
                        className="group relative p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-400 hover:shadow-xl transition-all text-left overflow-hidden flex flex-col h-full"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-5 text-4xl group-hover:scale-110 transition-transform">{d.icon}</div>

                        <div className="mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${d.dist === 'Near' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                                {d.dist.toUpperCase()}
                            </span>
                            <h4 className="text-3xl font-black text-slate-800 mb-1">{d.word}</h4>
                            <span className="text-xs text-slate-400 font-mono">{d.ipa}</span>
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-500 mb-4 pb-4 border-b border-slate-50">
                                {d.desc}
                            </p>
                            <p className="text-indigo-600 font-medium text-lg leading-snug mb-1 group-hover:translate-x-1 transition-transform">
                                "{d.ex}"
                            </p>
                            {isPortuguese && (
                                <p className="text-slate-400 text-xs italic">
                                    "{d.trans}"
                                </p>
                            )}
                        </div>
                        <Volume2 className="absolute bottom-6 right-6 w-5 h-5 text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>

            {/* Pronunciation Tip - Zzz Sound */}
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-emerald-500 shadow-sm"><Mic className="w-6 h-6" /></div>
                <div>
                    <h5 className="font-bold text-emerald-800 mb-1">
                        {isPortuguese ? "Dica de Mestre: O Som da Abelha 🐝" : "Pro Tip: The Bee Sound 🐝"}
                    </h5>
                    <p className="text-emerald-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? <>Todos esses 4 começam com <b>TH</b> vibrante! Ponha a língua entre os dentes e faça um som de "ZZZ". Não é som de "D" e nem de "F". É <b>/ð/</b>!</>
                            : <>All these 4 start with a voiced <b>TH</b>! Put your tongue between your teeth and make a "ZZZ" sound. It's not a "D" sound. It's <b>/ð/</b>!</>
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

const CountriesNationalities = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const regionalData = [
        {
            region: isPortuguese ? "Américas" : "Americas",
            icon: "🌎",
            items: [
                { country: "Brazil", nat: "Brazilian", lang: "Portuguese", ipaC: "/brəˈzɪl/", ipaN: "/brəˈzɪl.jən/", flag: "🇧🇷", trans: "Brasil" },
                { country: "USA", nat: "American", lang: "English", ipaC: "/ˌjuː.esˈeɪ/", ipaN: "/əˈmer.ɪ.kən/", flag: "🇺🇸", trans: "EUA" },
                { country: "Canada", nat: "Canadian", lang: "English/French", ipaC: "/ˈkæn.ə.də/", ipaN: "/kəˈneɪ.di.ən/", flag: "🇨🇦", trans: "Canadá" },
                { country: "Mexico", nat: "Mexican", lang: "Spanish", ipaC: "/ˈmek.sɪ.koʊ/", ipaN: "/ˈmek.sɪ.kən/", flag: "🇲🇽", trans: "México" },
                { country: "Argentina", nat: "Argentine", lang: "Spanish", ipaC: "/ˌɑːr.dʒənˈtiː.nə/", ipaN: "/ˈɑːr.dʒən.taɪn/", flag: "🇦🇷", trans: "Argentina" },
                { country: "Colombia", nat: "Colombian", lang: "Spanish", ipaC: "/kəˈlʌm.bi.ə/", ipaN: "/kəˈlʌm.bi.ən/", flag: "🇨🇴", trans: "Colômbia" },
                { country: "Chile", nat: "Chilean", lang: "Spanish", ipaC: "/ˈtʃɪl.i/", ipaN: "/ˈtʃɪl.i.ən/", flag: "🇨🇱", trans: "Chile" },
                { country: "Peru", nat: "Peruvian", lang: "Spanish", ipaC: "/pəˈruː/", ipaN: "/pəˈruː.vi.ən/", flag: "🇵🇪", trans: "Peru" },
            ]
        },
        {
            region: isPortuguese ? "Europa" : "Europe",
            icon: "🇪🇺",
            items: [
                { country: "UK", nat: "British", lang: "English", ipaC: "/ˌjuːˈkeɪ/", ipaN: "/ˈbrɪt.ɪʃ/", flag: "🇬🇧", trans: "Reino Unido" },
                { country: "France", nat: "French", lang: "French", ipaC: "/fræns/", ipaN: "/frentʃ/", flag: "🇫🇷", trans: "França" },
                { country: "Germany", nat: "German", lang: "German", ipaC: "/ˈdʒɜːr.mə.ni/", ipaN: "/ˈdʒɜːr.mən/", flag: "🇩🇪", trans: "Alemanha" },
                { country: "Italy", nat: "Italian", lang: "Italian", ipaC: "/ˈɪt.əl.i/", ipaN: "/ɪˈtæl.jən/", flag: "🇮🇹", trans: "Itália" },
                { country: "Spain", nat: "Spanish", lang: "Spanish", ipaC: "/speɪn/", ipaN: "/ˈspæn.ɪʃ/", flag: "🇪🇸", trans: "Espanha" },
                { country: "Portugal", nat: "Portuguese", lang: "Portuguese", ipaC: "/ˈpɔːr.tʃə.ɡəl/", ipaN: "/ˌpɔːr.tʃʊˈɡiːz/", flag: "🇵🇹", trans: "Portugal" },
                { country: "Ireland", nat: "Irish", lang: "English/Irish", ipaC: "/ˈaɪə.lənd/", ipaN: "/ˈaɪ.rɪʃ/", flag: "🇮🇪", trans: "Irlanda" },
                { country: "Russia", nat: "Russian", lang: "Russian", ipaC: "/ˈrʌʃ.ə/", ipaN: "/ˈrʌʃ.ən/", flag: "🇷🇺", trans: "Rússia" },
                { country: "Netherlands", nat: "Dutch", lang: "Dutch", ipaC: "/ˈneð.ə.ləndz/", ipaN: "/dʌtʃ/", flag: "🇳🇱", trans: "Holanda" },
                { country: "Greece", nat: "Greek", lang: "Greek", ipaC: "/ɡriːs/", ipaN: "/ɡriːk/", flag: "🇬🇷", trans: "Grécia" },
            ]
        },
        {
            region: isPortuguese ? "Ásia" : "Asia",
            icon: "🌏",
            items: [
                { country: "China", nat: "Chinese", lang: "Mandarin", ipaC: "/ˈtʃaɪ.nə/", ipaN: "/ˌtʃaɪˈniːz/", flag: "🇨🇳", trans: "China" },
                { country: "Japan", nat: "Japanese", lang: "Japanese", ipaC: "/dʒəˈpæn/", ipaN: "/ˌdʒæp.ənˈiːz/", flag: "🇯🇵", trans: "Japão" },
                { country: "South Korea", nat: "Korean", lang: "Korean", ipaC: "/ˌsaʊθ kəˈriː.ə/", ipaN: "/kəˈriː.ən/", flag: "🇰🇷", trans: "Coreia do Sul" },
                { country: "India", nat: "Indian", lang: "Hindi/English", ipaC: "/ˈɪn.di.ə/", ipaN: "/ˈɪn.di.ən/", flag: "🇮🇳", trans: "Índia" },
                { country: "Thailand", nat: "Thai", lang: "Thai", ipaC: "/ˈtaɪ.lænd/", ipaN: "/taɪ/", flag: "🇹🇭", trans: "Tailândia" },
                { country: "Vietnam", nat: "Vietnamese", lang: "Vietnamese", ipaC: "/ˌvjet.ˈnæm/", ipaN: "/ˌvjet.nəˈmiːz/", flag: "🇻🇳", trans: "Vietnã" },
                { country: "Israel", nat: "Israeli", lang: "Hebrew", ipaC: "/ˈɪz.reɪl/", ipaN: "/ɪzˈreɪ.li/", flag: "🇮🇱", trans: "Israel" },
                { country: "Turkey", nat: "Turkish", lang: "Turkish", ipaC: "/ˈtɜːr.ki/", ipaN: "/ˈtɜːr.kɪʃ/", flag: "🇹🇷", trans: "Turquia" },
            ]
        },
        {
            region: isPortuguese ? "África & Oceania" : "Africa & Oceania",
            icon: "🌍",
            items: [
                { country: "Australia", nat: "Australian", lang: "English", ipaC: "/ɒˈstreɪ.li.ə/", ipaN: "/ɒˈstreɪ.li.ən/", flag: "🇦🇺", trans: "Austrália" },
                { country: "New Zealand", nat: "New Zealander", lang: "English", ipaC: "/ˌnjuː ˈziː.lənd/", ipaN: "/ˌnjuː ˈziː.lən.dər/", flag: "🇳🇿", trans: "Nova Zelândia" },
                { country: "South Africa", nat: "South African", lang: "Multilingual", ipaC: "/ˌsaʊθ ˈæf.rɪ.kə/", ipaN: "/ˌsaʊθ ˈæf.rɪ.kən/", flag: "🇿🇦", trans: "África do Sul" },
                { country: "Egypt", nat: "Egyptian", lang: "Arabic", ipaC: "/ˈiː.dʒɪpt/", ipaN: "/iˈdʒɪp.ʃən/", flag: "🇪🇬", trans: "Egito" },
                { country: "Nigeria", nat: "Nigerian", lang: "English", ipaC: "/naɪˈdʒɪə.ri.ə/", ipaN: "/naɪˈdʒɪə.ri.ən/", flag: "🇳🇬", trans: "Nigéria" },
                { country: "Morocco", nat: "Moroccan", lang: "Arabic", ipaC: "/məˈrɒk.əʊ/", ipaN: "/məˈrɒk.ən/", flag: "🇲🇦", trans: "Marrocos" },
            ]
        }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Globe className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Matthew's Global Tour" : "Matthew's Global Tour"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"De onde você é? Essa é a chave para abrir portas em qualquer conversa internacional. Hoje vamos mapear o mundo. Preste atenção nos sufixos: eles revelam padrões! Ah, e lembre-se: nacionalidades são SEMPRE com letra maiúscula!\""
                                : "\"Where are you from? That's the key to opening doors in any international conversation. Today we map the world. Pay attention to the suffixes: they reveal patterns! Oh, and remember: nationalities are ALWAYS capitalized!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Grammar Insight Card */}
            <section className="bg-white p-8 rounded-[2.5rem] border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Compass className="w-24 h-24 text-indigo-900" /></div>
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                    {isPortuguese ? "Como se apresentar" : "How to introduce yourself"}
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 group hover:shadow-md transition-all">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">{isPortuguese ? "Usando o País" : "Using the Country"}</span>
                        <p className="text-xl font-black text-indigo-900 mb-2">"I am from <span className="underline">Brazil</span>."</p>
                        <p className="text-[10px] text-indigo-400 italic">{isPortuguese ? "Use 'from' para indicar a origem (substantivo)." : "Use 'from' to indicate origin (noun)."}</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:shadow-md transition-all">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block">{isPortuguese ? "Usando a Nacionalidade" : "Using the Nationality"}</span>
                        <p className="text-xl font-black text-emerald-900 mb-2">"I am <span className="underline">Brazilian</span>."</p>
                        <p className="text-[10px] text-emerald-400 italic">{isPortuguese ? "Nacionalidade é um adjetivo. NÃO use 'from' aqui." : "Nationality is an adjective. DO NOT use 'from' here."}</p>
                    </div>
                </div>
            </section>

            {/* Main Content Sections by Region */}
            {regionalData.map((reg, idx) => (
                <section key={idx} className="space-y-6 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-center gap-3 pl-2">
                        <span className="text-2xl drop-shadow-sm">{reg.icon}</span>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight">{reg.region}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {reg.items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => speak(`I am from ${item.country}. I am ${item.nat}.`)}
                                className="group p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{item.flag}</span>
                                    <Volume2 className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-black text-slate-800 text-lg leading-none group-hover:text-indigo-600 transition-colors">{item.country}</h5>
                                        <div className="flex flex-col mt-1">
                                            <span className="text-[9px] font-mono text-slate-400">{item.ipaC}</span>
                                            {isPortuguese && <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">({item.trans})</span>}
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-50">
                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">{isPortuguese ? "Nacionalidade" : "Nationality"}</span>
                                        <p className="font-bold text-slate-600 text-sm">{item.nat}</p>
                                        <span className="text-[9px] font-mono text-slate-300">{item.ipaN}</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Languages className="w-3 h-3 text-emerald-400" />
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{item.lang}</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MapPin className="w-16 h-16 text-indigo-900" />
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            ))}

            {/* Pro Tip Section */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Dicas Pedagógicas" : "Teacher's Pro Tips"}
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <Type className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <h5 className="font-bold text-amber-900 mb-2">
                                {isPortuguese ? "Maiúsculas Obrigatórias" : "Mandatory Capitals"}
                            </h5>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                {isPortuguese
                                    ? <>Diferente do português, em inglês <strong>Nacionalidades</strong> e <strong>Idiomas</strong> são sempre escritos com letra maiúscula. Escreva <b>"Brazilian"</b> e <b>"English"</b>, nunca <s>"brazilian"</s>.</>
                                    : <>Unlike in some languages, in English <strong>Nationalities</strong> and <strong>Languages</strong> are always capitalized. Write <b>"Brazilian"</b> and <b>"English"</b>, never lowercase.</>
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <Compass className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <h5 className="font-bold text-amber-900 mb-2">
                                {isPortuguese ? "O Artigo 'THE'" : "The 'THE' Article"}
                            </h5>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                {isPortuguese
                                    ? <>Geralmente não usamos "The" antes de nomes de países (<s>The Brazil</s>). Mas usamos se o país for uma coleção de estados ou ilhas: <b>The USA</b>, <b>The UK</b>, <b>The Bahamas</b>.</>
                                    : <>We usually don't use "The" before country names (<s>The Brazil</s>). However, we do use it if the country is a collection of states or islands: <b>The USA</b>, <b>The UK</b>, <b>The Bahamas</b>.</>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Practice */}
            <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden text-center shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                <h5 className="text-3xl font-serif-display mb-4 relative z-10">
                    {isPortuguese ? "Hora de Aplicar!" : "Time to Apply!"}
                </h5>
                <p className="text-slate-400 text-sm mb-12 max-w-md mx-auto relative z-10 leading-relaxed italic">
                    {isPortuguese
                        ? "\"Imagine que você está em um aeroporto internacional. Clique na pergunta para ouvir e tente responder usando seu país e nacionalidade!\""
                        : "\"Imagine you are at an international airport. Click the question to listen and try to answer using your country and nationality!\""}
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-8 relative z-10">
                    <button
                        onClick={() => speak("Where are you from?")}
                        className="p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/20 transition-all group"
                    >
                        <QuestionIcon className="w-8 h-8 text-indigo-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <div className="font-black text-2xl mb-1 italic">"Where are you from?"</div>
                        <div className="text-[10px] font-mono text-indigo-300">/wer ɑːr juː frɒm/</div>
                        {isPortuguese && <div className="text-[9px] mt-2 text-slate-400 font-bold uppercase">(De onde você é?)</div>}
                    </button>

                    <div className="flex items-center text-4xl opacity-20 hidden md:block">→</div>

                    <div className="p-8 bg-white/5 rounded-3xl border-2 border-white/10 border-dashed flex flex-col justify-center gap-4">
                        <div className="text-left">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Option A:</span>
                            <div className="text-xl font-bold text-slate-300 italic">"I am from <span className="text-indigo-400 underline decoration-indigo-400/30">[Country]</span>."</div>
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Option B:</span>
                            <div className="text-xl font-bold text-slate-300 italic">"I am <span className="text-emerald-400 underline decoration-emerald-400/30">[Nationality]</span>."</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FamilyVocabulary = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const familyGroups = [
        {
            title: isPortuguese ? "A Base (Nuclear)" : "The Core (Nuclear)",
            color: "indigo",
            icon: <Home className="w-5 h-5" />,
            members: [
                { word: "Father", ipa: "/ˈfɑːðər/", trans: "Pai", icon: "👨", ex: "My father is my hero." },
                { word: "Mother", ipa: "/ˈmʌðər/", trans: "Mãe", icon: "👩", ex: "My mother is beautiful." },
                { word: "Son", ipa: "/sʌn/", trans: "Filho", icon: "👦", ex: "He is my son." },
                { word: "Daughter", ipa: "/ˈdɔːtər/", trans: "Filha", icon: "👧", ex: "She is my daughter." },
                { word: "Brother", ipa: "/ˈbrʌðər/", trans: "Irmão", icon: "👱‍♂️", ex: "I have one brother." },
                { word: "Sister", ipa: "/ˈsɪstər/", trans: "Irmã", icon: "👱‍♀️", ex: "My sister is funny." },
            ]
        },
        {
            title: isPortuguese ? "Os Parentes (Extended)" : "The Relatives (Extended)",
            color: "emerald",
            icon: <Users className="w-5 h-5" />,
            members: [
                { word: "Grandfather", ipa: "/ˈɡrænˌfɑːðər/", trans: "Avô", icon: "👴", ex: "Grandpa loves chess." },
                { word: "Grandmother", ipa: "/ˈɡrænˌmʌðər/", trans: "Avó", icon: "👵", ex: "Grandma cooks well." },
                { word: "Uncle", ipa: "/ˈʌŋkəl/", trans: "Tio", icon: "👨‍🦰", ex: "My uncle is cool." },
                { word: "Aunt", ipa: "/ænt/", trans: "Tia", icon: "👩‍🦰", ex: "My aunt lives in NY." },
                { word: "Cousin", ipa: "/ˈkʌzən/", trans: "Primo(a)", icon: "👯", ex: "We are cousins." },
                { word: "Nephew", ipa: "/ˈnɛfjuː/", trans: "Sobrinho", icon: "🧒", ex: "He is my nephew." },
                { word: "Niece", ipa: "/niːs/", trans: "Sobrinha", icon: "👧", ex: "She is my niece." },
            ]
        },
        {
            title: isPortuguese ? "Pela Lei (In-Laws)" : "By Law (In-Laws)",
            color: "rose",
            icon: <Scale className="w-5 h-5" />,
            members: [
                { word: "Father-in-law", ipa: "/ˈfɑːðər ɪn lɔː/", trans: "Sogro", icon: "👴", ex: "My father-in-law is nice." },
                { word: "Mother-in-law", ipa: "/ˈmʌðər ɪn lɔː/", trans: "Sogra", icon: "👵", ex: "My mother-in-law helps us." },
                { word: "Brother-in-law", ipa: "/ˈbrʌðər ɪn lɔː/", trans: "Cunhado", icon: "🤵", ex: "He is my brother-in-law." },
                { word: "Sister-in-law", ipa: "/ˈsɪstər ɪn lɔː/", trans: "Cunhada", icon: "👰", ex: "She is my sister-in-law." },
            ]
        }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><UserPlus className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "A Árvore da Vida" : "The Tree of Life"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Cuidado com os falsos amigos! Em inglês, 'Parents' NÃO é parentes (isso seria 'Relatives'). 'Parents' são apenas seu pai e sua mãe. Hoje vamos mapear toda sua família, do núcleo até aqueles que a lei trouxe para sua vida (the in-laws)!\""
                                : "\"Beware of false friends! In English, 'Parents' are NOT 'parentes' (that would be 'Relatives'). 'Parents' are just your father and mother. Today we'll map out your entire family, from the core to those the law brought into your life (the in-laws)!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Vocabulary Groups */}
            <div className="space-y-10">
                {familyGroups.map((group, idx) => (
                    <section key={idx} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg text-${group.color}-600 bg-${group.color}-50`}>
                                {group.icon}
                            </div>
                            <h4 className="text-2xl font-bold text-slate-800">{group.title}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.members.map((m, i) => (
                                <button
                                    key={i}
                                    onClick={() => speak(m.word)}
                                    className={`group relative p-6 rounded-3xl border border-slate-100 hover:border-${group.color}-200 bg-white hover:shadow-lg transition-all text-left flex items-start gap-4`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-${group.color}-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                        {m.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h5 className="text-lg font-bold text-slate-700 mb-1">{m.word}</h5>
                                            <Volume2 className={`w-4 h-4 text-slate-300 group-hover:text-${group.color}-500`} />
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{m.ipa}</span>
                                            {isPortuguese && <span className={`text-[10px] font-bold text-${group.color}-400 uppercase tracking-wide`}>{m.trans}</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 italic border-l-2 border-slate-100 pl-2">
                                            "{m.ex}"
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Pro Tip: Parents vs Relatives */}
            <div className="bg-amber-50 rounded-[2.5rem] p-10 relative border border-amber-100 mt-8">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {isPortuguese ? "Dica de Mestre" : "Master Tip"}
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-3xl">🚫</div>
                    <div>
                        <h5 className="font-bold text-amber-900 mb-2 text-lg">
                            {isPortuguese ? "A Grande Confusão: Parents" : "The Big Confusion: Parents"}
                        </h5>
                        <p className="text-sm text-amber-800 leading-relaxed mb-4">
                            {isPortuguese
                                ? <>Nunca use "Parents" para dizer "Parentes".<br />
                                    • <strong>Parents</strong> = Pai e Mãe (Pais).<br />
                                    • <strong>Relatives</strong> = Tios, Primos, Avós (Parentes).</>
                                : <>Never use "Parents" to say "Parentes" (Relatives).<br />
                                    • <strong>Parents</strong> = Father and Mother.<br />
                                    • <strong>Relatives</strong> = Uncles, Cousins, Grandparents.</>
                            }
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => speak("I love my parents.")} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-amber-700 shadow-sm hover:shadow-md transition-all">
                                🔊 "I love my parents."
                            </button>
                            <button onClick={() => speak("I have many relatives.")} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-amber-700 shadow-sm hover:shadow-md transition-all">
                                🔊 "I have many relatives."
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cultural Note: Suffixes */}
            <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100">
                <h5 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {isPortuguese ? "Matemática da Família" : "Family Math"}
                </h5>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <span className="font-black text-indigo-500">GRAND-</span>
                        <p className="text-slate-600 mt-1">
                            {isPortuguese ? "Adiciona 1 geração (Avô/Avó). Grandfather, Grandmother." : "Adds 1 generation up. Grandfather, Grandmother."}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <span className="font-black text-rose-500">-IN-LAW</span>
                        <p className="text-slate-600 mt-1">
                            {isPortuguese ? "Vínculo por lei (casamento). Mother-in-law (Sogra)." : "Bond by law (marriage). Mother-in-law."}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <span className="font-black text-emerald-500">STEP-</span>
                        <p className="text-slate-600 mt-1">
                            {isPortuguese ? "Vínculo por novo casamento. Stepmother (Madrasta)." : "Bond by remarriage. Stepmother."}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <span className="font-black text-amber-500">GOD-</span>
                        <p className="text-slate-600 mt-1">
                            {isPortuguese ? "Vínculo religioso/espiritual. Godfather (Padrinho)." : "Religious bond. Godfather."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VerbToHave = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [subject, setSubject] = useState('I');

    // Configurações dos sujeitos
    const subjects = [
        { id: 'I', label: 'I', form: 'have', color: 'blue', icon: '🙋' },
        { id: 'You', label: 'You', form: 'have', color: 'blue', icon: '🫵' },
        { id: 'He', label: 'He', form: 'has', color: 'rose', icon: '👨' },
        { id: 'She', label: 'She', form: 'has', color: 'rose', icon: '👩' },
        { id: 'It', label: 'It', form: 'has', color: 'rose', icon: '🤖' },
        { id: 'We', label: 'We', form: 'have', color: 'blue', icon: '👥' },
        { id: 'They', label: 'They', form: 'have', color: 'blue', icon: '👯' },
    ];

    const currentSubject = subjects.find(s => s.id === subject) || subjects[0];
    const isHas = currentSubject.form === 'has';

    const items = [
        { name: 'a car', icon: '🚗', trans: 'um carro' },
        { name: 'a dog', icon: '🐕', trans: 'um cachorro' },
        { name: 'an idea', icon: '💡', trans: 'uma ideia' },
        { name: 'money', icon: '💵', trans: 'dinheiro' }
    ];

    const [activeItem, setActiveItem] = useState(0);
    const item = items[activeItem];

    const sentence = `${currentSubject.label} ${currentSubject.form} ${item.name}.`;
    const translation = isPortuguese
        ? `${currentSubject.icon} ${currentSubject.label === 'I' ? 'Eu tenho' : currentSubject.label === 'You' ? 'Você tem' : currentSubject.label === 'He' ? 'Ele tem' : currentSubject.label === 'She' ? 'Ela tem' : currentSubject.label === 'It' ? 'Ele/Ela (coisa/animal) tem' : currentSubject.label === 'We' ? 'Nós temos' : 'Eles têm'} ${item.trans}.`
        : '';

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="bg-indigo-900 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase className="w-64 h-64" /></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-indigo-400">🎒</div>
                    <div className="flex-1">
                        <h3 className="text-3xl font-serif-display mb-3">
                            {isPortuguese ? "O Verbo 'Ter' (Posse)" : "The Verb To Have (Possession)"}
                        </h3>
                        <p className="text-indigo-100 text-lg leading-relaxed">
                            {isPortuguese
                                ? "Em inglês, usamos 'HAVE' para falar das coisas que possuímos. Imagine que cada pessoa tem uma mochila. O que tem dentro dela?"
                                : "In English, we use 'HAVE' to talk about things we own. Imagine everyone has a backpack. What is inside it?"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Conjugator */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-6">Select a Person</h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {subjects.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setSubject(s.id); speak(`${s.label} ${s.form} ${item.name}`); }}
                                className={`
                                    p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                                    ${subject === s.id
                                        ? `bg-${s.color}-50 border-${s.color}-400 text-${s.color}-700 scale-105 shadow-md`
                                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-300'
                                    }
                                `}
                            >
                                <span className="text-3xl">{s.icon}</span>
                                <span className="font-bold">{s.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-6">Change Item</h4>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {items.map((it, idx) => (
                                <button
                                    key={it.name}
                                    onClick={() => setActiveItem(idx)}
                                    className={`
                                        flex-shrink-0 px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all
                                        ${activeItem === idx ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200'}
                                    `}
                                >
                                    <span>{it.icon}</span> {it.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visual Output */}
                <div className={`
                    rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative transition-all duration-500
                    ${isHas ? 'bg-rose-50 border-2 border-rose-100' : 'bg-blue-50 border-2 border-blue-100'}
                `}>
                    <div className="text-center space-y-8 relative z-10">

                        {/* The Big Form */}
                        <div>
                            <span className={`
                                inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4
                                ${isHas ? 'bg-rose-200 text-rose-700' : 'bg-blue-200 text-blue-700'}
                            `}>
                                {isHas ? 'Third Person (Alert!)' : 'Standard Form'}
                            </span>
                            <div className="flex items-center justify-center gap-4 text-7xl mb-2">
                                <span className="opacity-50 grayscale">{currentSubject.icon}</span>
                                <ArrowRight className={`w-8 h-8 ${isHas ? 'text-rose-300' : 'text-blue-300'}`} />
                                <span>{item.icon}</span>
                            </div>
                        </div>

                        {/* Sentence */}
                        <div
                            className="cursor-pointer group"
                            onClick={() => speak(sentence)}
                        >
                            <h2 className={`text-4xl md:text-5xl font-black mb-2 transition-colors ${isHas ? 'text-rose-600' : 'text-blue-600'}`}>
                                {currentSubject.form}
                            </h2>
                            <p className="text-2xl text-slate-700 font-medium group-hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                                {sentence}
                                <Volume2 className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                            </p>
                            {isPortuguese && <p className="text-slate-400 mt-2 text-sm font-medium">{translation}</p>}
                        </div>

                        {/* Alert for Has */}
                        {isHas && (
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-rose-200 text-rose-600 text-sm font-bold flex items-center gap-3 max-w-xs mx-auto animate-bounce-short">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                {isPortuguese ? "Cuidado! He/She/It muda para HAS!" : "Watch out! He/She/It changes to HAS!"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const PossessivesLesson = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [activeTab, setActiveTab] = useState<'adjectives' | 'pronouns'>('adjectives');

    const adjectives = [
        { id: 'my', word: 'My', example: 'My car', trans: 'Meu carro', icon: '🚗' },
        { id: 'your', word: 'Your', example: 'Your dog', trans: 'Seu cachorro', icon: '🐕' },
        { id: 'his', word: 'His', example: 'His book', trans: 'O livro dele', icon: '📘' },
        { id: 'her', word: 'Her', example: 'Her bag', trans: 'A bolsa dela', icon: '👜' },
        { id: 'its', word: 'Its', example: 'Its food', trans: 'A comida dele(a)', icon: '🦴' },
        { id: 'our', word: 'Our', example: 'Our home', trans: 'Nossa casa', icon: '🏠' },
        { id: 'their', word: 'Their', example: 'Their idea', trans: 'A ideia deles', icon: '💡' }
    ];

    const pronouns = [
        { id: 'mine', word: 'Mine', example: "It's mine", trans: 'É meu', icon: '🙋‍♂️' },
        { id: 'yours', word: 'Yours', example: "It's yours", trans: 'É seu', icon: '🫵' },
        { id: 'his', word: 'His', example: "It's his", trans: 'É dele', icon: '👨' },
        { id: 'hers', word: 'Hers', example: "It's hers", trans: 'É dela', icon: '👩' },
        { id: 'ours', word: 'Ours', example: "It's ours", trans: 'É nosso', icon: '👥' },
        { id: 'theirs', word: 'Theirs', example: "It's theirs", trans: 'É deles', icon: '👯' }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Context Header */}
            <div className="bg-indigo-900 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Lock className="w-64 h-64" /></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-rose-400">🔑</div>
                    <div className="flex-1">
                        <h3 className="text-3xl font-serif-display mb-3">
                            {isPortuguese ? "O Caso Possessivo" : "The Possessive Case"}
                        </h3>
                        <p className="text-indigo-100 text-lg leading-relaxed">
                            {isPortuguese
                                ? "Temos duas formas de dizer que algo é de alguém: Adjetivos (Meu carro) e Pronomes (É meu). Vamos aprender a diferença!"
                                : "We have two ways to say something belongs to someone: Adjectives (My car) and Pronouns (It's mine). Let's learn the difference!"}
                        </p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-2 bg-indigo-950/50 rounded-2xl mt-8 max-w-lg mx-auto">
                    <button
                        onClick={() => setActiveTab('adjectives')}
                        className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'adjectives' ? 'bg-white text-indigo-900 shadow-lg' : 'text-indigo-300 hover:text-white'}`}
                    >
                        Adjectives (My)
                    </button>
                    <button
                        onClick={() => setActiveTab('pronouns')}
                        className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'pronouns' ? 'bg-white text-indigo-900 shadow-lg' : 'text-indigo-300 hover:text-white'}`}
                    >
                        Pronouns (Mine)
                    </button>
                </div>
            </div>

            {/* The Golden Rule */}
            <div className={`
                p-8 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden
                ${activeTab === 'adjectives' ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200'}
            `}>
                <div className="absolute top-4 right-4 text-6xl opacity-10">
                    {activeTab === 'adjectives' ? '🤝' : '🧘'}
                </div>

                <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${activeTab === 'adjectives' ? 'text-blue-500' : 'text-emerald-500'}`}>Teacher's Rule</h4>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shrink-0
                         ${activeTab === 'adjectives' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'}
                    `}>?</div>
                    <div>
                        <h5 className={`text-2xl font-bold mb-2 ${activeTab === 'adjectives' ? 'text-blue-900' : 'text-emerald-900'}`}>
                            {activeTab === 'adjectives'
                                ? (isPortuguese ? "Eles são tímidos... precisam de um amigo!" : "They are shy... they need a friend!")
                                : (isPortuguese ? "Eles são fortes! Ficam sozinhos." : "They are strong! They stand alone.")
                            }
                        </h5>
                        <p className={`text-lg font-medium leading-relaxed ${activeTab === 'adjectives' ? 'text-blue-700' : 'text-emerald-700'}`}>
                            {activeTab === 'adjectives' ? (
                                <span>
                                    Use Adjectives <b>BEFORE</b> the noun. <br />
                                    Example: <i>This is <u>MY</u> <b>Car</b>.</i>
                                </span>
                            ) : (
                                <span>
                                    Use Pronouns <b>WITHOUT</b> a noun. <br />
                                    Example: <i>This car is <u>MINE</u>.</i> (No word after it!)
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* List of Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === 'adjectives' ? adjectives : pronouns).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => speak(item.example)}
                        className={`
                            group p-6 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 hover:shadow-lg
                            ${activeTab === 'adjectives'
                                ? 'bg-white border-blue-50 hover:border-blue-200'
                                : 'bg-white border-emerald-50 hover:border-emerald-200'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`
                                text-4xl p-3 rounded-2xl
                                ${activeTab === 'adjectives' ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-emerald-50 group-hover:bg-emerald-100'}
                            `}>{item.icon}</span>
                            <Volume2 className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                        </div>

                        <div className="mb-2">
                            <span className={`text-xs font-black uppercase tracking-widest ${activeTab === 'adjectives' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                {item.word}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-700 mb-1 group-hover:text-indigo-700">
                            {item.example}
                        </h3>
                        {isPortuguese && <p className="text-sm text-slate-400 font-medium">{item.trans}</p>}
                    </button>
                ))}
            </div>
        </div>
    );
};
const GenitiveCase = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const examples = [
        {
            owner: 'John',
            thing: 'Car',
            phrase: "John's Car",
            ipa: "/dʒɒnz kɑːr/",
            trans: "O carro do John",
            icon: '🚗',
            color: 'indigo'
        },
        {
            owner: 'The Teacher',
            thing: 'Book',
            phrase: "The Teacher's Book",
            ipa: "/ðə ˈtiːtʃərz bʊk/",
            trans: "O livro do professor",
            icon: '📖',
            color: 'emerald'
        },
        {
            owner: 'My Mom',
            thing: 'House',
            phrase: "My Mom's House",
            ipa: "/maɪ mɒmz haʊs/",
            trans: "A casa da minha mãe",
            icon: '🏠',
            color: 'rose'
        },
        {
            owner: 'The Dog',
            thing: 'Bone',
            phrase: "The Dog's Bone",
            ipa: "/ðə dɒɡz boʊn/",
            trans: "O osso do cachorro",
            icon: '🦴',
            color: 'amber'
        }
    ];

    const rules = [
        {
            title: isPortuguese ? "Regra 1: Singular ('s)" : "Rule 1: Singular ('s)",
            desc: isPortuguese ? "Para uma pessoa ou animal, adicione 's." : "For one person or animal, add 's.",
            ex: "Sarah's phone",
            wrong: "The phone of Sarah",
            icon: '👤'
        },
        {
            title: isPortuguese ? "Regra 2: Plural com S (')" : "Rule 2: Plural ending in S (')",
            desc: isPortuguese ? "Se a palavra já termina em S no plural, adicione APENAS o apóstrofo (')." : "If the word ends in S (plural), just add the apostrophe (').",
            ex: "My parents' house",
            wrong: "My parents's house",
            icon: '👥'
        },
        {
            title: isPortuguese ? "Regra 3: Plural Irregular ('s)" : "Rule 3: Irregular Plural ('s)",
            desc: isPortuguese ? "Se o plural NÃO termina em S (como Children), adicione 's." : "If plural does NOT end in S (like Children), add 's.",
            ex: "The children's toys",
            wrong: "The childrens' toys",
            icon: '🧸'
        }
    ];

    return (
        <div className="space-y-16 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Key className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "O Apóstrofo Mágico" : "The Magic Apostrophe"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Em português, usamos muito 'de/do/da' (O carro do João). Em inglês, isso soa robótico! Nós amamos usar o apóstrofo 'S ('s) para mostrar posse. É como se colássemos o dono no objeto. Vamos aprender a usar esse superpoder sem errar!\""
                                : "\"In many languages, we use 'of' a lot (The car of John). In English, that sounds robotic! We love using the apostrophe 'S ('s) to show ownership. It's like gluing the owner to the object. Let's learn to use this superpower perfectly!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Formula */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400"></div>
                <div className="flex items-center gap-2 text-3xl md:text-5xl font-black mb-6 flex-wrap justify-center z-10">
                    <div className="flex flex-col items-center">
                        <span className="text-indigo-600">Owner</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-2">Dono</span>
                    </div>
                    <span className="text-amber-500 mx-2">+</span>
                    <div className="relative">
                        <span className="bg-slate-800 text-white px-6 py-3 rounded-2xl border-b-4 border-slate-600 shadow-xl inline-block transform -rotate-6">'s</span>
                        <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-bounce">Glue!</div>
                    </div>
                    <span className="text-amber-500 mx-2">+</span>
                    <div className="flex flex-col items-center">
                        <span className="text-emerald-500">Thing</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-2">Coisa</span>
                    </div>
                </div>
                <p className="text-slate-500 text-sm text-center max-w-md bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
                    {isPortuguese
                        ? "Esqueça 'Of'. Pense: [Dono] [Apóstrofo] [Coisa]. Simples assim!"
                        : "Forget 'Of'. Think: [Owner] [Apostrophe] [Thing]. Simple as that!"}
                </p>
            </section>

            {/* Interactive Examples */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examples.map((ex, i) => (
                    <button
                        key={i}
                        onClick={() => speak(ex.phrase)}
                        className={`group relative p-6 rounded-3xl border border-slate-100 bg-white hover:border-${ex.color}-200 hover:shadow-lg transition-all text-left overflow-hidden`}
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${ex.color}-50 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>

                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                                {ex.icon}
                            </div>
                            <div>
                                <h4 className={`text-xl font-black text-slate-800 group-hover:text-${ex.color}-600 transition-colors mb-2`}>{ex.phrase}</h4>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded self-start">{ex.ipa}</span>
                                    {isPortuguese && <span className={`text-[10px] font-bold text-${ex.color}-400 uppercase tracking-wide`}>{ex.trans}</span>}
                                </div>
                            </div>
                        </div>
                        <Volume2 className={`absolute bottom-6 right-6 w-5 h-5 text-slate-200 group-hover:text-${ex.color}-400 transition-colors`} />
                    </button>
                ))}
            </section>

            {/* The Rules Breakdown */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Scale className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "As 3 Regras de Ouro" : "The 3 Golden Rules"}
                    </h4>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {rules.map((rule, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col h-full shadow-sm hover:border-indigo-200 transition-all hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center font-black text-indigo-600">{idx + 1}</div>
                                <span className="text-2xl">{rule.icon}</span>
                            </div>

                            <h5 className="font-bold text-slate-800 mb-2 min-h-[3rem] text-lg leading-tight">{rule.title}</h5>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">{rule.desc}</p>

                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-sm font-bold text-emerald-700">{rule.ex}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-50">
                                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                    <span className="text-[10px] font-medium text-rose-700 line-through">{rule.wrong}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Master Tip: The 'Of' Trap */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 relative border border-rose-100 overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-100 rounded-full opacity-50 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-sm shrink-0 border-4 border-rose-100 animate-pulse">🚫</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Stop!</span>
                            <h5 className="font-bold text-rose-900 uppercase tracking-wide text-sm">
                                {isPortuguese ? "A Armadilha do 'OF'" : "The 'OF' Trap"}
                            </h5>
                        </div>

                        <p className="text-sm text-rose-800 leading-relaxed mb-6 font-medium">
                            {isPortuguese
                                ? "Muitos brasileiros traduzem 'O carro do meu pai' como 'The car OF my father'. Gramaticalmente não é proibido, mas soa arcaico e estranho. Nativos usam 'My father's car' 99% das vezes para pessoas!"
                                : "Meny students translate 'The car of my father' directly. While not forbidden, it sounds archaic and strange. Natives use 'My father's car' 99% of the time for people!"}
                        </p>

                        <div className="flex gap-4">
                            <button onClick={() => speak("My father's car")} className="px-5 py-3 bg-white text-rose-600 rounded-xl text-xs font-bold hover:shadow-md transition-all flex items-center gap-2 border border-rose-100">
                                <CheckCircle2 className="w-4 h-4" />
                                {isPortuguese ? "Assim Sim: My Father's Car" : "Do this: My Father's Car"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Object Exception */}
            <div className="bg-slate-800 text-slate-300 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Box className="w-40 h-40" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                        <h5 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <Zap className="w-4 h-4" />
                            {isPortuguese ? "A Exceção das Coisas" : "The Object Exception"}
                        </h5>
                        <p className="text-white text-sm leading-relaxed mb-4">
                            {isPortuguese
                                ? "Cuidado! Nós usamos 'S para PESSOAS e ANIMAIS. Para COISAS inanimadas, a gente prefere usar o 'OF' ou substantivo composto."
                                : "Careful! We use 'S for PEOPLE and ANIMALS. For inanimate THINGS, we prefer 'OF' or compound nouns."}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-700/50 p-3 rounded-lg flex items-center gap-3 border border-slate-600">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>The leg <strong>of</strong> the table</span>
                            </div>
                            <div className="bg-slate-700/50 p-3 rounded-lg flex items-center gap-3 border border-slate-600">
                                <X className="w-4 h-4 text-rose-400" />
                                <span className="line-through decoration-rose-500/50">The table's leg</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-5xl opacity-80">📦</div>
                </div>
            </div>

            {/* Final Exercise */}
            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] p-10 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 p-4 opacity-10"><Brain className="w-32 h-32 text-indigo-900" /></div>
                <div className="relative z-10">
                    <h5 className="font-black text-indigo-900 uppercase text-xs tracking-widest mb-4">
                        {isPortuguese ? "Seu Turno" : "Your Turn"}
                    </h5>
                    <p className="text-indigo-800 text-lg font-serif-display mb-6">
                        "The Phone of Mary" ➝ <span className="font-black text-indigo-600 underline decoration-wavy decoration-indigo-300">Mary's Phone</span>
                    </p>
                    <button onClick={() => speak("Mary's Phone")} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200/50 transition-all">
                        <Mic className="w-4 h-4" />
                        {isPortuguese ? "Praticar Agora" : "Practice Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};
const HouseFurniture = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [activeTab, setActiveTab] = useState(0);

    const activeRooms = [
        {
            name: 'Structure',
            trans: 'Estrutura',
            icon: <Home className="w-5 h-5" />,
            color: 'indigo',
            desc: isPortuguese ? "Partes fundamentais da casa." : "Fundamental parts of the house.",
            items: [
                { w: 'Door', ipa: '/dɔːr/', trans: 'Porta', icon: '🚪' },
                { w: 'Window', ipa: '/ˈwɪndoʊ/', trans: 'Janela', icon: '🪟' },
                { w: 'Garden', ipa: '/ˈɡɑːrdn/', trans: 'Jardim', icon: '🏡' },
                { w: 'Garage', ipa: '/ɡəˈrɑːʒ/', trans: 'Garagem', icon: '🚗' },
                { w: 'Roof', ipa: '/ruːf/', trans: 'Telhado', icon: '🏠' },
                { w: 'Stairway', ipa: '/ˈsterweɪ/', trans: 'Escada', icon: '🪜' },
                { w: 'Balcony', ipa: '/ˈbælkəni/', trans: 'Sacada/Varanda', icon: '🌇' },
                { w: 'Elevator', ipa: '/ˈelɪveɪtər/', trans: 'Elevador', icon: '🛗' },
                { w: 'Lobby', ipa: '/ˈlɒbi/', trans: 'Corredor/Hall', icon: '🏨' },
                { w: 'Intercom', ipa: '/ˈɪntərkɒm/', trans: 'Interfone', icon: '📞' },
                { w: 'Doorbell', ipa: '/ˈdɔːrbel/', trans: 'Campainha', icon: '🔔' },
                { w: 'Upstairs', ipa: '/ˌʌpˈsterz/', trans: 'Andar Superior', icon: '⬆️' },
                { w: 'Downstairs', ipa: '/ˌdaʊnˈsterz/', trans: 'Andar Inferior', icon: '⬇️' },
            ]
        },
        {
            name: 'Living Room',
            trans: 'Sala de Estar',
            icon: <Sofa className="w-5 h-5" />,
            color: 'violet',
            desc: isPortuguese ? "Onde relaxamos e recebemos visitas." : "Where we relax and welcome guests.",
            items: [
                { w: 'Sofa', ipa: '/ˈsoʊfə/', trans: 'Sofá', icon: '🛋️' },
                { w: 'Television', ipa: '/ˈtelɪvɪʒn/', trans: 'Televisão', icon: '📺' },
                { w: 'Picture', ipa: '/ˈpɪktʃər/', trans: 'Quadro/Pintura', icon: '🖼️' },
                { w: 'Easy Chair', ipa: '/ˈiːzi tʃer/', trans: 'Poltrona', icon: '💺' },
                { w: 'Coffee Table', ipa: '/ˈkɔːfi teɪbl/', trans: 'Mesinha de Centro', icon: '🪵' },
                { w: 'Rug', ipa: '/rʌɡ/', trans: 'Tapete', icon: '🧶' },
                { w: 'Cushion', ipa: '/ˈkʊʃn/', trans: 'Almofada', icon: '🟪' },
                { w: 'Curtains', ipa: '/ˈkɜːrtnz/', trans: 'Cortinas', icon: '🪟' },
            ]
        },
        {
            name: 'Kitchen',
            trans: 'Cozinha',
            icon: <Utensils className="w-5 h-5" />,
            color: 'emerald',
            desc: isPortuguese ? "O coração da casa." : "The heart of the house.",
            items: [
                { w: 'Fridge', ipa: '/frɪdʒ/', trans: 'Geladeira', icon: '❄️' },
                { w: 'Stove', ipa: '/stoʊv/', trans: 'Fogão', icon: '🔥' },
                { w: 'Microwave', ipa: '/ˈmaɪkroʊweɪv/', trans: 'Microondas', icon: '⚡' },
                { w: 'Cabinet', ipa: '/ˈkæbɪnət/', trans: 'Armário', icon: '🚪' },
                { w: 'Table', ipa: '/ˈteɪbl/', trans: 'Mesa', icon: '🍽️' },
                { w: 'Chair', ipa: '/tʃer/', trans: 'Cadeira', icon: '🪑' },
                { w: 'Glass', ipa: '/ɡlæs/', trans: 'Copo', icon: '🥛' },
                { w: 'Cup', ipa: '/kʌp/', trans: 'Xícara', icon: '☕' },
                { w: 'Plate', ipa: '/pleɪt/', trans: 'Prato', icon: '🍽️' },
                { w: 'Fork', ipa: '/fɔːrk/', trans: 'Garfo', icon: '🍴' },
                { w: 'Knife', ipa: '/naɪf/', trans: 'Faca', icon: '🔪' },
                { w: 'Spoon', ipa: '/spuːn/', trans: 'Colher', icon: '🥄' },
            ]
        },
        {
            name: 'Bedroom',
            trans: 'Quarto',
            icon: <Bed className="w-5 h-5" />,
            color: 'rose',
            desc: isPortuguese ? "Seu refúgio pessoal." : "Your personal sanctuary.",
            items: [
                { w: 'Bed', ipa: '/bed/', trans: 'Cama', icon: '🛏️' },
                { w: 'Mattress', ipa: '/ˈmætrəs/', trans: 'Colchão', icon: '🛏️' },
                { w: 'Pillow', ipa: '/ˈpɪloʊ/', trans: 'Travesseiro', icon: '☁️' },
                { w: 'Blanket', ipa: '/ˈblæŋkɪt/', trans: 'Cobertor', icon: '🛌' },
                { w: 'Wardrobe', ipa: '/ˈwɔːrdroʊb/', trans: 'Guarda-roupa', icon: '🚪' },
                { w: 'Lamp', ipa: '/læmp/', trans: 'Abajur', icon: '💡' },
                { w: 'Alarm Clock', ipa: '/əˈlɑːrm klɒk/', trans: 'Despertador', icon: '⏰' },
                { w: 'Mirror', ipa: '/ˈmɪrər/', trans: 'Espelho', icon: '🪞' },
            ]
        },
        {
            name: 'Bathroom',
            trans: 'Banheiro',
            icon: <Bath className="w-5 h-5" />,
            color: 'sky',
            desc: isPortuguese ? "Higiene e cuidados." : "Hygiene and care.",
            items: [
                { w: 'Shower', ipa: '/ˈʃaʊər/', trans: 'Chuveiro', icon: '🚿' },
                { w: 'Toilet', ipa: '/ˈtɔɪlət/', trans: 'Vaso Sanitário', icon: '🚽' },
                { w: 'Sink', ipa: '/sɪŋk/', trans: 'Pia', icon: '🚰' },
                { w: 'Towel', ipa: '/ˈtaʊəl/', trans: 'Toalha', icon: '🧖' },
                { w: 'Soap', ipa: '/soʊp/', trans: 'Sabonete', icon: '🧼' },
                { w: 'Toothbrush', ipa: '/ˈtuːθbrʌʃ/', trans: 'Escova', icon: '🪥' },
                { w: 'Toothpaste', ipa: '/ˈtuːθpeɪst/', trans: 'Pasta', icon: '🦷' },
            ]
        }
    ];

    const currentRoom = activeRooms[activeTab];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Home className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">🏡</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Home vs. House" : "Home vs. House"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"House é apenas a construção, o prédio (tijolos). Home é o lar, o sentimento, onde seu coração está. Você pode apontar para uma 'House', mas você sente 'Home'. Let's explore your home!\""
                                : "\"House is just the building, the structure (bricks). Home is the feeling, where your heart is. You can point at a 'House', but you feel 'Home'. Let's explore your home!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Room Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {activeRooms.map((room, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`
                            whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border-2
                            ${activeTab === idx
                                ? `bg-${room.color}-500 text-white border-${room.color}-500 shadow-lg shadow-${room.color}-500/30 scale-105`
                                : `bg-white text-slate-400 border-slate-100 hover:border-${room.color}-200 hover:text-${room.color}-500`
                            }
                        `}
                    >
                        {room.icon}
                        {room.name}
                    </button>
                ))}
            </div>

            {/* Active Room Content */}
            <section className="space-y-6 animate-fade-in">
                <div className={`p-6 rounded-3xl bg-${currentRoom.color}-50 border border-${currentRoom.color}-100`}>
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`p-3 rounded-xl bg-white text-${currentRoom.color}-500 shadow-sm`}>
                            {currentRoom.icon}
                        </div>
                        <div>
                            <h4 className={`text-2xl font-black text-${currentRoom.color}-900`}>
                                {currentRoom.name}
                            </h4>
                            <p className={`text-xs font-bold text-${currentRoom.color}-600 uppercase tracking-widest`}>
                                {isPortuguese ? currentRoom.trans : currentRoom.name}
                            </p>
                        </div>
                    </div>
                    <p className={`text-sm text-${currentRoom.color}-800/80`}>{currentRoom.desc}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentRoom.items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => speak(item.w)}
                            className={`
                                group bg-white p-4 rounded-3xl border border-slate-100 
                                hover:border-${currentRoom.color}-400 hover:shadow-xl hover:shadow-${currentRoom.color}-100 
                                transition-all flex flex-col items-center text-center relative overflow-hidden
                            `}
                        >
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">{item.icon}</span>
                            <h5 className="font-bold text-slate-800 mb-1">{item.w}</h5>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded opacity-80">{item.ipa}</span>
                                {isPortuguese && <span className={`text-[10px] font-bold text-${currentRoom.color}-500 uppercase tracking-wide`}>{item.trans}</span>}
                            </div>
                            <div className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-${currentRoom.color}-400`}>
                                <Volume2 className="w-4 h-4" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Confusing Words Alert */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-amber-50 rounded-[2.5rem] p-8 relative border border-amber-100 overflow-hidden group hover:border-amber-300 transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-amber-900 text-8xl font-black">?</div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-amber-400 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Warning</span>
                            <h5 className="font-bold text-amber-900 uppercase tracking-wide text-xs">
                                {isPortuguese ? "Não Confunda!" : "Don't Confuse!"}
                            </h5>
                        </div>

                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="text-center">
                                <span className="text-4xl block mb-2">🍳</span>
                                <span className="font-black text-amber-900">Kitchen</span>
                                <span className="block text-[10px] text-amber-700/60 font-mono">/ˈkɪtʃɪn/</span>
                            </div>
                            <div className="h-px flex-1 bg-amber-300 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-100 px-2 text-[10px] font-bold text-amber-500">VS</div>
                            </div>
                            <div className="text-center">
                                <span className="text-4xl block mb-2">🐔</span>
                                <span className="font-black text-amber-900">Chicken</span>
                                <span className="block text-[10px] text-amber-700/60 font-mono">/ˈtʃɪkɪn/</span>
                            </div>
                        </div>

                        <p className="text-xs text-amber-800 leading-relaxed text-center">
                            {isPortuguese
                                ? "Você cozinha na Kitchen. Você come o Chicken. Cuidado para não comer a cozinha!"
                                : "You cook in the Kitchen. You eat the Chicken. Careful not to eat the kitchen!"}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-[2.5rem] p-8 relative border border-slate-700 overflow-hidden text-slate-300">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Tip</span>
                            <h5 className="font-bold text-white uppercase tracking-wide text-xs">
                                {isPortuguese ? "Onde eu guardo?" : "Where do I put it?"}
                            </h5>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-4 bg-slate-700/50 p-3 rounded-xl border border-slate-600">
                                <span className="text-2xl">🧥</span>
                                <div>
                                    <div className="font-bold text-white text-sm">Wardrobe (UK) / Closet (US)</div>
                                    <div className="text-[10px] text-slate-400">For clothes / Roupas</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-700/50 p-3 rounded-xl border border-slate-600">
                                <span className="text-2xl">🍽️</span>
                                <div>
                                    <div className="font-bold text-white text-sm">Cupboard / Cabinet</div>
                                    <div className="text-[10px] text-slate-400">For food & dishes / Comida e pratos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Application */}
            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] p-10 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 p-4 opacity-10"><MessageCircle className="w-32 h-32 text-indigo-900" /></div>
                <div className="relative z-10">
                    <h5 className="font-black text-indigo-900 uppercase text-xs tracking-widest mb-4">
                        {isPortuguese ? "Pratique Agora" : "Practice Now"}
                    </h5>
                    <p className="text-lg font-serif-display text-indigo-800 mb-8 max-w-xl mx-auto">
                        {isPortuguese
                            ? "Complete: \"The ________ is in the ________.\""
                            : "Complete: \"The ________ is in the ________.\""}
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <button onClick={() => speak("The sofa is in the living room.")} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-indigo-100">
                            🛋️ Sofa / Living Room
                        </button>
                        <button onClick={() => speak("The fridge is in the kitchen.")} className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-emerald-100">
                            ❄️ Fridge / Kitchen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrepositionsPlace = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [activePrep, setActivePrep] = useState('on');

    const prepositions = [
        { id: 'in', label: 'In', trans: 'Dentro', color: 'indigo', icon: '📥' },
        { id: 'on', label: 'On', trans: 'Sobre', color: 'emerald', icon: '🔝' },
        { id: 'under', label: 'Under', trans: 'Embaixo', color: 'amber', icon: '⬇️' },
        { id: 'next_to', label: 'Next to', trans: 'Ao lado', color: 'blue', icon: '➡️' },
        { id: 'behind', label: 'Behind', trans: 'Atrás', color: 'purple', icon: '🔙' },
        { id: 'in_front_of', label: 'In front of', trans: 'Na frente', color: 'rose', icon: '👀' },
        { id: 'between', label: 'Between', trans: 'Entre', color: 'orange', icon: '↔️' },
    ];

    const getPositionStyle = (prep: string) => {
        switch (prep) {
            case 'in': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] scale-90 z-0 opacity-80'; // Inside
            case 'on': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-full z-20'; // On top
            case 'under': return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%] z-0 opacity-90 scale-90'; // Under
            case 'next_to': return 'top-1/2 right-0 translate-x-full -translate-y-1/2 ml-4 z-20'; // Right side
            case 'behind': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-[80%] scale-75 z-0 opacity-60 blur-[1px]'; // Behind
            case 'in_front_of': return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%] scale-125 z-30'; // Front
            case 'between': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'; // Special case handled in render
            default: return '';
        }
    };

    const getDescription = (prep: string) => {
        if (isPortuguese) {
            const map: any = {
                'in': 'O gato está DENTRO da caixa.',
                'on': 'O gato está SOBRE a caixa.',
                'under': 'O gato está EMBAIXO da caixa.',
                'next_to': 'O gato está AO LADO da caixa.',
                'behind': 'O gato está ATRÁS da caixa.',
                'in_front_of': 'O gato está NA FRENTE da caixa.',
                'between': 'O gato está ENTRE as caixas.',
            };
            return map[prep];
        }
        const map: any = {
            'in': 'The cat is IN the box.',
            'on': 'The cat is ON the box.',
            'under': 'The cat is UNDER the box.',
            'next_to': 'The cat is NEXT TO the box.',
            'behind': 'The cat is BEHIND the box.',
            'in_front_of': 'The cat is IN FRONT OF the box.',
            'between': 'The cat is BETWEEN the boxes.',
        };
        return map[prep];
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">🧭</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Onde está o Gato?" : "Where is the Cat?"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Prepolições de lugar são como o GPS da frase. Elas dizem exatamente onde as coisas estão. Sem elas, estaríamos todos perdidos! Vamos usar nosso gato virtual para aprender.\" "
                                : "\"Prepositions of place are like the GPS of a sentence. They tell us exactly where things are. Without them, we'd all be lost! Let's use our virtual cat to learn.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Visualizer */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">

                {/* Visual Stage */}
                <div className="bg-white rounded-[3rem] p-12 h-96 flex flex-col items-center justify-center relative shadow-sm border border-slate-100 overflow-visible group">
                    <div className="absolute inset-0 bg-slate-50/50 rounded-[3rem] pattern-grid-lg opacity-50"></div>

                    {/* The Scene */}
                    <div className="relative z-10">
                        {/* The Box (Reference Object) */}
                        <div className={`relative transition-all duration-500 ${activePrep === 'between' ? 'flex gap-20' : ''}`}>
                            <div className="w-32 h-32 bg-amber-200 rounded-2xl border-4 border-amber-300 shadow-xl flex items-center justify-center text-4xl relative z-10">
                                📦
                                {/* Front Face Detail for 3D effect */}
                                <div className="absolute inset-x-4 top-4 h-1 bg-amber-900/10 rounded-full"></div>
                            </div>

                            {/* Second Box for 'Between' */}
                            {activePrep === 'between' && (
                                <div className="w-32 h-32 bg-amber-200 rounded-2xl border-4 border-amber-300 shadow-xl flex items-center justify-center text-4xl relative z-10 animate-fade-in">
                                    📦
                                </div>
                            )}

                            {/* The Cat (Moving Object) */}
                            <div className={`
                                absolute w-20 h-20 text-6xl flex items-center justify-center transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) filter drop-shadow-lg
                                ${getPositionStyle(activePrep)}
                            `}>
                                🐱
                            </div>
                        </div>
                    </div>

                    {/* Sentence Output */}
                    <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                        <div className="inline-block bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-100 shadow-sm transform transition-all hover:scale-105 cursor-pointer" onClick={() => speak(getDescription(activePrep))}>
                            <p className="text-lg font-bold text-slate-700 flex items-center gap-3">
                                {getDescription(activePrep)}
                                <Volume2 className="w-4 h-4 text-indigo-400" />
                            </p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-3">
                    {prepositions.map((prep) => (
                        <button
                            key={prep.id}
                            onClick={() => { setActivePrep(prep.id); speak(prep.label); }}
                            className={`
                                p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center gap-3
                                ${activePrep === prep.id
                                    ? `bg-${prep.color}-50 border-${prep.color}-400 text-${prep.color}-700 shadow-md scale-105 z-10`
                                    : `bg-white border-slate-100 text-slate-500 hover:border-${prep.color}-200 hover:bg-slate-50`
                                }
                            `}
                        >
                            <span className="text-2xl">{prep.icon}</span>
                            <div>
                                <span className="block text-sm">{prep.label}</span>
                                {isPortuguese && <span className="block text-[10px] uppercase tracking-wider opacity-60">{prep.trans}</span>}
                            </div>
                            {activePrep === prep.id && <div className={`ml-auto w-2 h-2 rounded-full bg-${prep.color}-500 animate-pulse`}></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transport Rule Tip */}
            <div className="bg-slate-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden text-slate-300 border border-slate-700 shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Layout className="w-64 h-64" /></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-lg shadow-emerald-500/20">🚀</div>
                        <div>
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Senior Tip</span>
                            <h4 className="text-2xl font-bold text-white leading-tight">
                                {isPortuguese ? "In ou On? A Regra do Transporte" : "In or On? The Transport Rule"}
                            </h4>
                        </div>
                    </div>

                    <p className="text-slate-400 mb-8 max-w-2xl leading-relaxed">
                        {isPortuguese
                            ? "Por que dizemos 'IN the car' mas 'ON the bus'? É confuso, né? Mas existe uma regra secreta:"
                            : "Why do we say 'IN the car' but 'ON the bus'? Confusing, right? But there is a secret rule:"}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* ON Rule */}
                        <div className="bg-slate-700/50 p-6 rounded-3xl border border-slate-600 hover:bg-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl">🚌</span>
                                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">ON</span>
                            </div>
                            <h5 className="text-white font-bold mb-2">Can you walk?</h5>
                            <p className="text-xs text-slate-400 mb-4">
                                {isPortuguese
                                    ? "Se você pode ficar em pé e andar dentro (Ônibus, Trem, Avião), use ON."
                                    : "If you can stand up and walk inside (Bus, Train, Plane), use ON."}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-emerald-300">On the bus</span>
                                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-emerald-300">On the plane</span>
                            </div>
                        </div>

                        {/* IN Rule */}
                        <div className="bg-slate-700/50 p-6 rounded-3xl border border-slate-600 hover:bg-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl">🚗</span>
                                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">IN</span>
                            </div>
                            <h5 className="text-white font-bold mb-2">You must sit?</h5>
                            <p className="text-xs text-slate-400 mb-4">
                                {isPortuguese
                                    ? "Se você precisa se abaixar e só consegue sentar (Carro, Táxi), use IN."
                                    : "If you must crouch down and can only sit (Car, Taxi), use IN."}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-indigo-300">In the car</span>
                                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-indigo-300">In the taxi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ThereIsAre = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [count, setCount] = useState(1);
    const [mode, setMode] = useState<'affirmative' | 'negative' | 'question'>('affirmative');

    const toggleCount = () => setCount(prev => prev === 1 ? 3 : 1);

    const getContent = () => {
        if (mode === 'affirmative') {
            return {
                title: count === 1 ? 'There is' : 'There are',
                rule: count === 1 ? 'Singular (1)' : 'Plural (2+)',
                sentence: count === 1 ? 'There is an apple on the table.' : 'There are three apples on the table.',
                trans: isPortuguese
                    ? (count === 1 ? 'Há/Tem uma maçã na mesa.' : 'Há/Tem três maçãs na mesa.')
                    : (count === 1 ? 'There is one apple.' : 'There are three apples.')
            };
        } else if (mode === 'negative') {
            return {
                title: count === 1 ? "There isn't" : "There aren't",
                rule: count === 1 ? 'Singular Negative' : 'Plural Negative',
                sentence: count === 1 ? "There isn't an apple on the table." : "There aren't three apples on the table.",
                trans: isPortuguese
                    ? (count === 1 ? 'Não há/tem uma maçã' : 'Não há/tem três maçãs')
                    : (count === 1 ? 'No apple here.' : 'No apples here.')
            };
        } else {
            return {
                title: count === 1 ? "Is there?" : "Are there?",
                rule: count === 1 ? 'Singular Question' : 'Plural Question',
                sentence: count === 1 ? "Is there an apple on the table?" : "Are there three apples on the table?",
                trans: isPortuguese
                    ? (count === 1 ? 'Tem uma maçã?' : 'Tem três maçãs?')
                    : (count === 1 ? 'Question: 1 apple?' : 'Question: 3 apples?')
            };
        }
    };

    const content = getContent();

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro - The Have Trap */}
            <div className="bg-rose-50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden border border-rose-100 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-5"><AlertTriangle className="w-64 h-64 text-rose-900" /></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-3xl text-white font-bold shadow-lg shadow-rose-500/20 animate-pulse">🚫</div>
                        <div>
                            <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Master Tip (Critical)</span>
                            <h4 className="text-2xl font-bold text-rose-900 leading-tight">
                                {isPortuguese ? "A Armadilha do 'HAVE'" : "The 'HAVE' Trap"}
                            </h4>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <p className="text-rose-800 leading-relaxed font-medium">
                                {isPortuguese
                                    ? "Em português, dizemos 'Tem um carro na rua'. Muitos traduzem como 'Have a car'. ISSO ESTÁ ERRADO! 'Have' indica posse (Eu tenho). Para existência, usamos THERE IS (um) ou THERE ARE (vários)."
                                    : "In Portuguese, you say 'Tem um carro'. Don't translate this as 'Have a car'. 'Have' is for possession (I have). For existence, use THERE IS (one) or THERE ARE (many)."}
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-white/80 p-3 rounded-xl border border-rose-200 flex items-center gap-3 opacity-50">
                                    <X className="w-5 h-5 text-rose-500" />
                                    <span className="line-through text-slate-400 text-sm">Have a car</span>
                                </div>
                                <div className="bg-white p-3 rounded-xl border-l-4 border-emerald-500 shadow-sm flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="font-bold text-emerald-700 text-sm">There is a car</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Magic Table Visualizer */}
            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                        {['affirmative', 'negative', 'question'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m as any)}
                                className={`
                                    px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all
                                    ${mode === m ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
                                `}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={toggleCount}
                        className="flex items-center gap-3 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl font-bold transition-colors group"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        {count === 1 ? 'Switch to Plural' : 'Switch to Singular'}
                    </button>
                </div>

                {/* Interpretation */}
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-black/5 rounded-[100%] blur-xl translate-y-4"></div>
                        {/* Table Surface */}
                        <div className="w-64 md:w-96 h-32 bg-amber-100 rounded-[3rem] border-4 border-amber-200 flex items-end justify-center pb-6 relative overflow-visible z-10">
                            {/* Items */}
                            <div className="flex gap-4 items-end transition-all duration-500">
                                <span className={`text-6xl transition-all duration-500 ${mode === 'negative' ? 'opacity-20 grayscale blur-[2px] scale-90' : 'bounce-in'}`}>🍎</span>
                                {count > 1 && (
                                    <>
                                        <span className={`text-6xl -ml-4 transition-all duration-500 delay-75 ${mode === 'negative' ? 'opacity-20 grayscale blur-[2px] scale-90' : 'bounce-in'}`}>🍎</span>
                                        <span className={`text-6xl -ml-4 transition-all duration-500 delay-150 ${mode === 'negative' ? 'opacity-20 grayscale blur-[2px] scale-90' : 'bounce-in'}`}>🍎</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Table Legs */}
                        <div className="absolute top-20 left-10 w-4 h-24 bg-amber-300 rounded-full -z-10"></div>
                        <div className="absolute top-20 right-10 w-4 h-24 bg-amber-300 rounded-full -z-10"></div>
                    </div>

                    <div className="mt-12 text-center">
                        <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            {content.rule}
                        </div>
                        <h3
                            className="text-3xl md:text-5xl font-black text-slate-800 mb-4 cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => speak(content.sentence)}
                        >
                            {content.title}...
                        </h3>
                        <div
                            className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-3xl cursor-pointer hover:bg-indigo-100 transition-all group max-w-lg mx-auto"
                            onClick={() => speak(content.sentence)}
                        >
                            <p className="text-xl font-medium text-slate-700 group-hover:text-indigo-700 flex items-center justify-center gap-3">
                                {content.sentence}
                                <Volume2 className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                            </p>
                            {isPortuguese && (
                                <p className="text-sm text-slate-400 mt-2 font-medium">{content.trans}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DaysMonths = ({ isPortuguese }: { isPortuguese: boolean }) => (
    <div className="space-y-12 animate-fade-in pb-20">
        {/* Senior Teacher Introduction */}
        <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Calendar className="w-32 h-32" /></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                <div className="flex-1">
                    <h3 className="text-2xl font-serif-display mb-2">
                        {isPortuguese ? "Dominando o Tempo" : "Mastering Time"}
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed italic">
                        {isPortuguese
                            ? "\"Para falar inglês com confiança, você precisa dominar o calendário. Não é apenas saber os nomes, é saber usá-los com as preposições corretas. Lembre-se desta regra de ouro: dias são <span className=\"font-bold text-white\">ON</span>, meses são <span className=\"font-bold text-white\">IN</span>. Vamos praticar!\""
                            : "\"To speak English with confidence, you need to master the calendar. It's not just knowing the names, it's knowing how to use them with the correct prepositions. Remember this golden rule: days are <span className=\"font-bold text-white\">ON</span>, months are <span className=\"font-bold text-white\">IN</span>. Let's practice!\""
                        }
                    </p>
                </div>
            </div>
        </div>

        {/* Days of the Week */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><CalendarDays className="w-5 h-5" /></div>
                <h4 className="text-2xl font-bold text-slate-800">Days of the Week</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { day: 'Monday', ipa: '/ˈmʌndeɪ/', trans: 'Segunda-feira', ex: 'I work on Monday.', icon: '😫' },
                    { day: 'Tuesday', ipa: '/ˈtuːzdeɪ/', trans: 'Terça-feira', ex: 'See you on Tuesday.', icon: '💻' },
                    { day: 'Wednesday', ipa: '/ˈwɛnzdeɪ/', trans: 'Quarta-feira', ex: 'On Wednesday we study.', icon: '🐫' },
                    { day: 'Thursday', ipa: '/ˈθɜːrzdeɪ/', trans: 'Quinta-feira', ex: 'Thursday is almost Friday.', icon: '💼' },
                    { day: 'Friday', ipa: '/ˈfraɪdeɪ/', trans: 'Sexta-feira', ex: 'I love Friday!', icon: '🎉' },
                    { day: 'Saturday', ipa: '/ˈsætərdeɪ/', trans: 'Sábado', ex: 'We relax on Saturday.', icon: '🏠' },
                    { day: 'Sunday', ipa: '/ˈsʌndeɪ/', trans: 'Domingo', ex: 'Church on Sunday.', icon: '☀️' }
                ].map(item => (
                    <button key={item.day} onClick={() => speak(item.day)} className="group relative p-6 bg-white rounded-3xl border border-slate-100 hover:border-indigo-400 hover:shadow-lg transition-all text-left">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                        </div>
                        <h5 className="text-xl font-bold text-slate-800 mb-1">{item.day}</h5>
                        <div className="flex gap-2 items-baseline mb-3">
                            <span className="text-[10px] font-mono text-slate-400">{item.ipa}</span>
                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">{item.trans}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border-l-2 border-indigo-200">
                            <p className="text-xs text-slate-500 italic">"{item.ex}"</p>
                        </div>
                    </button>
                ))}
            </div>
        </section>

        {/* Master Tip: Prepositions */}
        {/* Master Tip: Prepositions */}
        <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-5">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg font-black text-xl">!</div>
            <div>
                <h5 className="font-black text-amber-900 uppercase tracking-widest text-xs mb-2">
                    {isPortuguese ? "A Regra de Ouro das Preposições" : "The Golden Rule of Prepositions"}
                </h5>
                <p className="text-sm text-amber-800 leading-relaxed">
                    {isPortuguese
                        ? <span>Use <strong>ON</strong> para dias (On Monday, On Friday).<br />Use <strong>IN</strong> para meses (In January, In July).</span>
                        : <span>Use <strong>ON</strong> for days (On Monday, On Friday).<br />Use <strong>IN</strong> for months (In January, In July).</span>
                    }
                </p>
                <div className="mt-4 flex gap-2">
                    <button onClick={() => speak("I will see you on Monday.")} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-amber-700 shadow-sm border border-amber-200">🔊 "On Monday"</button>
                    <button onClick={() => speak("My birthday is in May.")} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-amber-700 shadow-sm border border-amber-200">🔊 "In May"</button>
                </div>
            </div>
        </div>

        {/* Months */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Calendar className="w-5 h-5" /></div>
                <h4 className="text-2xl font-bold text-slate-800">{isPortuguese ? "Meses do Ano" : "Months of the Year"}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                    { m: 'January', ipa: '/ˈdʒænjuəri/', t: 'Janeiro', icon: '❄️', ex: 'New Year is in January.', bg: 'bg-indigo-50 border-indigo-100' },
                    { m: 'February', ipa: '/ˈfɛbruəri/', t: 'Fevereiro', icon: '❤️', ex: 'Valentine\'s Day is in February.', bg: 'bg-rose-50 border-rose-100' },
                    { m: 'March', ipa: '/mɑːrtʃ/', t: 'Março', icon: '🍀', ex: 'Spring starts in March.', bg: 'bg-emerald-50 border-emerald-100' },
                    { m: 'April', ipa: '/ˈeɪprəl/', t: 'Abril', icon: '🐰', ex: 'Easter is often in April.', bg: 'bg-amber-50 border-amber-100' },
                    { m: 'May', ipa: '/meɪ/', t: 'Maio', icon: '🌸', ex: 'Mother\'s Day is in May.', bg: 'bg-pink-50 border-pink-100' },
                    { m: 'June', ipa: '/dʒuːn/', t: 'Junho', icon: '☀️', ex: 'Summer starts in June.', bg: 'bg-orange-50 border-orange-100' },
                    { m: 'July', ipa: '/dʒuˈlaɪ/', t: 'Julho', icon: '🎆', ex: 'We have holidays in July.', bg: 'bg-red-50 border-red-100' },
                    { m: 'August', ipa: '/ˈɔːɡəst/', t: 'Agosto', icon: '🏖️', ex: 'It is hot in August.', bg: 'bg-yellow-50 border-yellow-100' },
                    { m: 'September', ipa: '/sɛpˈtɛmbər/', t: 'Setembro', icon: '🍂', ex: 'School starts in September.', bg: 'bg-orange-50 border-orange-100' },
                    { m: 'October', ipa: '/ɒkˈtoʊbər/', t: 'Outubro', icon: '🎃', ex: 'Halloween is in October.', bg: 'bg-purple-50 border-purple-100' },
                    { m: 'November', ipa: '/noʊˈvɛmbər/', t: 'Novembro', icon: '🦃', ex: 'Thanksgiving is in November.', bg: 'bg-slate-50 border-slate-100' },
                    { m: 'December', ipa: '/dɪˈsɛmbər/', t: 'Dezembro', icon: '🎄', ex: 'Christmas is in December.', bg: 'bg-red-50 border-red-100' }
                ].map((item) => (
                    <button key={item.m} onClick={() => speak(item.m)} className={`p-4 rounded-3xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 text-left group relative overflow-hidden ${item.bg}`}>
                        <div className="absolute top-0 right-0 p-3 opacity-10 text-5xl group-hover:scale-125 transition-transform">{item.icon}</div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-1">
                                <h5 className="font-bold text-slate-800 text-lg group-hover:text-indigo-900">{item.m}</h5>
                                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                            </div>
                            <div className="flex gap-2 items-center mb-3">
                                <span className="text-[10px] font-mono text-slate-500 opacity-70">{item.ipa}</span>
                                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{item.t}</span>
                            </div>
                            <div className="p-2 bg-white/60 rounded-xl backdrop-blur-sm border border-white/50">
                                <p className="text-[10px] text-slate-600 italic leading-snug">"{item.ex}"</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </section>

        {/* Seasons */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Sun className="w-5 h-5" /></div>
                <h4 className="text-2xl font-bold text-slate-800">{isPortuguese ? "Estações do Ano" : "Seasons of the Year"}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { s: 'Spring', ipa: '/sprɪŋ/', t: 'Primavera', icon: '🌸', desc: isPortuguese ? 'Flores desabrocham, nova vida.' : 'Flowers bloom, new life begins.', color: 'bg-pink-50 border-pink-100 text-pink-700' },
                    { s: 'Summer', ipa: '/ˈsʌmər/', t: 'Verão', icon: '☀️', desc: isPortuguese ? 'Dias quentes, praia e férias.' : 'Hot days, beach and holidays.', color: 'bg-yellow-50 border-yellow-100 text-amber-700' },
                    { s: 'Autumn / Fall', ipa: '/ˈɔːtəm/ - /fɔːl/', t: 'Outono', icon: '🍂', desc: isPortuguese ? 'Folhas caem, esfriando.' : 'Leaves fall, getting colder.', color: 'bg-orange-50 border-orange-100 text-orange-700' },
                    { s: 'Winter', ipa: '/ˈwɪntər/', t: 'Inverno', icon: '❄️', desc: isPortuguese ? 'Frio, neve, roupas quentes.' : 'Cold, snow, warm clothes.', color: 'bg-cyan-50 border-cyan-100 text-cyan-700' }
                ].map((item) => (
                    <button key={item.s} onClick={() => speak(item.s)} className={`p-6 rounded-[2rem] border-2 transition-all hover:shadow-xl hover:-translate-y-1 text-left group relative overflow-hidden ${item.color}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-20 text-8xl group-hover:scale-125 transition-transform rotate-12">{item.icon}</div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="font-black text-3xl">{item.s}</h5>
                                <Volume2 className="w-6 h-6 opacity-60 group-hover:opacity-100" />
                            </div>
                            <div className="flex gap-3 items-center mb-4">
                                <span className="text-xs font-mono opacity-70 bg-white/50 px-2 py-1 rounded-md">{item.ipa}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{item.t}</span>
                            </div>
                            <p className="text-sm font-medium opacity-90 italic">"{item.desc}"</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Pro Tip: Hemisphere Reverse */}
            {/* Pro Tip: Hemisphere Reverse */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                <div className="text-2xl">🌍</div>
                <div>
                    <h5 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-1">
                        {isPortuguese ? "Curiosidade Geográfica" : "Geographic Curiosity"}
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        {isPortuguese
                            ? <span>Lembre-se: As estações são opostas nos hemisférios! <br />Quando é <strong className="text-amber-600">Summer</strong> no Brasil (Dez-Fev), é <strong className="text-cyan-600">Winter</strong> nos EUA/Europa.</span>
                            : <span>Remember: Seasons are opposite in hemispheres! <br />When it is <strong className="text-amber-600">Summer</strong> in Brazil (Dec-Feb), it is <strong className="text-cyan-600">Winter</strong> in USA/Europe.</span>
                        }
                    </p>
                </div>
            </div>
        </section>
    </div>
);

const TellingTime = ({ isPortuguese }: { isPortuguese: boolean }) => (
    <div className="space-y-12 animate-fade-in pb-20">
        {/* Senior Teacher Intro */}
        <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-32 h-32" /></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                <div className="flex-1">
                    <h3 className="text-2xl font-serif-display mb-2">
                        {isPortuguese ? "O Segredo do Relógio" : "The Clock's Secret"}
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed italic">
                        {isPortuguese
                            ? "\"Esqueça o jeito digital por um momento. O inglês ama o relógio analógico! Dividimos o relógio ao meio: o lado direito é <strong>PAST</strong> (passou de), o lado esquerdo é <strong>TO</strong> (para a próxima hora). Vamos dominar essa lógica juntos.\""
                            : "\"Forget the digital way for a moment. English loves the analog clock! We split the clock in half: the right side is <strong>PAST</strong>, the left side is <strong>TO</strong> (to the next hour). Let's master this logic together.\""
                        }
                    </p>
                </div>
            </div>
        </div>

        {/* The Golden Rules */}
        {/* The Golden Rules */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                <h5 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" /> Side A: PAST ({isPortuguese ? "Minutos" : "Minutes"} 1-30)
                </h5>
                <p className="text-sm text-indigo-800 mb-4">
                    {isPortuguese
                        ? <span>Tudo que acontece na primeira metade do relógio, nós dizemos quantos minutos <strong>passaram</strong> da hora.</span>
                        : <span>Everything that happens in the first half of the clock, we say how many minutes have <strong>passed</strong> the hour.</span>
                    }
                </p>
                <button onClick={() => speak("It is ten past two.")} className="w-full p-4 bg-white rounded-xl shadow-sm border border-indigo-200 text-left">
                    <div className="font-black text-2xl text-slate-800 mb-1">2:10</div>
                    <div className="text-indigo-600 font-bold">It's ten past two.</div>
                    <div className="text-[10px] text-slate-400 font-mono">/ɪts tɛn pæst tuː/</div>
                </button>
            </div>

            <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
                <h5 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Side B: TO ({isPortuguese ? "Minutos" : "Minutes"} 31-59)
                </h5>
                <p className="text-sm text-rose-800 mb-4">
                    {isPortuguese
                        ? <span>Passou da metade? Agora não olhamos para trás, olhamos para frente! Quantos minutos <strong>faltam</strong> para a próxima hora?</span>
                        : <span>Past the half? Now we don't look back, we look forward! How many minutes <strong>to</strong> the next hour?</span>
                    }
                </p>
                <button onClick={() => speak("It is ten to five.")} className="w-full p-4 bg-white rounded-xl shadow-sm border border-rose-200 text-left">
                    <div className="font-black text-2xl text-slate-800 mb-1">4:50</div>
                    <div className="text-rose-600 font-bold">It's ten to five.</div>
                    <div className="text-[10px] text-slate-400 font-mono">/ɪts tɛn tuː faɪv/</div>
                </button>
            </div>
        </div>

        {/* Key Phrases Grid */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Watch className="w-5 h-5" /></div>
                <h4 className="text-2xl font-bold text-slate-800">
                    {isPortuguese ? "Horas Especiais" : "Special Hours"}
                </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { time: '3:00', phrase: "It's three o'clock", desc: isPortuguese ? "Ponto em ponto" : "O'clock (Exact)", icon: "🕒", color: "text-indigo-600" },
                    { time: '3:15', phrase: "It's quarter past three", desc: isPortuguese ? "15 min (Um quarto)" : "15 min (Quarter)", icon: "🕒", color: "text-emerald-600" },
                    { time: '3:30', phrase: "It's half past three", desc: isPortuguese ? "Meia hora (Metade)" : "Half hour", icon: "🕞", color: "text-amber-600" },
                    { time: '3:45', phrase: "It's quarter to four", desc: isPortuguese ? "15 min para a próxima" : "15 min to next", icon: "¾", color: "text-rose-600" }
                ].map(item => (
                    <button key={item.time} onClick={() => speak(item.phrase)} className="p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-lg transition-all text-left flex flex-col gap-3 group">
                        <div className="text-4xl">{item.icon}</div>
                        <div>
                            <div className="font-black text-3xl text-slate-800 mb-1">{item.time}</div>
                            <div className={`font-bold text-sm ${item.color} mb-1`}>{item.phrase}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.desc}</div>
                        </div>
                        <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 self-end" />
                    </button>
                ))}
            </div>
        </section>

        {/* AM vs PM */}
        <div className="p-8 bg-slate-800 rounded-[2.5rem] text-slate-200 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex-1 space-y-4">
                <h5 className="text-2xl font-serif-display text-white">AM vs PM</h5>
                <p className="text-sm leading-relaxed text-slate-400">
                    O sistema de 24 horas (13:00, 14:00) é raro no dia a dia em inglês. Usamos 12 horas com AM e PM.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-2xl border border-slate-600">
                        <div className="font-black text-amber-400 text-xl mb-1">AM</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">Ante Meridiem</div>
                        <div className="text-xs mt-2 text-slate-300">00:00 (Meia-noite) até 11:59 (Manhã)</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-2xl border border-slate-600">
                        <div className="font-black text-indigo-400 text-xl mb-1">PM</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">Post Meridiem</div>
                        <div className="text-xs mt-2 text-slate-300">12:00 (Meio-dia) até 23:59 (Noite)</div>
                    </div>
                </div>
            </div>
            <div className="relative z-10 w-full md:w-auto flex justify-center">
                <div className="text-6xl animate-bounce">🌗</div>
            </div>
        </div>
    </div>
);

const WhQuestions = ({ isPortuguese }: { isPortuguese: boolean }) => (
    <div className="space-y-12 animate-fade-in pb-20">
        {/* Senior Teacher Intro */}
        <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10"><HelpCircle className="w-32 h-32" /></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">👨‍🏫</div>
                <div className="flex-1">
                    <h3 className="text-2xl font-serif-display mb-2">
                        {isPortuguese ? "As Chaves da Conversa" : "The Keys to Conversation"}
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed italic">
                        {isPortuguese
                            ? "\"Para descobrir qualquer coisa, você precisa dessas 6 palavras. Chamamos de 'WH- Questions'. Se você dominar isso, você controla a conversa. Note que a pronúncia do 'H' é geralmente silenciosa nessas palavras (exceto 'Who' e 'How').\""
                            : "\"To find out anything, you need these 6 words. We call them 'WH- Questions'. If you master this, you control the conversation. Note that the 'H' pronunciation is usually silent in these words (except 'Who' and 'How').\""
                        }
                    </p>
                </div>
            </div>
        </div>

        {/* The WH- Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { q: 'What', cat: isPortuguese ? 'Coisa / Ação' : 'Thing / Action', icon: '📦', question: 'What is this?', answer: "It's a book.", color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                { q: 'Where', cat: isPortuguese ? 'Lugar' : 'Place', icon: '📍', question: 'Where do you live?', answer: "I live in Brazil.", color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
                { q: 'When', cat: isPortuguese ? 'Tempo' : 'Time', icon: '📅', question: 'When is the party?', answer: "It's on Friday.", color: 'bg-amber-50 border-amber-100 text-amber-700' },
                { q: 'Who', cat: isPortuguese ? 'Pessoa' : 'Person', icon: '👤', question: 'Who is he?', answer: "He is my brother.", color: 'bg-rose-50 border-rose-100 text-rose-700' },
                { q: 'Why', cat: isPortuguese ? 'Razão' : 'Reason', icon: '❓', question: 'Why are you happy?', answer: "Because I'm learning.", color: 'bg-purple-50 border-purple-100 text-purple-700' },
                { q: 'How', cat: isPortuguese ? 'Maneira' : 'Manner', icon: '🛠️', question: 'How are you?', answer: "I'm fine, thanks.", color: 'bg-blue-50 border-blue-100 text-blue-700' }
            ].map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => speak(item.question + " ... " + item.answer)}
                    className={`relative p-6 rounded-[2rem] border-2 transition-all hover:shadow-xl hover:-translate-y-1 text-left group overflow-hidden ${item.color}`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-150 transition-transform">{item.icon}</div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-3xl font-black tracking-tight">{item.q}</h4>
                            <Volume2 className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                        </div>
                        <span className="inline-block px-3 py-1 bg-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                            {item.cat}
                        </span>

                        <div className="space-y-3">
                            <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                                <div className="text-[9px] uppercase font-bold opacity-50 mb-1">Question</div>
                                <div className="text-sm font-bold">"{item.question}"</div>
                            </div>
                            <div className="px-3">
                                <div className="text-[9px] uppercase font-bold opacity-50 mb-1">Answer</div>
                                <div className="text-xs font-medium italic opacity-80">"{item.answer}"</div>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>

        {/* Pro Tip - Intonation */}
        <div className="p-8 bg-slate-800 rounded-[2rem] text-white flex gap-6 shadow-xl border border-slate-700">
            <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0">📉</div>
            <div>
                <h5 className="font-bold text-indigo-300 uppercase tracking-widest text-xs mb-2">
                    {isPortuguese ? "Dica de Entonação" : "Intonation Tip"}
                </h5>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {isPortuguese
                        ? <span>Diferente das perguntas de "Sim/Não" (onde a voz sobe no final), nas <strong>WH- Questions</strong> a entonação geralmente <strong>cai</strong> no final da frase. Isso mostra confiança e autoridade.</span>
                        : <span>Unlike "Yes/No" questions (where the voice rises at the end), in <strong>WH- Questions</strong> intonation usually <strong>falls</strong> at the end. This shows confidence and authority.</span>
                    }
                </p>
            </div>
        </div>
    </div>
);

const PresentSimpleRules = ({ mode, isPortuguese }: { mode: 'base' | 'third', isPortuguese: boolean }) => {
    const isThirdPerson = mode === 'third';
    const [activeTab, setActiveTab] = useState('morning');

    const verbsData = [
        {
            id: 'morning',
            label: isPortuguese ? 'Rotina Matinal' : 'Morning Routine',
            icon: '🌅',
            verbs: [
                { en: 'Wake up', pt: 'Acordar', s: 'Wakes up' },
                { en: 'Get up', pt: 'Levantar-se', s: 'Gets up' },
                { en: 'Brush', pt: 'Escovar', s: 'Brushes', rule: 'es' },
                { en: 'Wash', pt: 'Lavar', s: 'Washes', rule: 'es' },
                { en: 'Take', pt: 'Tomar/Pegar', s: 'Takes' },
                { en: 'Get dressed', pt: 'Vestir-se', s: 'Gets dressed' },
                { en: 'Eat', pt: 'Comer', s: 'Eats' },
                { en: 'Drink', pt: 'Beber', s: 'Drinks' },
                { en: 'Leave', pt: 'Sair', s: 'Leaves' }
            ]
        },
        {
            id: 'commuting',
            label: isPortuguese ? 'Deslocamento' : 'Commuting',
            icon: '🚗',
            verbs: [
                { en: 'Go', pt: 'Ir', s: 'Goes', rule: 'es' },
                { en: 'Come', pt: 'Vir', s: 'Comes' },
                { en: 'Walk', pt: 'Caminhar', s: 'Walks' },
                { en: 'Drive', pt: 'Dirigir', s: 'Drives' },
                { en: 'Arrive', pt: 'Chegar', s: 'Arrives' },
                { en: 'Return', pt: 'Retornar', s: 'Returns' }
            ]
        },
        {
            id: 'work',
            label: isPortuguese ? 'Trabalho/Estudo' : 'Work & Study',
            icon: '💼',
            verbs: [
                { en: 'Work', pt: 'Trabalhar', s: 'Works' },
                { en: 'Study', pt: 'Estudar', s: 'Studies', rule: 'ies' },
                { en: 'Read', pt: 'Ler', s: 'Reads' },
                { en: 'Write', pt: 'Escrever', s: 'Writes' },
                { en: 'Listen', pt: 'Escutar', s: 'Listens' },
                { en: 'Speak', pt: 'Falar', s: 'Speaks' },
                { en: 'Talk', pt: 'Conversar', s: 'Talks' },
                { en: 'Learn', pt: 'Aprender', s: 'Learns' },
                { en: 'Teach', pt: 'Ensinar', s: 'Teaches', rule: 'es' },
                { en: 'Ask', pt: 'Perguntar', s: 'Asks' },
                { en: 'Answer', pt: 'Responder', s: 'Answers' },
                { en: 'Use', pt: 'Usar', s: 'Uses' },
                { en: 'Start', pt: 'Começar', s: 'Starts' },
                { en: 'Finish', pt: 'Terminar', s: 'Finishes', rule: 'es' }
            ]
        },
        {
            id: 'home',
            label: isPortuguese ? 'Casa' : 'Home',
            icon: '🏠',
            verbs: [
                { en: 'Cook', pt: 'Cozinhar', s: 'Cooks' },
                { en: 'Clean', pt: 'Limpar', s: 'Cleans' },
                { en: 'Make', pt: 'Fazer (Criar)', s: 'Makes' },
                { en: 'Do', pt: 'Fazer (Ação)', s: 'Does', rule: 'es' },
                { en: 'Buy', pt: 'Comprar', s: 'Buys' },
                { en: 'Pay', pt: 'Pagar', s: 'Pays' },
                { en: 'Help', pt: 'Ajudar', s: 'Helps' }
            ]
        },
        {
            id: 'leisure',
            label: isPortuguese ? 'Lazer' : 'Lazer',
            icon: '🎉',
            verbs: [
                { en: 'Watch', pt: 'Assistir', s: 'Watches', rule: 'es' },
                { en: 'Play', pt: 'Jogar/Brincar', s: 'Plays' },
                { en: 'Dance', pt: 'Dançar', s: 'Dances' },
                { en: 'Sing', pt: 'Cantar', s: 'Sings' },
                { en: 'Travel', pt: 'Viajar', s: 'Travels' },
                { en: 'Sleep', pt: 'Dormir', s: 'Sleeps' },
                { en: 'Rest', pt: 'Descansar', s: 'Rests' }
            ]
        },
        {
            id: 'feelings',
            label: isPortuguese ? 'Sentimentos' : 'Feelings',
            icon: '❤️',
            verbs: [
                { en: 'Like', pt: 'Gostar', s: 'Likes' },
                { en: 'Love', pt: 'Amar', s: 'Loves' },
                { en: 'Want', pt: 'Querer', s: 'Wants' },
                { en: 'Need', pt: 'Precisar', s: 'Needs' },
                { en: 'Know', pt: 'Saber', s: 'Knows' },
                { en: 'Understand', pt: 'Entender', s: 'Understands' },
                { en: 'Think', pt: 'Pensar', s: 'Thinks' },
                { en: 'Have', pt: 'Ter', s: 'Has', rule: 'irregular' }
            ]
        }
    ];

    const currentTab = verbsData.find(t => t.id === activeTab) || verbsData[0];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className={`relative p-8 rounded-[2rem] text-white overflow-hidden shadow-2xl ${isThirdPerson ? 'bg-rose-900' : 'bg-indigo-900'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg border-2 ${isThirdPerson ? 'bg-rose-500 border-rose-400' : 'bg-indigo-500 border-indigo-400'}`}>👨‍🏫</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese
                                ? (isThirdPerson ? "O Perigo do 'S'" : "O Modo Padrão do Inglês")
                                : (isThirdPerson ? "The Danger of 'S'" : "The Standard English Mode")
                            }
                        </h3>
                        <p className={`text-sm leading-relaxed italic ${isThirdPerson ? 'text-rose-100' : 'text-indigo-100'}`}>
                            {isPortuguese
                                ? (isThirdPerson
                                    ? "\"Aqui vive o erro mais comum de estudantes avançados! No inglês, quando falamos dele (He), dela (She) ou disso (It), o verbo ganha um 'S'. Não é plural, é conjugação!\""
                                    : "\"O Present Simple é a roupa do dia a dia. Usamos para fatos, rotinas e verdades universais. A boa notícia? O verbo quase não muda!\"")
                                : (isThirdPerson
                                    ? "\"Here lives the most common mistake of advanced students! In English, when we talk about him (He), her (She) or it (It), the verb gets an 'S'. It's not plural, it's conjugation!\""
                                    : "\"Present Simple is the everyday outfit. We use it for facts, routines and universal truths. The good news? The verb hardly changes!\"")
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* The Rule Box */}
            <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${isThirdPerson ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}><PenTool className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese
                            ? (isThirdPerson ? "A Regra da 3ª Pessoa" : "A Estrutura Básica")
                            : (isThirdPerson ? "The 3rd Person Rule" : "The Basic Structure")
                        }
                    </h4>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-lg text-slate-600 text-center">
                            {isThirdPerson ? "Subject + Verb + S" : "Subject + Verb"}
                        </div>
                        <ul className="space-y-2">
                            {[
                                isThirdPerson ? "He works..." : "I work...",
                                isThirdPerson ? "She likes..." : "You like...",
                                isThirdPerson ? "It rains..." : "We live..."
                            ].map((ex, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-500 font-medium">
                                    <Check className={`w-4 h-4 ${isThirdPerson ? 'text-rose-500' : 'text-indigo-500'}`} /> {ex}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`p-6 rounded-3xl ${isThirdPerson ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
                        <h5 className={`font-bold mb-2 ${isThirdPerson ? 'text-rose-900' : 'text-indigo-900'}`}>{isPortuguese ? "Exemplo Prático" : "Practical Example"}</h5>
                        <button
                            onClick={() => speak(isThirdPerson ? "She drinks coffee every morning." : "I drink coffee every morning.")}
                            className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:scale-105 transition-transform"
                        >
                            <span className="text-4xl">☕</span>
                            <div className="text-left">
                                <div className="font-bold text-slate-800">
                                    {isThirdPerson
                                        ? <span>She drink<span className="text-rose-600 font-black">s</span> coffee.</span>
                                        : <span>I drink coffee.</span>
                                    }
                                </div>
                                <div className="text-xs text-slate-400">{isPortuguese ? "Clique para ouvir" : "Click to listen"}</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Special Interactive Section for 3rd Person */}
            {isThirdPerson && (
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { v: 'Work', s: 'Works', icon: '💼' },
                        { v: 'Play', s: 'Plays', icon: '🎮' },
                        { v: 'Watch', s: 'Watches', icon: '📺', note: isPortuguese ? 'Termina em CH = +ES' : 'Ends in CH = +ES' }
                    ].map((item, idx) => (
                        <button key={idx} onClick={() => speak(`He ${item.s.toLowerCase()}.`)} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-rose-400 transition-all group">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <div className="text-slate-400 text-sm line-through decoration-rose-400 opacity-50">I {item.v}</div>
                            <div className="text-xl font-black text-slate-800 group-hover:text-rose-600">He {item.s}</div>
                            {item.note && <div className="text-[9px] font-bold text-rose-400 mt-2 uppercase tracking-wide">{item.note}</div>}
                        </button>
                    ))}
                </div>
            )}


            {/* 50 Essential Verbs Section */}
            <section className="space-y-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><Zap className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Top 50 Verbos Essenciais" : "Top 50 Essential Verbs"}
                    </h4>
                </div>

                <p className="text-slate-600 leading-relaxed">
                    {isPortuguese
                        ? "Aqui estão os verbos que você mais vai usar. Clique nas categorias para explorar. Preste atenção nas formas de 3ª Pessoa (He/She/It)!"
                        : "Here are the verbs you will use the most. Click categories to explore. Pay attention to 3rd Person forms (He/She/It)!"
                    }
                </p>

                <div className="w-full">
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-100/50 rounded-xl">
                        {verbsData.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-xs sm:text-sm ${activeTab === tab.id ? 'bg-white shadow-sm text-indigo-600 scale-105' : 'text-slate-500 hover:bg-white/50'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                        {currentTab.verbs.map((v, i) => (
                            <button key={i} onClick={() => speak(v.en)} className="relative group p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all text-left">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-black text-slate-800 text-lg group-hover:text-indigo-600">{v.en}</span>
                                    <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                                </div>
                                <div className="text-xs text-slate-500 font-medium mb-3 border-b border-slate-50 pb-2">{v.pt}</div>

                                <div className={`px-2 py-1 rounded-lg text-xs font-bold w-fit ${v.rule === 'es' ? 'bg-amber-100 text-amber-700' :
                                    v.rule === 'ies' ? 'bg-rose-100 text-rose-700' :
                                        v.rule === 'irregular' ? 'bg-purple-100 text-purple-700' :
                                            'bg-slate-100 text-slate-500'
                                    }`}>
                                    <span className="opacity-50 mr-1">He/She</span>
                                    {v.s}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grammar Focus Rules */}
            <div className="bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/20 rounded-lg"><Star className="w-6 h-6 text-amber-400" /></div>
                        <h4 className="text-2xl font-bold">
                            {isPortuguese ? "Gramática: Regras de Ortografia" : "Grammar: Spelling Rules"}
                        </h4>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600">
                            <div className="text-amber-400 font-black text-xl mb-2 flex items-center gap-2">
                                -ES <span className="text-xs font-normal text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full">O, CH, SH, X, SS</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-4 h-10">
                                {isPortuguese ? "Para verbos que terminam com sons de 'chiado' ou 'o'." : "For verbs ending in hissing sounds or 'o'."}
                            </p>
                            <ul className="space-y-1 text-sm font-mono text-slate-200">
                                <li className="flex justify-between">Go <span className="text-amber-400">Goes</span></li>
                                <li className="flex justify-between">Watch <span className="text-amber-400">Watches</span></li>
                                <li className="flex justify-between">Wash <span className="text-amber-400">Washes</span></li>
                            </ul>
                        </div>

                        <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600">
                            <div className="text-rose-400 font-black text-xl mb-2 flex items-center gap-2">
                                -IES <span className="text-xs font-normal text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full">Consoante + Y</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-4 h-10">
                                {isPortuguese ? "Tire o Y e adicione IES. Se for vogal + Y (Play), apenas S." : "Drop Y and add IES. If Vowel + Y (Play), just S."}
                            </p>
                            <ul className="space-y-1 text-sm font-mono text-slate-200">
                                <li className="flex justify-between">Study <span className="text-rose-400">Studies</span></li>
                                <li className="flex justify-between">Cry <span className="text-rose-400">Cries</span></li>
                                <li className="flex justify-between opacity-50">Play <span className="">Plays</span></li>
                            </ul>
                        </div>

                        <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600">
                            <div className="text-purple-400 font-black text-xl mb-2 flex items-center gap-2">
                                Irregular <span className="text-xs font-normal text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full">Exceção</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-4 h-10">
                                {isPortuguese ? "A única grande exceção que você precisa memorizar agora." : "The only major exception you need to memorize now."}
                            </p>
                            <ul className="space-y-1 text-sm font-mono text-slate-200">
                                <li className="flex justify-between">Have <span className="text-purple-400">Has</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

const DailyRoutine = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const routines = [
        {
            time: isPortuguese ? 'Manhã (Morning)' : 'Morning',
            icon: '🌅',
            color: 'bg-amber-500',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            text: 'text-amber-800',
            items: [
                { w: 'Wake up', ipa: '/weɪk ʌp/', pt: 'Acordar', icon: '🥱' },
                { w: 'Make the bed', ipa: '/meɪk ðə bɛd/', pt: 'Arrumar a cama', icon: '🛏️' },
                { w: 'Have breakfast', ipa: '/hæv ˈbrɛkfəst/', pt: 'Tomar café da manhã', icon: '☕' },
                { w: 'Go to work', ipa: '/ɡoʊ tu wɜrk/', pt: 'Ir para o trabalho', icon: '💼' }
            ]
        },
        {
            time: isPortuguese ? 'Tarde (Afternoon)' : 'Afternoon',
            icon: '☀️',
            color: 'bg-orange-500',
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            text: 'text-orange-800',
            items: [
                { w: 'Have lunch', ipa: '/hæv lʌntʃ/', pt: 'Almoçar', icon: '🥗' },
                { w: 'Finish work', ipa: '/ˈfɪnɪʃ wɜrk/', pt: 'Terminar o trabalho', icon: '✅' },
                { w: 'Go to the gym', ipa: '/ɡoʊ tu ðə dʒɪm/', pt: 'Ir para a academia', icon: '🏋️' }
            ]
        },
        {
            time: isPortuguese ? 'Fim de Tarde/Noite (Evening)' : 'Evening',
            icon: '🌇',
            color: 'bg-indigo-500',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            text: 'text-indigo-800',
            items: [
                { w: 'Have dinner', ipa: '/hæv ˈdɪnər/', pt: 'Jantar', icon: '🍽️' },
                { w: 'Do homework', ipa: '/du ˈhoʊmwɜrk/', pt: 'Fazer lição de casa', icon: '📚' },
                { w: 'Watch TV', ipa: '/wɒtʃ tiːˈviː/', pt: 'Assistir TV', icon: '📺' }
            ]
        },
        {
            time: isPortuguese ? 'Noite Adentro (Night)' : 'Night',
            icon: '🌙',
            color: 'bg-slate-800',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            text: 'text-slate-800',
            items: [
                { w: 'Take a shower', ipa: '/teɪk ə ˈʃaʊər/', pt: 'Tomar banho', icon: '🚿' },
                { w: 'Read a book', ipa: '/rid ə bʊk/', pt: 'Ler um livro', icon: '📖' },
                { w: 'Go to sleep', ipa: '/ɡoʊ tu slip/', pt: 'Ir dormir', icon: '💤' }
            ]
        }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Intro */}
            <div className="relative p-8 rounded-[2rem] bg-slate-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-4xl shadow-lg border-2 border-slate-500">🌅</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "A Rotina Diária" : "The Daily Routine"}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Do despertar ao deitar, a vida acontece em blocos de rotina. Vamos dominar o vocabulário para descrever o seu dia inteiro, do nascer até o pôr do sol.\""
                                : "\"From waking up to going to bed, life happens in routine blocks. Let's master the vocabulary to describe your entire day, from sunrise to sunset.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {routines.map((phase, idx) => (
                    <section key={idx} className={`p-6 sm:p-8 rounded-3xl border-2 ${phase.border} ${phase.bg} relative overflow-hidden transition-all hover:shadow-lg`}>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className={`p-3 rounded-2xl text-white ${phase.color} shadow-lg text-2xl`}>
                                {phase.icon}
                            </div>
                            <h4 className={`text-2xl font-black ${phase.text}`}>
                                {phase.time}
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            {phase.items.map(item => (
                                <button
                                    key={item.w}
                                    onClick={() => speak(`I ${item.w.toLowerCase()} every day.`)}
                                    className="group p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 hover:border-indigo-300 transition-all flex items-start gap-4 text-left hover:-translate-y-1"
                                >
                                    <div className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{item.w}</div>
                                        <div className="text-[10px] font-mono text-slate-400 mb-1">{item.ipa}</div>
                                        {isPortuguese && <div className="text-xs font-bold text-indigo-400 uppercase tracking-tight">{item.pt}</div>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

const AdverbsFrequency = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const adverbs = [
        { w: 'Always', p: 100, ipa: '/ˈɔːlweɪz/', pt: 'Sempre', icon: '🌟', color: 'bg-indigo-500', sentence: 'I always wake up at 6 AM.' },
        { w: 'Usually', p: 80, ipa: '/ˈjuːʒʊəli/', pt: 'Geralmente', icon: '🌤️', color: 'bg-indigo-400', sentence: 'I usually drink coffee.' },
        { w: 'Often', p: 60, ipa: '/ˈdɒf(t)ən/', pt: 'Frequentemente', icon: '📅', color: 'bg-indigo-300', sentence: 'I often go to the park.' },
        { w: 'Sometimes', p: 40, ipa: '/ˈsʌmtaɪmz/', pt: 'Às vezes', icon: '⚖️', color: 'bg-indigo-200', sentence: 'I sometimes watch TV.' },
        { w: 'Never', p: 0, ipa: '/ˈnɛvər/', pt: 'Nunca', icon: '🌑', color: 'bg-slate-200', sentence: 'I never eat sushi.' }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><CalendarDays className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">📊</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Domine a Frequência da Vida" : "Master the Rhythm of Routine"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Não basta saber 'o que' você faz, é preciso dizer 'com que frequência'. O segredo aqui é a posição: antes da ação, mas depois do verbo To Be!\""
                                : "\"It's not enough to know 'what' you do, you need to say 'how often'. The secret here is the position: before the action, but after the verb To Be!\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Scale */}
            <div className="grid gap-4">
                {adverbs.map(item => (
                    <button
                        key={item.w}
                        onClick={() => speak(item.sentence)}
                        className="group relative w-full p-4 pb-8 bg-white rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl w-12 text-center">{item.icon}</div>
                                <div className="text-left">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-black text-xl text-slate-800">{item.w}</span>
                                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-mono tracking-tighter">{item.ipa}</span>
                                    </div>
                                    <div className="text-xs font-bold text-indigo-400">{item.pt}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-slate-100 group-hover:text-indigo-100 transition-colors">{item.p}%</div>
                            </div>
                        </div>

                        {/* Progress Bar Background */}
                        <div className="absolute bottom-0 left-0 h-1.5 rounded-full overflow-hidden w-full px-4 mb-2 opacity-20 group-hover:opacity-100 transition-opacity">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.p === 0 ? 5 : item.p}%` }}></div>
                        </div>
                    </button>
                ))}
            </div>

            {/* The Golden Rule Section */}
            <div className="bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/20 rounded-lg"><Star className="w-6 h-6 text-amber-400" /></div>
                        <h4 className="text-2xl font-bold">
                            {isPortuguese ? "A Regra de Ouro" : "The Golden Rule"}
                        </h4>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Rule 1: Action Verbs */}
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm uppercase tracking-widest">
                                <Zap className="w-4 h-4" /> {isPortuguese ? "Verbos de Ação" : "Action Verbs"}
                            </div>
                            <div className="text-center p-4 bg-slate-900/50 rounded-xl mb-3 font-mono text-lg">
                                Subject + <span className="text-indigo-400 font-bold">Always</span> + Verb
                            </div>
                            <p className="text-xs text-slate-400 text-center italic">
                                "{isPortuguese ? "Antes da ação principal" : "Before the main action"}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                                <button onClick={() => speak("I usually drink coffee.")} className="text-sm hover:text-indigo-300 transition-colors">
                                    I <span className="font-bold text-emerald-400">usually</span> drink coffee.
                                </button>
                            </div>
                        </div>

                        {/* Rule 2: Verb To Be */}
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold text-sm uppercase tracking-widest">
                                <Star className="w-4 h-4" /> {isPortuguese ? "Verbo To Be" : "Verb To Be"}
                            </div>
                            <div className="text-center p-4 bg-slate-900/50 rounded-xl mb-3 font-mono text-lg">
                                To Be + <span className="text-indigo-400 font-bold">Always</span>
                            </div>
                            <p className="text-xs text-slate-400 text-center italic">
                                "{isPortuguese ? "Depois do verbo ser/estar" : "After the verb to be"}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                                <button onClick={() => speak("I am always happy.")} className="text-sm hover:text-indigo-300 transition-colors">
                                    I am <span className="font-bold text-rose-400">always</span> happy.
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- M7: OBJECT PRONOUNS ---
const ObjectPronouns = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const pronouns = [
        { subject: 'I', object: 'Me', ipa: '/miː/', pt: 'Me / Mim', icon: '🙋', example: 'Call me later.', exPt: 'Me ligue depois.', color: 'bg-indigo-50', text: 'text-indigo-700' },
        { subject: 'You', object: 'You', ipa: '/juː/', pt: 'Você / Te', icon: '👤', example: 'I love you.', exPt: 'Eu te amo.', color: 'bg-blue-50', text: 'text-blue-700' },
        { subject: 'He', object: 'Him', ipa: '/hɪm/', pt: 'Ele / O', icon: '👦', example: 'Tell him the truth.', exPt: 'Diga a verdade a ele.', color: 'bg-sky-50', text: 'text-sky-700' },
        { subject: 'She', object: 'Her', ipa: '/hɜːr/', pt: 'Ela / A', icon: '👧', example: 'Give her the book.', exPt: 'Dê o livro a ela.', color: 'bg-pink-50', text: 'text-pink-700' },
        { subject: 'It', object: 'It', ipa: '/ɪt/', pt: 'Ele(a) — coisa/animal', icon: '📦', example: 'I like it.', exPt: 'Eu gosto disso.', color: 'bg-slate-50', text: 'text-slate-700' },
        { subject: 'We', object: 'Us', ipa: '/ʌs/', pt: 'Nos / A gente', icon: '👥', example: 'Join us for dinner.', exPt: 'Junte-se a nós para o jantar.', color: 'bg-emerald-50', text: 'text-emerald-700' },
        { subject: 'They', object: 'Them', ipa: '/ðɛm/', pt: 'Eles(as) / Os / As', icon: '👫', example: 'I saw them yesterday.', exPt: 'Eu os vi ontem.', color: 'bg-amber-50', text: 'text-amber-700' },
    ];

    const usageCases = [
        {
            rule: isPortuguese ? 'Depois de verbos' : 'After verbs',
            icon: '🎯',
            examples: [
                { en: 'She loves him.', pt: 'Ela o ama.' },
                { en: 'They helped us.', pt: 'Eles nos ajudaram.' },
                { en: 'I know them.', pt: 'Eu os conheço.' },
            ],
            color: 'border-indigo-200 bg-indigo-50/50',
        },
        {
            rule: isPortuguese ? 'Depois de preposições' : 'After prepositions',
            icon: '📍',
            examples: [
                { en: 'This gift is for her.', pt: 'Este presente é para ela.' },
                { en: 'Sit next to me.', pt: 'Sente ao meu lado.' },
                { en: 'Talk to them.', pt: 'Fale com eles.' },
            ],
            color: 'border-emerald-200 bg-emerald-50/50',
        },
    ];

    const mistakes = [
        { wrong: 'He loves she.', right: 'He loves her.', tip: isPortuguese ? '"She" é sujeito, "her" é objeto.' : '"She" is a subject, "her" is an object.' },
        { wrong: 'Give it to I.', right: 'Give it to me.', tip: isPortuguese ? 'Depois de preposição, sempre use o pronome objeto.' : 'After a preposition, always use the object pronoun.' },
        { wrong: 'Me and him went.', right: 'He and I went.', tip: isPortuguese ? 'Como sujeito, use "I" e "He", não "me" e "him".' : 'As subjects, use "I" and "He", not "me" and "him".' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-indigo-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-4xl shadow-lg border-2 border-indigo-400">🎯</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Pronomes Objeto" : "Object Pronouns"}
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"'I' faz a ação, 'me' recebe a ação. Essa é a diferença fundamental. Em português temos 'eu' vs 'me/mim' — é o mesmo conceito! Domine isso e sua frase ganha precisão.\""
                                : "\"'I' does the action, 'me' receives it. That's the key difference. Master this and your sentences become precise and natural.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Subject vs Object Comparison */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><ArrowRight className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Sujeito vs Objeto" : "Subject vs Object"}
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pronouns.map((p, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(p.example)}
                            className={`group p-5 rounded-2xl border-2 border-transparent hover:border-indigo-200 transition-all text-left ${p.color} shadow-sm hover:shadow-md`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs font-bold text-slate-400 line-through decoration-slate-300">{p.subject}</span>
                                        <span className="text-lg font-black text-slate-800">→ {p.object}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 bg-white/60 px-1.5 py-0.5 rounded-full">{p.ipa}</span>
                                </div>
                            </div>
                            <p className={`text-sm font-medium ${p.text}`}>{p.example}</p>
                            {isPortuguese && <p className="text-[11px] text-slate-400 mt-1 font-medium">{p.exPt}</p>}
                            {isPortuguese && <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight mt-2">{p.pt}</div>}
                        </button>
                    ))}
                </div>
            </section>

            {/* Usage Rules */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><BookOpen className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "Quando usar?" : "When to use?"}
                    </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {usageCases.map((uc, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border-2 ${uc.color}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">{uc.icon}</span>
                                <h5 className="text-lg font-bold text-slate-800">{uc.rule}</h5>
                            </div>
                            <div className="space-y-2">
                                {uc.examples.map((ex, i) => (
                                    <button key={i} onClick={() => speak(ex.en)} className="w-full text-left p-3 rounded-xl bg-white/70 hover:bg-white transition-all flex items-center gap-3 group">
                                        <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                        <div>
                                            <span className="text-sm font-bold text-slate-700">{ex.en}</span>
                                            {isPortuguese && <span className="text-[11px] text-slate-400 block">{ex.pt}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Common Mistakes */}
            <section className="bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-500/20 rounded-lg"><AlertCircle className="w-6 h-6 text-rose-400" /></div>
                        <h4 className="text-2xl font-bold">
                            {isPortuguese ? "⚠️ Erros Comuns" : "⚠️ Common Mistakes"}
                        </h4>
                    </div>
                    <div className="space-y-4">
                        {mistakes.map((m, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex flex-col sm:flex-row gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                                        <span className="text-rose-300 line-through text-sm font-medium">{m.wrong}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        <span className="text-emerald-300 text-sm font-bold">{m.right}</span>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-xs pl-6">{m.tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "Quando o pronome vem depois de um verbo ou preposição, ele SEMPRE será um pronome objeto: \"Help ME\", \"Talk to HIM\", \"Listen to US\". Nunca use I, he, she, we ou they nessas posições!"
                            : "When the pronoun comes after a verb or preposition, it's ALWAYS an object pronoun: \"Help ME\", \"Talk to HIM\", \"Listen to US\". Never use I, he, she, we, or they in those positions!"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- M7: IMPERATIVES ---
const ImperativesLesson = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const affirmativeVerbs = [
        { verb: 'Open', ipa: '/ˈoʊpən/', pt: 'Abrir', icon: '🚪', sentence: 'Open the door.', sentPt: 'Abra a porta.' },
        { verb: 'Sit', ipa: '/sɪt/', pt: 'Sentar', icon: '🪑', sentence: 'Sit down, please.', sentPt: 'Sente-se, por favor.' },
        { verb: 'Listen', ipa: '/ˈlɪsən/', pt: 'Ouvir', icon: '👂', sentence: 'Listen to me.', sentPt: 'Ouça-me.' },
        { verb: 'Look', ipa: '/lʊk/', pt: 'Olhar', icon: '👀', sentence: 'Look at this!', sentPt: 'Olhe para isso!' },
        { verb: 'Come', ipa: '/kʌm/', pt: 'Vir', icon: '🏃', sentence: 'Come here!', sentPt: 'Venha aqui!' },
        { verb: 'Try', ipa: '/traɪ/', pt: 'Tentar', icon: '💪', sentence: 'Try again!', sentPt: 'Tente de novo!' },
        { verb: 'Wait', ipa: '/weɪt/', pt: 'Esperar', icon: '⏳', sentence: 'Wait a moment.', sentPt: 'Espere um momento.' },
        { verb: 'Help', ipa: '/hɛlp/', pt: 'Ajudar', icon: '🆘', sentence: 'Help me, please!', sentPt: 'Me ajude, por favor!' },
    ];

    const negativeExamples = [
        { en: "Don't run!", pt: 'Não corra!', icon: '🚫🏃', context: isPortuguese ? 'No corredor da escola' : 'In the school hallway' },
        { en: "Don't touch that!", pt: 'Não toque nisso!', icon: '🚫✋', context: isPortuguese ? 'Objeto perigoso' : 'Dangerous object' },
        { en: "Don't forget your keys.", pt: 'Não esqueça suas chaves.', icon: '🚫🔑', context: isPortuguese ? 'Saindo de casa' : 'Leaving home' },
        { en: "Don't worry!", pt: 'Não se preocupe!', icon: '🚫😟', context: isPortuguese ? 'Confortando alguém' : 'Comforting someone' },
        { en: "Don't be late.", pt: 'Não se atrase.', icon: '🚫⏰', context: isPortuguese ? 'Antes de uma reunião' : 'Before a meeting' },
    ];

    const situations = [
        {
            title: isPortuguese ? '🏫 Na sala de aula' : '🏫 In the Classroom',
            phrases: [
                { en: 'Open your books to page 10.', pt: 'Abram os livros na página 10.' },
                { en: 'Repeat after me.', pt: 'Repitam depois de mim.' },
                { en: "Don't use your phone.", pt: 'Não usem o celular.' },
            ],
            color: 'bg-blue-50 border-blue-200',
        },
        {
            title: isPortuguese ? '🍽️ No restaurante' : '🍽️ At the Restaurant',
            phrases: [
                { en: 'Try the fish. It\'s delicious!', pt: 'Experimente o peixe. É delicioso!' },
                { en: 'Give me the menu, please.', pt: 'Me dê o cardápio, por favor.' },
                { en: "Don't forget the tip.", pt: 'Não esqueça a gorjeta.' },
            ],
            color: 'bg-orange-50 border-orange-200',
        },
        {
            title: isPortuguese ? '🚨 Em emergências' : '🚨 In Emergencies',
            phrases: [
                { en: 'Call 911!', pt: 'Ligue para a emergência!' },
                { en: 'Stop! Don\'t move!', pt: 'Pare! Não se mova!' },
                { en: 'Help me!', pt: 'Me ajude!' },
            ],
            color: 'bg-rose-50 border-rose-200',
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-emerald-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Volume2 className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-4xl shadow-lg border-2 border-emerald-400">📢</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Imperativo — O modo da Ação" : "Imperatives — The Action Mode"}
                        </h3>
                        <p className="text-emerald-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Imperativo é a forma mais direta do inglês. Sem sujeito, sem rodeios: apenas o verbo nu, dando ordens, conselhos ou instruções. 'Go!', 'Stop!', 'Listen!' — direto ao ponto.\""
                                : "\"The imperative is the most direct form in English. No subject, no fuss: just the bare verb, giving orders, advice, or instructions. 'Go!', 'Stop!', 'Listen!' — straight to the point.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Structure Rule Card */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <h5 className="text-lg font-bold text-emerald-800">{isPortuguese ? 'Afirmativo ✅' : 'Affirmative ✅'}</h5>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-emerald-100 mb-3">
                        <p className="text-center font-black text-emerald-700 text-xl">Verb + complement</p>
                        <p className="text-center text-xs text-slate-400 mt-1">{isPortuguese ? 'Sem sujeito! Direto no verbo.' : 'No subject! Start with the verb.'}</p>
                    </div>
                    <button onClick={() => speak('Open the window.')} className="w-full text-left p-3 rounded-xl bg-white/70 hover:bg-white transition-all flex items-center gap-3 group">
                        <Volume2 className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 flex-shrink-0" />
                        <div>
                            <span className="font-bold text-emerald-800">Open the window.</span>
                            {isPortuguese && <span className="text-[11px] text-slate-400 block">Abra a janela.</span>}
                        </div>
                    </button>
                </div>
                <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-200">
                    <div className="flex items-center gap-3 mb-4">
                        <XCircle className="w-6 h-6 text-rose-600" />
                        <h5 className="text-lg font-bold text-rose-800">{isPortuguese ? 'Negativo 🚫' : 'Negative 🚫'}</h5>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-rose-100 mb-3">
                        <p className="text-center font-black text-rose-700 text-xl">Don't + verb</p>
                        <p className="text-center text-xs text-slate-400 mt-1">{isPortuguese ? 'Sempre "Don\'t" antes do verbo.' : 'Always "Don\'t" before the verb.'}</p>
                    </div>
                    <button onClick={() => speak("Don't close the window.")} className="w-full text-left p-3 rounded-xl bg-white/70 hover:bg-white transition-all flex items-center gap-3 group">
                        <Volume2 className="w-4 h-4 text-rose-400 group-hover:text-rose-600 flex-shrink-0" />
                        <div>
                            <span className="font-bold text-rose-800">Don't close the window.</span>
                            {isPortuguese && <span className="text-[11px] text-slate-400 block">Não feche a janela.</span>}
                        </div>
                    </button>
                </div>
            </div>

            {/* Affirmative Verbs Grid */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Zap className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? 'Verbos Essenciais do Imperativo' : 'Essential Imperative Verbs'}
                    </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {affirmativeVerbs.map((v, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(v.sentence)}
                            className="group p-5 bg-white rounded-2xl border-2 border-transparent hover:border-emerald-200 shadow-sm hover:shadow-md transition-all text-left"
                        >
                            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{v.icon}</span>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-black text-slate-800 text-lg">{v.verb}</span>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">{v.ipa}</span>
                            </div>
                            <p className="text-xs text-emerald-600 font-medium">{v.sentence}</p>
                            {isPortuguese && <p className="text-[10px] text-slate-400 mt-1">{v.sentPt}</p>}
                            {isPortuguese && <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight mt-1">{v.pt}</div>}
                        </button>
                    ))}
                </div>
            </section>

            {/* Negative Examples */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><XCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? 'Imperativo Negativo na Prática' : 'Negative Imperatives in Practice'}
                    </h4>
                </div>
                <div className="grid gap-3">
                    {negativeExamples.map((ex, idx) => (
                        <button key={idx} onClick={() => speak(ex.en)} className="w-full text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-md transition-all flex items-center gap-4 group">
                            <span className="text-2xl">{ex.icon}</span>
                            <div className="flex-1">
                                <span className="font-bold text-rose-700 text-sm">{ex.en}</span>
                                {isPortuguese && <span className="text-[11px] text-slate-400 block">{ex.pt}</span>}
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full font-medium hidden sm:block">{ex.context}</span>
                            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Situations */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><MapPin className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? 'Situações do Dia a Dia' : 'Everyday Situations'}
                    </h4>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {situations.map((sit, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border-2 ${sit.color}`}>
                            <h5 className="font-bold text-slate-800 mb-4 text-lg">{sit.title}</h5>
                            <div className="space-y-2">
                                {sit.phrases.map((ph, i) => (
                                    <button key={i} onClick={() => speak(ph.en)} className="w-full text-left p-3 rounded-xl bg-white/70 hover:bg-white transition-all flex items-center gap-2 group">
                                        <Volume2 className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 flex-shrink-0" />
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">{ph.en}</span>
                                            {isPortuguese && <span className="text-[10px] text-slate-400 block">{ph.pt}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Polite Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">🤝</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Gentileza' : 'Politeness Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "Adicionar \"please\" transforma uma ordem em um pedido educado. Compare: \"Sit down!\" (ordem) vs \"Sit down, please.\" (pedido gentil). Em contextos formais, sempre use \"please\"!"
                            : "Adding \"please\" transforms a command into a polite request. Compare: \"Sit down!\" (command) vs \"Sit down, please.\" (polite request). In formal contexts, always use \"please\"!"
                        }
                    </p>
                    <button onClick={() => speak('Could you open the door, please?')} className="mt-3 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 transition-all flex items-center gap-2 text-sm font-bold text-amber-800">
                        <Volume2 className="w-4 h-4" /> {isPortuguese ? '"Could you open the door, please?" — Ouça' : '"Could you open the door, please?" — Listen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- M7: CAN / CAN'T ---
const CanCantLesson = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const skills = [
        { skill: 'Swim', ipa: '/swɪm/', pt: 'Nadar', icon: '🏊', can: 'I can swim.', cant: "I can't swim.", canPt: 'Eu sei nadar.', cantPt: 'Eu não sei nadar.' },
        { skill: 'Cook', ipa: '/kʊk/', pt: 'Cozinhar', icon: '👨‍🍳', can: 'She can cook.', cant: "She can't cook.", canPt: 'Ela sabe cozinhar.', cantPt: 'Ela não sabe cozinhar.' },
        { skill: 'Drive', ipa: '/draɪv/', pt: 'Dirigir', icon: '🚗', can: 'He can drive.', cant: "He can't drive.", canPt: 'Ele sabe dirigir.', cantPt: 'Ele não sabe dirigir.' },
        { skill: 'Speak English', ipa: '/spiːk/', pt: 'Falar Inglês', icon: '🗣️', can: 'We can speak English.', cant: "We can't speak French.", canPt: 'Nós sabemos falar inglês.', cantPt: 'Nós não sabemos falar francês.' },
        { skill: 'Play guitar', ipa: '/pleɪ/', pt: 'Tocar violão', icon: '🎸', can: 'They can play guitar.', cant: "They can't play piano.", canPt: 'Eles sabem tocar violão.', cantPt: 'Eles não sabem tocar piano.' },
        { skill: 'Dance', ipa: '/dæns/', pt: 'Dançar', icon: '💃', can: 'I can dance.', cant: "I can't dance well.", canPt: 'Eu sei dançar.', cantPt: 'Eu não sei dançar bem.' },
    ];

    const usages = [
        {
            title: isPortuguese ? '💪 Habilidade' : '💪 Ability',
            desc: isPortuguese ? 'Algo que você sabe ou consegue fazer' : 'Something you are able to do',
            examples: [
                { en: 'I can speak two languages.', pt: 'Eu sei falar dois idiomas.' },
                { en: 'She can run very fast.', pt: 'Ela consegue correr muito rápido.' },
            ],
            color: 'bg-emerald-50 border-emerald-200',
            iconColor: 'text-emerald-600',
        },
        {
            title: isPortuguese ? '🔓 Permissão' : '🔓 Permission',
            desc: isPortuguese ? 'Pedir ou dar permissão (informal)' : 'Asking or giving permission (informal)',
            examples: [
                { en: 'Can I go to the bathroom?', pt: 'Posso ir ao banheiro?' },
                { en: 'You can sit here.', pt: 'Você pode sentar aqui.' },
            ],
            color: 'bg-blue-50 border-blue-200',
            iconColor: 'text-blue-600',
        },
        {
            title: isPortuguese ? '🙏 Pedidos' : '🙏 Requests',
            desc: isPortuguese ? 'Pedir algo a alguém' : 'Asking someone to do something',
            examples: [
                { en: 'Can you help me?', pt: 'Você pode me ajudar?' },
                { en: 'Can you open the window?', pt: 'Você pode abrir a janela?' },
            ],
            color: 'bg-violet-50 border-violet-200',
            iconColor: 'text-violet-600',
        },
    ];

    const questions = [
        { q: 'Can you swim?', a1: 'Yes, I can.', a2: "No, I can't.", pt: 'Você sabe nadar?', icon: '🏊' },
        { q: 'Can she drive?', a1: 'Yes, she can.', a2: "No, she can't.", pt: 'Ela sabe dirigir?', icon: '🚗' },
        { q: 'Can they play football?', a1: 'Yes, they can.', a2: "No, they can't.", pt: 'Eles sabem jogar futebol?', icon: '⚽' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-violet-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-4xl shadow-lg border-2 border-violet-400">⚡</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Can / Can't — Habilidade e Possibilidade" : "Can / Can't — Ability & Possibility"}
                        </h3>
                        <p className="text-violet-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"'Can' é um dos verbos mais versáteis do inglês. Com uma única palavra você expressa habilidade, permissão e faz pedidos. E a melhor parte? A estrutura nunca muda — sem 's', sem 'to', sem conjugação.\""
                                : "\"'Can' is one of the most versatile words in English. With just one word you express ability, permission, and make requests. And the best part? The structure never changes — no 's', no 'to', no conjugation.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Structure Cards */}
            <div className="grid md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
                    <div className="text-3xl mb-3">✅</div>
                    <p className="font-black text-emerald-700 text-lg mb-1">Subject + can + verb</p>
                    <button onClick={() => speak('I can swim.')} className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1 mx-auto font-medium">
                        <Volume2 className="w-3 h-3" /> I can swim.
                    </button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Eu sei/consigo nadar.</p>}
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center">
                    <div className="text-3xl mb-3">❌</div>
                    <p className="font-black text-rose-700 text-lg mb-1">Subject + can't + verb</p>
                    <button onClick={() => speak("I can't fly.")} className="text-sm text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 mx-auto font-medium">
                        <Volume2 className="w-3 h-3" /> I can't fly.
                    </button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Eu não consigo voar.</p>}
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center">
                    <div className="text-3xl mb-3">❓</div>
                    <p className="font-black text-blue-700 text-lg mb-1">Can + subject + verb?</p>
                    <button onClick={() => speak('Can you help me?')} className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 mx-auto font-medium">
                        <Volume2 className="w-3 h-3" /> Can you help me?
                    </button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Você pode me ajudar?</p>}
                </div>
            </div>

            {/* Pronunciation Note */}
            <div className="p-6 rounded-2xl bg-slate-800 text-white flex flex-col md:flex-row items-start gap-5">
                <div className="text-3xl">🎙️</div>
                <div className="flex-1">
                    <h5 className="font-bold text-lg mb-3">{isPortuguese ? 'Fique atento à pronúncia!' : 'Watch the pronunciation!'}</h5>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-black text-emerald-400">CAN</span>
                                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300">/kæn/ → /kən/</span>
                            </div>
                            <p className="text-xs text-slate-300">
                                {isPortuguese
                                    ? "Em frases afirmativas, pronuncia-se fraco: /kən/, quase um 'kn'. Ex: I kən swim."
                                    : "In affirmative sentences, it's pronounced weak: /kən/, almost like 'kn'. Ex: I kən swim."
                                }
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-black text-rose-400">CAN'T</span>
                                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300">/kænt/</span>
                            </div>
                            <p className="text-xs text-slate-300">
                                {isPortuguese
                                    ? "Sempre forte e claro: /kænt/. O 't' no final pode ser quase silencioso no inglês americano, mas o 'æ' é longo e forte."
                                    : "Always strong and clear: /kænt/. The final 't' may be almost silent in American English, but the 'æ' is long and strong."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Grid */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><Zap className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? 'Habilidades — Can & Can\'t' : 'Skills — Can & Can\'t'}
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((s, idx) => (
                        <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{s.icon}</span>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-black text-slate-800 text-lg">{s.skill}</span>
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">{s.ipa}</span>
                                    </div>
                                    {isPortuguese && <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">{s.pt}</div>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <button onClick={() => speak(s.can)} className="w-full text-left p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-2 group">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <span className="text-sm font-bold text-emerald-700">{s.can}</span>
                                        {isPortuguese && <span className="text-[10px] text-slate-400 block">{s.canPt}</span>}
                                    </div>
                                </button>
                                <button onClick={() => speak(s.cant)} className="w-full text-left p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-all flex items-center gap-2 group">
                                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                    <div>
                                        <span className="text-sm font-bold text-rose-700">{s.cant}</span>
                                        {isPortuguese && <span className="text-[10px] text-slate-400 block">{s.cantPt}</span>}
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Usage Types */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? 'Os 3 usos do Can' : 'The 3 Uses of Can'}
                    </h4>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {usages.map((u, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border-2 ${u.color}`}>
                            <h5 className={`text-lg font-bold ${u.iconColor} mb-1`}>{u.title}</h5>
                            <p className="text-xs text-slate-500 mb-4">{u.desc}</p>
                            <div className="space-y-2">
                                {u.examples.map((ex, i) => (
                                    <button key={i} onClick={() => speak(ex.en)} className="w-full text-left p-3 rounded-xl bg-white/70 hover:bg-white transition-all flex items-center gap-2 group">
                                        <Volume2 className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 flex-shrink-0" />
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">{ex.en}</span>
                                            {isPortuguese && <span className="text-[10px] text-slate-400 block">{ex.pt}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Q&A Practice */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><MessageCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? 'Perguntas e Respostas Curtas' : 'Short Questions & Answers'}
                    </h4>
                </div>
                <div className="grid gap-4">
                    {questions.map((item, idx) => (
                        <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{item.icon}</span>
                                <button onClick={() => speak(item.q)} className="flex items-center gap-2 group">
                                    <span className="font-bold text-blue-700 text-lg">{item.q}</span>
                                    <Volume2 className="w-4 h-4 text-blue-300 group-hover:text-blue-600" />
                                </button>
                                {isPortuguese && <span className="text-[11px] text-slate-400">({item.pt})</span>}
                            </div>
                            <div className="flex flex-wrap gap-3 pl-10">
                                <button onClick={() => speak(item.a1)} className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-all flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> {item.a1}
                                </button>
                                <button onClick={() => speak(item.a2)} className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm hover:bg-rose-100 transition-all flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> {item.a2}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Golden Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "\"Can\" é um modal verb — ele NUNCA muda! Não existe \"cans\", \"canned\" (como verbo modal), ou \"to can\". É sempre: can + verbo na forma base, sem exceção. She can swim ✅ She cans swim ❌"
                            : "\"Can\" is a modal verb — it NEVER changes! There's no \"cans\", \"canned\" (as a modal), or \"to can\". It's always: can + base verb, no exceptions. She can swim ✅ She cans swim ❌"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// M8: THE PAST (PRE-INTERMEDIATE)
// ============================================================

// --- M8: DATES & ORDINAL NUMBERS ---
const DatesOrdinalNumbers = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const ordinals = [
        { n: '1st', word: 'First', ipa: '/fɜːrst/', pt: 'Primeiro(a)', icon: '🥇' },
        { n: '2nd', word: 'Second', ipa: '/ˈsɛkənd/', pt: 'Segundo(a)', icon: '🥈' },
        { n: '3rd', word: 'Third', ipa: '/θɜːrd/', pt: 'Terceiro(a)', icon: '🥉' },
        { n: '4th', word: 'Fourth', ipa: '/fɔːrθ/', pt: 'Quarto(a)', icon: '4️⃣' },
        { n: '5th', word: 'Fifth', ipa: '/fɪfθ/', pt: 'Quinto(a)', icon: '5️⃣' },
        { n: '6th', word: 'Sixth', ipa: '/sɪksθ/', pt: 'Sexto(a)', icon: '6️⃣' },
        { n: '7th', word: 'Seventh', ipa: '/ˈsɛvənθ/', pt: 'Sétimo(a)', icon: '7️⃣' },
        { n: '8th', word: 'Eighth', ipa: '/eɪtθ/', pt: 'Oitavo(a)', icon: '8️⃣' },
        { n: '9th', word: 'Ninth', ipa: '/naɪnθ/', pt: 'Nono(a)', icon: '9️⃣' },
        { n: '10th', word: 'Tenth', ipa: '/tɛnθ/', pt: 'Décimo(a)', icon: '🔟' },
        { n: '11th', word: 'Eleventh', ipa: '/ɪˈlɛvənθ/', pt: 'Décimo primeiro', icon: '1️⃣1️⃣' },
        { n: '12th', word: 'Twelfth', ipa: '/twɛlfθ/', pt: 'Décimo segundo', icon: '1️⃣2️⃣' },
        { n: '20th', word: 'Twentieth', ipa: '/ˈtwɛntiəθ/', pt: 'Vigésimo', icon: '2️⃣0️⃣' },
        { n: '21st', word: 'Twenty-first', ipa: '/ˌtwɛntiˈfɜːrst/', pt: 'Vigésimo primeiro', icon: '2️⃣1️⃣' },
        { n: '30th', word: 'Thirtieth', ipa: '/ˈθɜːrtiəθ/', pt: 'Trigésimo', icon: '3️⃣0️⃣' },
        { n: '31st', word: 'Thirty-first', ipa: '/ˌθɜːrtiˈfɜːrst/', pt: 'Trigésimo primeiro', icon: '3️⃣1️⃣' },
        { n: '40th', word: 'Fortieth', ipa: '/ˈfɔːrtiəθ/', pt: 'Quadragésimo', icon: '4️⃣0️⃣' },
        { n: '50th', word: 'Fiftieth', ipa: '/ˈfɪftiəθ/', pt: 'Quinquagésimo', icon: '5️⃣0️⃣' },
        { n: '60th', word: 'Sixtieth', ipa: '/ˈsɪkstiəθ/', pt: 'Sexagésimo', icon: '6️⃣0️⃣' },
        { n: '70th', word: 'Seventieth', ipa: '/ˈsɛvəntiəθ/', pt: 'Septuagésimo', icon: '7️⃣0️⃣' },
        { n: '80th', word: 'Eightieth', ipa: '/ˈeɪtiəθ/', pt: 'Octogésimo', icon: '8️⃣0️⃣' },
        { n: '90th', word: 'Ninetieth', ipa: '/ˈnaɪntiəθ/', pt: 'Nonagésimo', icon: '9️⃣0️⃣' },
        { n: '100th', word: 'One hundredth', ipa: '/wʌn ˈhʌndrədθ/', pt: 'Centésimo', icon: '💯' },
        { n: '1,000th', word: 'One thousandth', ipa: '/wʌn ˈθaʊzəndθ/', pt: 'Milésimo', icon: '🔢' },
    ];

    const months = [
        { en: 'January', short: 'Jan', ipa: '/ˈdʒænjueri/', pt: 'Janeiro', icon: '❄️' },
        { en: 'February', short: 'Feb', ipa: '/ˈfɛbrueri/', pt: 'Fevereiro', icon: '💕' },
        { en: 'March', short: 'Mar', ipa: '/mɑːrtʃ/', pt: 'Março', icon: '🌱' },
        { en: 'April', short: 'Apr', ipa: '/ˈeɪprəl/', pt: 'Abril', icon: '🌧️' },
        { en: 'May', short: 'May', ipa: '/meɪ/', pt: 'Maio', icon: '🌸' },
        { en: 'June', short: 'Jun', ipa: '/dʒuːn/', pt: 'Junho', icon: '☀️' },
        { en: 'July', short: 'Jul', ipa: '/dʒʊˈlaɪ/', pt: 'Julho', icon: '🏖️' },
        { en: 'August', short: 'Aug', ipa: '/ˈɔːɡəst/', pt: 'Agosto', icon: '🌻' },
        { en: 'September', short: 'Sep', ipa: '/sɛpˈtɛmbər/', pt: 'Setembro', icon: '🍂' },
        { en: 'October', short: 'Oct', ipa: '/ɑːkˈtoʊbər/', pt: 'Outubro', icon: '🎃' },
        { en: 'November', short: 'Nov', ipa: '/noʊˈvɛmbər/', pt: 'Novembro', icon: '🍁' },
        { en: 'December', short: 'Dec', ipa: '/dɪˈsɛmbər/', pt: 'Dezembro', icon: '🎄' },
    ];

    const suffixRules = [
        { rule: isPortuguese ? 'Terminados em 1 (exceto 11)' : 'Ending in 1 (except 11)', suffix: 'st', examples: '1st, 21st, 31st', color: 'bg-indigo-50 border-indigo-200' },
        { rule: isPortuguese ? 'Terminados em 2 (exceto 12)' : 'Ending in 2 (except 12)', suffix: 'nd', examples: '2nd, 22nd, 32nd', color: 'bg-blue-50 border-blue-200' },
        { rule: isPortuguese ? 'Terminados em 3 (exceto 13)' : 'Ending in 3 (except 13)', suffix: 'rd', examples: '3rd, 23rd, 33rd', color: 'bg-emerald-50 border-emerald-200' },
        { rule: isPortuguese ? 'Todos os outros' : 'All others', suffix: 'th', examples: '4th, 5th, 11th, 12th, 13th, 20th...', color: 'bg-amber-50 border-amber-200' },
    ];

    const dateExamples = [
        { en: 'January 1st', spoken: 'January first', pt: '1º de janeiro', context: isPortuguese ? "Ano Novo" : "New Year" },
        { en: 'February 14th', spoken: 'February fourteenth', pt: '14 de fevereiro', context: isPortuguese ? "Dia dos Namorados (EUA)" : "Valentine's Day" },
        { en: 'July 4th', spoken: 'July fourth', pt: '4 de julho', context: isPortuguese ? "Independência dos EUA" : "US Independence Day" },
        { en: 'December 25th', spoken: 'December twenty-fifth', pt: '25 de dezembro', context: isPortuguese ? "Natal" : "Christmas" },
        { en: 'October 31st', spoken: 'October thirty-first', pt: '31 de outubro', context: isPortuguese ? "Halloween" : "Halloween" },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-teal-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Calendar className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-4xl shadow-lg border-2 border-teal-400">📅</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Datas e Números Ordinais" : "Dates & Ordinal Numbers"}
                        </h3>
                        <p className="text-teal-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Em inglês, datas usam números ORDINAIS, não cardinais. Não dizemos 'January five', dizemos 'January fifth'. Parece simples, mas esse detalhe separa o iniciante do falante confiante.\""
                                : "\"In English, dates use ORDINAL numbers, not cardinal ones. We don't say 'January five', we say 'January fifth'. It seems simple, but this detail separates the beginner from the confident speaker.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Suffix Rules */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Hash className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '📐 Regras dos Sufixos' : '📐 Suffix Rules'}
                    </h4>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {suffixRules.map((r, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border-2 ${r.color}`}>
                            <div className="text-3xl font-black text-center mb-2 text-slate-800">-{r.suffix}</div>
                            <p className="text-xs text-slate-600 text-center font-medium mb-2">{r.rule}</p>
                            <p className="text-[10px] text-slate-400 text-center font-mono">{r.examples}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ordinal Numbers Grid */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg text-teal-600"><List className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '🔢 Números Ordinais' : '🔢 Ordinal Numbers'}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {ordinals.map((o, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(o.word)}
                            className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-teal-200 shadow-sm hover:shadow-md transition-all text-left overflow-hidden"
                        >
                            <div className="flex items-start gap-3 mb-2">
                                <span className="text-xl flex-shrink-0">{o.icon}</span>
                                <div className="min-w-0">
                                    <span className="font-black text-teal-700 text-lg block">{o.n}</span>
                                    <span className="text-sm text-slate-500 font-medium block break-words">{o.word}</span>
                                    <span className="text-[9px] font-mono text-slate-400">{o.ipa}</span>
                                </div>
                            </div>
                            {isPortuguese && <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight break-words">{o.pt}</div>}
                        </button>
                    ))}
                </div>
            </section>

            {/* Months */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><CalendarDays className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '🗓️ Meses do Ano' : '🗓️ Months of the Year'}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {months.map((m, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(m.en)}
                            className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-orange-200 shadow-sm hover:shadow-md transition-all text-center"
                        >
                            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{m.icon}</span>
                            <div className="font-bold text-slate-800">{m.en}</div>
                            <div className="text-[9px] font-mono text-slate-400">{m.ipa}</div>
                            {isPortuguese && <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight mt-1">{m.pt}</div>}
                        </button>
                    ))}
                </div>
            </section>

            {/* Date Formats */}
            <section className="bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-500/20 rounded-lg"><Globe className="w-6 h-6 text-teal-400" /></div>
                        <h4 className="text-2xl font-bold">
                            {isPortuguese ? '🌍 Formatos de Data' : '🌍 Date Formats'}
                        </h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">🇺🇸</span>
                                <span className="font-bold text-lg">{isPortuguese ? 'Americano' : 'American'}</span>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/10 mb-2">
                                <span className="font-black text-xl text-teal-300">Month + Day</span>
                            </div>
                            <button onClick={() => speak('January fifth, twenty twenty-five')} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 group">
                                <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-teal-400" />
                                <span className="text-sm">January 5th, 2025 → <span className="text-teal-300 font-bold">"January fifth"</span></span>
                            </button>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">🇬🇧</span>
                                <span className="font-bold text-lg">{isPortuguese ? 'Britânico' : 'British'}</span>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/10 mb-2">
                                <span className="font-black text-xl text-amber-300">The + Day + of + Month</span>
                            </div>
                            <button onClick={() => speak('The fifth of January, twenty twenty-five')} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 group">
                                <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                                <span className="text-sm">5th January 2025 → <span className="text-amber-300 font-bold">"The fifth of January"</span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Famous Dates */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Star className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '🎉 Datas Importantes — Pratique!' : '🎉 Important Dates — Practice!'}
                    </h4>
                </div>
                <div className="grid gap-3">
                    {dateExamples.map((d, idx) => (
                        <button key={idx} onClick={() => speak(d.spoken)} className="w-full text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all flex items-center gap-4 group">
                            <span className="text-2xl">🗓️</span>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-slate-800">{d.en}</span>
                                    <span className="text-[10px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-medium">{d.context}</span>
                                </div>
                                <span className="text-xs text-teal-600 font-medium">"{d.spoken}"</span>
                                {isPortuguese && <span className="text-[11px] text-slate-400 block">{d.pt}</span>}
                            </div>
                            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-teal-500 flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Golden Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "Na escrita, usamos o número + sufixo (1st, 2nd, 3rd). Na fala, sempre dizemos a palavra completa: 'first', 'second', 'third'. Nunca diga os números isolados para datas! 'January five' ❌ → 'January fifth' ✅"
                            : "In writing, we use the number + suffix (1st, 2nd, 3rd). When speaking, always say the full word: 'first', 'second', 'third'. Never say plain numbers for dates! 'January five' ❌ → 'January fifth' ✅"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- M8: TIME EXPRESSIONS FOR PAST ---
const TimeExpressionsPast = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const expressions = [
        { en: 'Yesterday', ipa: '/ˈjɛstərdeɪ/', pt: 'Ontem', icon: '⬅️', example: 'I worked yesterday.', exPt: 'Eu trabalhei ontem.', color: 'bg-indigo-50' },
        { en: 'Last night', ipa: '/læst naɪt/', pt: 'Ontem à noite', icon: '🌙', example: 'I watched a movie last night.', exPt: 'Eu assisti um filme ontem à noite.', color: 'bg-violet-50' },
        { en: 'Last week', ipa: '/læst wiːk/', pt: 'Semana passada', icon: '📅', example: 'She traveled last week.', exPt: 'Ela viajou semana passada.', color: 'bg-blue-50' },
        { en: 'Last month', ipa: '/læst mʌnθ/', pt: 'Mês passado', icon: '🗓️', example: 'We moved last month.', exPt: 'Nós nos mudamos mês passado.', color: 'bg-sky-50' },
        { en: 'Last year', ipa: '/læst jɪr/', pt: 'Ano passado', icon: '📆', example: 'They got married last year.', exPt: 'Eles se casaram ano passado.', color: 'bg-teal-50' },
        { en: 'Two days ago', ipa: '/tuː deɪz əˈɡoʊ/', pt: 'Dois dias atrás', icon: '⏪', example: 'He called two days ago.', exPt: 'Ele ligou dois dias atrás.', color: 'bg-amber-50' },
        { en: 'A week ago', ipa: '/ə wiːk əˈɡoʊ/', pt: 'Uma semana atrás', icon: '🔙', example: 'I started a week ago.', exPt: 'Eu comecei uma semana atrás.', color: 'bg-orange-50' },
        { en: 'Three months ago', ipa: '/θriː mʌnθs əˈɡoʊ/', pt: 'Três meses atrás', icon: '⏮️', example: 'She left three months ago.', exPt: 'Ela partiu três meses atrás.', color: 'bg-rose-50' },
        { en: 'In 2020', ipa: '/ɪn ˌtwɛntiˈtwɛnti/', pt: 'Em 2020', icon: '📌', example: 'The pandemic started in 2020.', exPt: 'A pandemia começou em 2020.', color: 'bg-slate-50' },
        { en: 'When I was a child', ipa: '/wɛn aɪ wɒz/', pt: 'Quando eu era criança', icon: '👶', example: 'When I was a child, I lived in Brazil.', exPt: 'Quando eu era criança, eu morava no Brasil.', color: 'bg-pink-50' },
    ];

    const patterns = [
        {
            name: 'LAST + time',
            desc: isPortuguese ? 'Usado com períodos definidos (night, week, month, year, Monday...)' : 'Used with defined periods (night, week, month, year, Monday...)',
            examples: ['Last night', 'Last week', 'Last Monday', 'Last summer'],
            color: 'bg-indigo-50 border-indigo-200',
            icon: '⬅️',
        },
        {
            name: 'time + AGO',
            desc: isPortuguese ? 'Usado com quantidade de tempo (2 days, a week, 3 years...)' : 'Used with amounts of time (2 days, a week, 3 years...)',
            examples: ['Two days ago', 'A month ago', 'Five years ago', 'A long time ago'],
            color: 'bg-amber-50 border-amber-200',
            icon: '⏪',
        },
        {
            name: 'IN + year',
            desc: isPortuguese ? 'Usado com anos específicos' : 'Used with specific years',
            examples: ['In 1990', 'In 2015', 'In 2020'],
            color: 'bg-emerald-50 border-emerald-200',
            icon: '📌',
        },
        {
            name: 'YESTERDAY',
            desc: isPortuguese ? 'Sozinho ou com morning/afternoon/evening' : 'Alone or with morning/afternoon/evening',
            examples: ['Yesterday', 'Yesterday morning', 'Yesterday afternoon'],
            color: 'bg-violet-50 border-violet-200',
            icon: '📆',
        },
    ];

    const timeline = [
        { label: isPortuguese ? '5 anos atrás' : '5 years ago', pos: 5 },
        { label: isPortuguese ? 'Ano passado' : 'Last year', pos: 20 },
        { label: isPortuguese ? 'Mês passado' : 'Last month', pos: 45 },
        { label: isPortuguese ? 'Semana passada' : 'Last week', pos: 65 },
        { label: isPortuguese ? 'Ontem' : 'Yesterday', pos: 85 },
        { label: isPortuguese ? 'AGORA' : 'NOW', pos: 98 },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-violet-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-4xl shadow-lg border-2 border-violet-400">⏰</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Expressões de Tempo no Passado" : "Time Expressions for the Past"}
                        </h3>
                        <p className="text-violet-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Antes de dominar o Past Simple, você precisa saber QUANDO as coisas aconteceram. 'Yesterday', 'last week', 'two days ago' — essas expressões são o GPS temporal do inglês.\""
                                : "\"Before mastering the Past Simple, you need to know WHEN things happened. 'Yesterday', 'last week', 'two days ago' — these expressions are the time GPS of English.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Timeline */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><ArrowRight className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '📊 Linha do Tempo' : '📊 Timeline'}
                    </h4>
                </div>
                <div className="relative bg-white rounded-2xl border border-slate-100 p-6 pt-12 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-violet-200 via-indigo-300 to-teal-400 rounded-full relative">
                        {timeline.map((t, idx) => (
                            <div key={idx} className="absolute" style={{ left: `${t.pos}%`, transform: 'translateX(-50%)' }}>
                                <div className={`w-3 h-3 rounded-full ${idx === timeline.length - 1 ? 'bg-teal-500 ring-4 ring-teal-100' : 'bg-violet-500'} -mt-0.5`}></div>
                                <div className={`text-[9px] font-bold mt-2 whitespace-nowrap ${idx === timeline.length - 1 ? 'text-teal-600' : 'text-slate-500'}`}>{t.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8 text-xs text-slate-400">
                        {isPortuguese ? '⬅️ PASSADO ————————— PRESENTE ➡️' : '⬅️ PAST ————————— PRESENT ➡️'}
                    </div>
                </div>
            </section>

            {/* Patterns */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><BookOpen className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '📐 Os 4 Padrões' : '📐 The 4 Patterns'}
                    </h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                    {patterns.map((p, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border-2 ${p.color}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{p.icon}</span>
                                <h5 className="text-lg font-black text-slate-800">{p.name}</h5>
                            </div>
                            <p className="text-xs text-slate-500 mb-3">{p.desc}</p>
                            <div className="flex flex-wrap gap-2">
                                {p.examples.map((ex, i) => (
                                    <button key={i} onClick={() => speak(ex)} className="px-3 py-1.5 rounded-lg bg-white text-sm font-medium text-slate-700 hover:shadow-md transition-all">
                                        {ex}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Full Expressions */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg text-teal-600"><MessageCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '🗣️ Expressões com Exemplos' : '🗣️ Expressions with Examples'}
                    </h4>
                </div>
                <div className="grid gap-3">
                    {expressions.map((e, idx) => (
                        <button key={idx} onClick={() => speak(e.example)} className={`w-full text-left p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-all flex items-center gap-4 group ${e.color}`}>
                            <span className="text-2xl flex-shrink-0">{e.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-0.5">
                                    <span className="font-black text-slate-800">{e.en}</span>
                                    <span className="text-[9px] font-mono text-slate-400">{e.ipa}</span>
                                </div>
                                <span className="text-sm text-indigo-600 font-medium">{e.example}</span>
                                {isPortuguese && <span className="text-[11px] text-slate-400 block">{e.exPt}</span>}
                                {isPortuguese && <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tight">{e.pt}</span>}
                            </div>
                            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Common Mistake */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "'Ago' SEMPRE vem DEPOIS da quantidade de tempo: 'Two days ago' ✅ 'Ago two days' ❌. Já 'Last' vem ANTES do período: 'Last week' ✅ 'Week last' ❌. E nunca misture os dois: 'Last two days ago' ❌"
                            : "'Ago' ALWAYS comes AFTER the amount of time: 'Two days ago' ✅ 'Ago two days' ❌. And 'Last' comes BEFORE the period: 'Last week' ✅ 'Week last' ❌. Never mix both: 'Last two days ago' ❌"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- M8: PAST SIMPLE — VERB TO BE ---
const PastSimpleLesson = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const wasWere = [
        { subject: 'I', verb: 'was', ipa: '/wɒz/', pt: 'eu era/estava', icon: '🙋', example: 'I was tired.', exPt: 'Eu estava cansado.' },
        { subject: 'You', verb: 'were', ipa: '/wɜːr/', pt: 'você era/estava', icon: '👤', example: 'You were right.', exPt: 'Você estava certo.' },
        { subject: 'He', verb: 'was', ipa: '/wɒz/', pt: 'ele era/estava', icon: '👦', example: 'He was a teacher.', exPt: 'Ele era professor.' },
        { subject: 'She', verb: 'was', ipa: '/wɒz/', pt: 'ela era/estava', icon: '👧', example: 'She was happy.', exPt: 'Ela estava feliz.' },
        { subject: 'It', verb: 'was', ipa: '/wɒz/', pt: 'era/estava', icon: '📦', example: 'It was cold.', exPt: 'Estava frio.' },
        { subject: 'We', verb: 'were', ipa: '/wɜːr/', pt: 'nós éramos/estávamos', icon: '👥', example: 'We were friends.', exPt: 'Nós éramos amigos.' },
        { subject: 'They', verb: 'were', ipa: '/wɜːr/', pt: 'eles eram/estavam', icon: '👫', example: 'They were at home.', exPt: 'Eles estavam em casa.' },
    ];

    const negativeExamples = [
        { en: "I wasn't ready.", pt: 'Eu não estava pronto.', icon: '🙅' },
        { en: "You weren't there.", pt: 'Você não estava lá.', icon: '❌' },
        { en: "She wasn't angry.", pt: 'Ela não estava com raiva.', icon: '😌' },
        { en: "We weren't late.", pt: 'Não estávamos atrasados.', icon: '⏰' },
        { en: "They weren't happy.", pt: 'Eles não estavam felizes.', icon: '😔' },
    ];

    const questions = [
        { q: 'Were you at the party?', a1: 'Yes, I was.', a2: "No, I wasn't.", pt: 'Você estava na festa?', icon: '🎉' },
        { q: 'Was she a doctor?', a1: 'Yes, she was.', a2: "No, she wasn't.", pt: 'Ela era médica?', icon: '👩‍⚕️' },
        { q: 'Were they students?', a1: 'Yes, they were.', a2: "No, they weren't.", pt: 'Eles eram estudantes?', icon: '🎓' },
        { q: 'Was it expensive?', a1: 'Yes, it was.', a2: "No, it wasn't.", pt: 'Era caro?', icon: '💰' },
    ];

    const bornExamples = [
        { en: 'I was born in 1995.', pt: 'Eu nasci em 1995.', icon: '👶' },
        { en: 'She was born in Brazil.', pt: 'Ela nasceu no Brasil.', icon: '🇧🇷' },
        { en: 'Where were you born?', pt: 'Onde você nasceu?', icon: '🌍' },
        { en: 'He was born on March 10th.', pt: 'Ele nasceu em 10 de março.', icon: '🎂' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Senior Teacher Intro */}
            <div className="relative p-8 rounded-[2rem] bg-rose-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><IterationCw className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center text-4xl shadow-lg border-2 border-rose-400">⏳</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Past Simple: Verbo To Be" : "Past Simple: Verb To Be"}
                        </h3>
                        <p className="text-rose-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"O 'was/were' é o verbo To Be no passado. Se no presente dizemos 'I am', no passado dizemos 'I was'. É o primeiro passo para falar sobre o passado em inglês. Apenas duas formas: WAS para I/he/she/it e WERE para you/we/they.\""
                                : "\"'Was/were' is the verb To Be in the past. If in the present we say 'I am', in the past we say 'I was'. It's the first step to talking about the past in English. Just two forms: WAS for I/he/she/it and WERE for you/we/they.\""
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Structure Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-center">
                    <div className="text-3xl mb-3">👤</div>
                    <p className="font-black text-indigo-700 text-2xl mb-2">WAS</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {['I', 'He', 'She', 'It'].map(s => (
                            <span key={s} className="px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-bold text-sm">{s}</span>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500">{isPortuguese ? 'Singular (exceto You)' : 'Singular (except You)'}</p>
                    <button onClick={() => speak('I was happy yesterday.')} className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mx-auto font-medium">
                        <Volume2 className="w-3 h-3" /> I was happy yesterday.
                    </button>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
                    <div className="text-3xl mb-3">👥</div>
                    <p className="font-black text-emerald-700 text-2xl mb-2">WERE</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {['You', 'We', 'They'].map(s => (
                            <span key={s} className="px-3 py-1 bg-emerald-100 rounded-full text-emerald-700 font-bold text-sm">{s}</span>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500">{isPortuguese ? 'Plural + You' : 'Plural + You'}</p>
                    <button onClick={() => speak('We were at school.')} className="mt-3 text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1 mx-auto font-medium">
                        <Volume2 className="w-3 h-3" /> We were at school.
                    </button>
                </div>
            </div>

            {/* Affirmative Grid */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><CheckCircle2 className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '✅ Afirmativo' : '✅ Affirmative'}
                    </h4>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {wasWere.map((w, idx) => (
                        <button key={idx} onClick={() => speak(w.example)} className={`p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-all text-left group ${w.verb === 'was' ? 'bg-indigo-50/50' : 'bg-emerald-50/50'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xl">{w.icon}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-medium text-slate-500">{w.subject}</span>
                                    <span className={`font-black text-lg ${w.verb === 'was' ? 'text-indigo-700' : 'text-emerald-700'}`}>{w.verb}</span>
                                    <span className="text-[9px] font-mono text-slate-400">{w.ipa}</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 font-medium">{w.example}</p>
                            {isPortuguese && <p className="text-[11px] text-slate-400">{w.exPt}</p>}
                            {isPortuguese && <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-tight mt-1">{w.pt}</p>}
                        </button>
                    ))}
                </div>
            </section>

            {/* Negative */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><XCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '🚫 Negativo — wasn\'t / weren\'t' : '🚫 Negative — wasn\'t / weren\'t'}
                    </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200">
                        <div className="bg-white p-4 rounded-xl border border-rose-100 text-center mb-3">
                            <p className="font-black text-rose-700 text-xl">was not → wasn't</p>
                            <p className="text-[10px] text-slate-400 font-mono">/ˈwɒzənt/</p>
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200">
                        <div className="bg-white p-4 rounded-xl border border-rose-100 text-center mb-3">
                            <p className="font-black text-rose-700 text-xl">were not → weren't</p>
                            <p className="text-[10px] text-slate-400 font-mono">/wɜːrnt/</p>
                        </div>
                    </div>
                </div>
                <div className="grid gap-3">
                    {negativeExamples.map((n, idx) => (
                        <button key={idx} onClick={() => speak(n.en)} className="w-full text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-md transition-all flex items-center gap-4 group">
                            <span className="text-xl">{n.icon}</span>
                            <div className="flex-1">
                                <span className="font-bold text-rose-700 text-sm">{n.en}</span>
                                {isPortuguese && <span className="text-[11px] text-slate-400 block">{n.pt}</span>}
                            </div>
                            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-rose-500 flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Questions */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><HelpCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '❓ Perguntas e Respostas Curtas' : '❓ Questions & Short Answers'}
                    </h4>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
                    <p className="text-center font-black text-blue-700 text-xl">Was/Were + subject + complement?</p>
                    <p className="text-center text-xs text-slate-400 mt-1">{isPortuguese ? 'Inverta o verbo e o sujeito!' : 'Invert verb and subject!'}</p>
                </div>
                <div className="grid gap-4">
                    {questions.map((item, idx) => (
                        <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{item.icon}</span>
                                <button onClick={() => speak(item.q)} className="flex items-center gap-2 group">
                                    <span className="font-bold text-blue-700 text-lg">{item.q}</span>
                                    <Volume2 className="w-4 h-4 text-blue-300 group-hover:text-blue-600" />
                                </button>
                                {isPortuguese && <span className="text-[11px] text-slate-400">({item.pt})</span>}
                            </div>
                            <div className="flex flex-wrap gap-3 pl-10">
                                <button onClick={() => speak(item.a1)} className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-all flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> {item.a1}
                                </button>
                                <button onClick={() => speak(item.a2)} className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm hover:bg-rose-100 transition-all flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> {item.a2}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Born Section */}
            <section className="bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-500/20 rounded-lg"><Baby className="w-6 h-6 text-pink-400" /></div>
                        <h4 className="text-2xl font-bold">
                            {isPortuguese ? '👶 Was Born — Nascer' : '👶 Was Born — To Be Born'}
                        </h4>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">
                        {isPortuguese
                            ? "Em inglês, 'nascer' usa o verbo To Be + born: 'I was born' (eu nasci). Nunca 'I borned' ❌"
                            : "In English, 'to be born' uses the verb To Be + born: 'I was born'. Never 'I borned' ❌"
                        }
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {bornExamples.map((b, idx) => (
                            <button key={idx} onClick={() => speak(b.en)} className="text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 group">
                                <span className="text-xl">{b.icon}</span>
                                <div>
                                    <span className="font-bold text-sm">{b.en}</span>
                                    {isPortuguese && <span className="text-[11px] text-slate-400 block">{b.pt}</span>}
                                </div>
                                <Volume2 className="w-3 h-3 text-slate-500 group-hover:text-pink-400 ml-auto flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Golden Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "A regra é simples: WAS para singular (I/he/she/it), WERE para plural (you/we/they). 'You' sempre usa WERE, mesmo no singular! 'You was' ❌ → 'You were' ✅. E na negativa, basta adicionar 'not': wasn't / weren't."
                            : "The rule is simple: WAS for singular (I/he/she/it), WERE for plural (you/we/they). 'You' always uses WERE, even in singular! 'You was' ❌ → 'You were' ✅. And for negatives, just add 'not': wasn't / weren't."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- M8: PAST SIMPLE — REGULAR VERBS ---
const PastSimpleRegularVerbs = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const edRules = [
        { rule: isPortuguese ? 'Regra geral: + ed' : 'General rule: + ed', examples: ['work → worked', 'play → played', 'clean → cleaned', 'open → opened'], color: 'bg-indigo-50 border-indigo-200', suffix: '+ed' },
        { rule: isPortuguese ? 'Termina em -e: + d' : 'Ends in -e: + d', examples: ['live → lived', 'dance → danced', 'love → loved', 'arrive → arrived'], color: 'bg-emerald-50 border-emerald-200', suffix: '+d' },
        { rule: isPortuguese ? 'Consoante + y: troque y → ied' : 'Consonant + y: change y → ied', examples: ['study → studied', 'try → tried', 'carry → carried', 'cry → cried'], color: 'bg-amber-50 border-amber-200', suffix: 'y→ied' },
        { rule: isPortuguese ? 'CVC curto: dobre a consoante + ed' : 'Short CVC: double consonant + ed', examples: ['stop → stopped', 'plan → planned', 'drop → dropped', 'chat → chatted'], color: 'bg-rose-50 border-rose-200', suffix: '×2+ed' },
    ];
    const pronunciation = [
        { sound: '/t/', rule: isPortuguese ? 'Após sons surdos: k, p, f, s, sh, ch' : 'After voiceless sounds: k, p, f, s, sh, ch', examples: [{ verb: 'worked', ipa: '/wɜːrkt/', pt: 'trabalhou' }, { verb: 'stopped', ipa: '/stɑːpt/', pt: 'parou' }, { verb: 'washed', ipa: '/wɑːʃt/', pt: 'lavou' }, { verb: 'watched', ipa: '/wɑːtʃt/', pt: 'assistiu' }], color: 'bg-sky-50 border-sky-200', icon: '🔇' },
        { sound: '/d/', rule: isPortuguese ? 'Após sons sonoros: b, g, l, m, n, r, v, z + vogais' : 'After voiced sounds: b, g, l, m, n, r, v, z + vowels', examples: [{ verb: 'played', ipa: '/pleɪd/', pt: 'jogou' }, { verb: 'cleaned', ipa: '/kliːnd/', pt: 'limpou' }, { verb: 'lived', ipa: '/lɪvd/', pt: 'viveu' }, { verb: 'called', ipa: '/kɔːld/', pt: 'ligou' }], color: 'bg-emerald-50 border-emerald-200', icon: '🔊' },
        { sound: '/ɪd/', rule: isPortuguese ? 'Após sons de t ou d' : 'After t or d sounds', examples: [{ verb: 'wanted', ipa: '/ˈwɑːntɪd/', pt: 'quis' }, { verb: 'needed', ipa: '/ˈniːdɪd/', pt: 'precisou' }, { verb: 'started', ipa: '/ˈstɑːrtɪd/', pt: 'começou' }, { verb: 'decided', ipa: '/dɪˈsaɪdɪd/', pt: 'decidiu' }], color: 'bg-violet-50 border-violet-200', icon: '🗣️' },
    ];
    const commonVerbs = [
        { base: 'Work', past: 'Worked', ipa: '/wɜːrkt/', pt: 'Trabalhar', icon: '💼', ex: 'I worked yesterday.', exPt: 'Eu trabalhei ontem.' },
        { base: 'Study', past: 'Studied', ipa: '/ˈstʌdid/', pt: 'Estudar', icon: '📚', ex: 'She studied all night.', exPt: 'Ela estudou a noite toda.' },
        { base: 'Play', past: 'Played', ipa: '/pleɪd/', pt: 'Jogar', icon: '⚽', ex: 'They played football.', exPt: 'Eles jogaram futebol.' },
        { base: 'Live', past: 'Lived', ipa: '/lɪvd/', pt: 'Morar', icon: '🏠', ex: 'We lived in São Paulo.', exPt: 'Nós moramos em São Paulo.' },
        { base: 'Walk', past: 'Walked', ipa: '/wɔːkt/', pt: 'Caminhar', icon: '🚶', ex: 'He walked to school.', exPt: 'Ele caminhou até a escola.' },
        { base: 'Cook', past: 'Cooked', ipa: '/kʊkt/', pt: 'Cozinhar', icon: '👨‍🍳', ex: 'She cooked dinner.', exPt: 'Ela cozinhou o jantar.' },
        { base: 'Watch', past: 'Watched', ipa: '/wɑːtʃt/', pt: 'Assistir', icon: '📺', ex: 'I watched a movie.', exPt: 'Eu assisti um filme.' },
        { base: 'Travel', past: 'Traveled', ipa: '/ˈtrævəld/', pt: 'Viajar', icon: '✈️', ex: 'We traveled to Europe.', exPt: 'Nós viajamos para a Europa.' },
        { base: 'Dance', past: 'Danced', ipa: '/dænst/', pt: 'Dançar', icon: '💃', ex: 'They danced all night.', exPt: 'Eles dançaram a noite toda.' },
        { base: 'Want', past: 'Wanted', ipa: '/ˈwɑːntɪd/', pt: 'Querer', icon: '🎯', ex: 'I wanted a new job.', exPt: 'Eu queria um emprego novo.' },
        { base: 'Start', past: 'Started', ipa: '/ˈstɑːrtɪd/', pt: 'Começar', icon: '🚀', ex: 'The class started at 8.', exPt: 'A aula começou às 8.' },
        { base: 'Arrive', past: 'Arrived', ipa: '/əˈraɪvd/', pt: 'Chegar', icon: '📍', ex: 'She arrived late.', exPt: 'Ela chegou atrasada.' },
    ];
    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="relative p-8 rounded-[2rem] bg-orange-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center text-4xl shadow-lg border-2 border-orange-400">📝</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">{isPortuguese ? "Past Simple: Verbos Regulares" : "Past Simple: Regular Verbs"}</h3>
                        <p className="text-orange-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"A boa notícia: a maioria dos verbos em inglês é regular. Basta adicionar '-ed' ao final e pronto — você já está falando no passado! Mas atenção: a ortografia e a pronúncia do '-ed' têm regras que você precisa dominar.\""
                                : "\"The good news: most English verbs are regular. Just add '-ed' to the end and you're speaking in the past! But careful — the spelling and pronunciation of '-ed' have rules you need to master.\""}
                        </p>
                    </div>
                </div>
            </div>
            {/* Structure Cards */}
            <div className="grid md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
                    <div className="text-3xl mb-3">✅</div>
                    <p className="font-black text-emerald-700 text-lg mb-1">Subject + verb-ed</p>
                    <button onClick={() => speak('I worked yesterday.')} className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1 mx-auto font-medium"><Volume2 className="w-3 h-3" /> I worked yesterday.</button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Eu trabalhei ontem.</p>}
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center">
                    <div className="text-3xl mb-3">❌</div>
                    <p className="font-black text-rose-700 text-lg mb-1">Subject + didn't + verb</p>
                    <button onClick={() => speak("I didn't work yesterday.")} className="text-sm text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 mx-auto font-medium"><Volume2 className="w-3 h-3" /> I didn't work.</button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Eu não trabalhei ontem.</p>}
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center">
                    <div className="text-3xl mb-3">❓</div>
                    <p className="font-black text-blue-700 text-lg mb-1">Did + subject + verb?</p>
                    <button onClick={() => speak('Did you work yesterday?')} className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 mx-auto font-medium"><Volume2 className="w-3 h-3" /> Did you work?</button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Você trabalhou ontem?</p>}
                </div>
            </div>
            {/* DID Rule */}
            <div className="p-6 rounded-2xl bg-slate-800 text-white flex flex-col md:flex-row items-start gap-5">
                <div className="text-3xl">⚠️</div>
                <div className="flex-1">
                    <h5 className="font-bold text-lg mb-2">{isPortuguese ? 'Regra importantíssima sobre o DID' : 'Critical rule about DID'}</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {isPortuguese
                            ? "Quando usamos DID (negativa e pergunta), o verbo VOLTA para a forma base! O 'did' já carrega o passado. \"Did you worked?\" ❌ → \"Did you work?\" ✅ | \"I didn't played\" ❌ → \"I didn't play\" ✅"
                            : "When using DID (negative and question), the verb goes BACK to base form! 'Did' already carries the past. \"Did you worked?\" ❌ → \"Did you work?\" ✅ | \"I didn't played\" ❌ → \"I didn't play\" ✅"}
                    </p>
                </div>
            </div>
            {/* Spelling Rules */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><BookOpen className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">{isPortuguese ? '✏️ Regras de Ortografia' : '✏️ Spelling Rules'}</h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {edRules.map((r, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border-2 ${r.color}`}>
                            <div className="font-black text-2xl text-center text-slate-800 mb-2">{r.suffix}</div>
                            <p className="text-xs text-slate-600 text-center font-medium mb-3">{r.rule}</p>
                            <div className="space-y-1">
                                {r.examples.map((ex, i) => (
                                    <button key={i} onClick={() => speak(ex.split(' → ')[1])} className="w-full text-left px-3 py-2 rounded-lg bg-white/70 hover:bg-white text-sm font-mono text-slate-700 transition-all">{ex}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Pronunciation of -ed */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><Volume2 className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">{isPortuguese ? '🎙️ Pronúncia do -ED (3 sons)' : '🎙️ Pronunciation of -ED (3 sounds)'}</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {pronunciation.map((p, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border-2 ${p.color}`}>
                            <div className="flex items-center gap-2 mb-3"><span className="text-2xl">{p.icon}</span><span className="font-black text-2xl text-slate-800">{p.sound}</span></div>
                            <p className="text-xs text-slate-500 mb-4">{p.rule}</p>
                            <div className="space-y-2">
                                {p.examples.map((ex, i) => (
                                    <button key={i} onClick={() => speak(ex.verb)} className="w-full text-left p-2.5 rounded-xl bg-white/70 hover:bg-white transition-all flex items-center gap-2 group">
                                        <Volume2 className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 flex-shrink-0" />
                                        <div className="min-w-0"><span className="text-sm font-bold text-slate-700 block">{ex.verb}</span><span className="text-[9px] font-mono text-slate-400">{ex.ipa}</span>{isPortuguese && <span className="text-[10px] text-indigo-400 block">{ex.pt}</span>}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Common Regular Verbs */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><List className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">{isPortuguese ? '📋 Verbos Regulares Essenciais' : '📋 Essential Regular Verbs'}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {commonVerbs.map((v, idx) => (
                        <button key={idx} onClick={() => speak(v.ex)} className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-orange-200 shadow-sm hover:shadow-md transition-all text-left overflow-hidden">
                            <div className="flex items-start gap-3 mb-2">
                                <span className="text-2xl flex-shrink-0">{v.icon}</span>
                                <div className="min-w-0"><span className="text-sm text-slate-400 block">{v.base}</span><span className="font-black text-orange-700 text-lg block">{v.past}</span><span className="text-[9px] font-mono text-slate-400">{v.ipa}</span></div>
                            </div>
                            <p className="text-sm text-slate-600 font-medium">{v.ex}</p>
                            {isPortuguese && <p className="text-[11px] text-slate-400">{v.exPt}</p>}
                            {isPortuguese && <p className="text-[9px] font-bold text-indigo-400 uppercase mt-1">{v.pt}</p>}
                        </button>
                    ))}
                </div>
            </section>
            {/* Common Mistakes */}
            <div className="p-6 rounded-2xl bg-slate-800 text-white">
                <h5 className="font-bold text-lg mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-rose-400" />{isPortuguese ? 'Erros Comuns' : 'Common Mistakes'}</h5>
                <div className="space-y-3">
                    {[
                        { wrong: "I didn't worked.", right: "I didn't work.", tip: isPortuguese ? "Com 'did/didn't', verbo volta à base!" : "With 'did/didn't', verb goes back to base!" },
                        { wrong: "Did you played?", right: "Did you play?", tip: isPortuguese ? "Mesmo caso: 'did' carrega o passado." : "Same case: 'did' carries the past." },
                        { wrong: "He plaied football.", right: "He played football.", tip: isPortuguese ? "'Play' termina em vogal+y: +ed direto." : "'Play' ends in vowel+y: just add +ed." },
                    ].map((m, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-1"><span className="text-rose-400 font-black text-sm">✗ {m.wrong}</span></div>
                            <div className="flex items-center gap-3 mb-1"><span className="text-emerald-400 font-black text-sm">✓ {m.right}</span></div>
                            <p className="text-[11px] text-slate-400">{m.tip}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Golden Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "Para a maioria dos verbos, basta adicionar -ed. Na fala, preste atenção nos 3 sons: /t/ (worked), /d/ (played), /ɪd/ (wanted). O som /ɪd/ só aparece quando o verbo termina em T ou D — nos outros casos, o -ed quase não se ouve!"
                            : "For most verbs, just add -ed. When speaking, pay attention to the 3 sounds: /t/ (worked), /d/ (played), /ɪd/ (wanted). The /ɪd/ sound only appears when the verb ends in T or D — in other cases, the -ed is barely heard!"}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- M8: PAST SIMPLE — IRREGULAR VERBS ---
const PastSimpleIrregularVerbs = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const patterns = [
        {
            name: isPortuguese ? '🔵 Mesma forma' : '🔵 Same form', desc: isPortuguese ? 'Base = Past (não muda!)' : 'Base = Past (no change!)', verbs: [
                { base: 'Cut', past: 'Cut', pp: 'Cut', ipa: '/kʌt/', pt: 'Cortar', icon: '✂️' },
                { base: 'Put', past: 'Put', pp: 'Put', ipa: '/pʊt/', pt: 'Colocar', icon: '📦' },
                { base: 'Let', past: 'Let', pp: 'Let', ipa: '/lɛt/', pt: 'Deixar', icon: '🤝' },
                { base: 'Shut', past: 'Shut', pp: 'Shut', ipa: '/ʃʌt/', pt: 'Fechar', icon: '🚪' },
                { base: 'Hit', past: 'Hit', pp: 'Hit', ipa: '/hɪt/', pt: 'Bater', icon: '👊' },
                { base: 'Cost', past: 'Cost', pp: 'Cost', ipa: '/kɔːst/', pt: 'Custar', icon: '💰' },
            ], color: 'bg-sky-50 border-sky-200'
        },
        {
            name: isPortuguese ? '🟢 Mudança de vogal' : '🟢 Vowel change', desc: isPortuguese ? 'O som da vogal muda no passado' : 'The vowel sound changes in the past', verbs: [
                { base: 'Buy', past: 'Bought', pp: 'Bought', ipa: '/bɔːt/', pt: 'Comprar', icon: '🛒' },
                { base: 'Think', past: 'Thought', pp: 'Thought', ipa: '/θɔːt/', pt: 'Pensar', icon: '🤔' },
                { base: 'Bring', past: 'Brought', pp: 'Brought', ipa: '/brɔːt/', pt: 'Trazer', icon: '📬' },
                { base: 'Teach', past: 'Taught', pp: 'Taught', ipa: '/tɔːt/', pt: 'Ensinar', icon: '👩‍🏫' },
                { base: 'Sleep', past: 'Slept', pp: 'Slept', ipa: '/slɛpt/', pt: 'Dormir', icon: '😴' },
                { base: 'Feel', past: 'Felt', pp: 'Felt', ipa: '/fɛlt/', pt: 'Sentir', icon: '❤️' },
                { base: 'Meet', past: 'Met', pp: 'Met', ipa: '/mɛt/', pt: 'Conhecer', icon: '🤝' },
                { base: 'Tell', past: 'Told', pp: 'Told', ipa: '/toʊld/', pt: 'Contar', icon: '🗣️' },
                { base: 'Find', past: 'Found', pp: 'Found', ipa: '/faʊnd/', pt: 'Encontrar', icon: '🔍' },
                { base: 'Have', past: 'Had', pp: 'Had', ipa: '/hæd/', pt: 'Ter', icon: '✋' },
                { base: 'Make', past: 'Made', pp: 'Made', ipa: '/meɪd/', pt: 'Fazer', icon: '🔨' },
                { base: 'Say', past: 'Said', pp: 'Said', ipa: '/sɛd/', pt: 'Dizer', icon: '💬' },
                { base: 'Get', past: 'Got', pp: 'Got', ipa: '/ɡɑːt/', pt: 'Conseguir', icon: '🎯' },
                { base: 'Win', past: 'Won', pp: 'Won', ipa: '/wʌn/', pt: 'Ganhar', icon: '🏆' },
                { base: 'Sit', past: 'Sat', pp: 'Sat', ipa: '/sæt/', pt: 'Sentar', icon: '🪑' },
                { base: 'Stand', past: 'Stood', pp: 'Stood', ipa: '/stʊd/', pt: 'Ficar de pé', icon: '🧍' },
                { base: 'Understand', past: 'Understood', pp: 'Understood', ipa: '/ˌʌndərˈstʊd/', pt: 'Entender', icon: '💡' },
                { base: 'Leave', past: 'Left', pp: 'Left', ipa: '/lɛft/', pt: 'Sair', icon: '🚶' },
                { base: 'Lose', past: 'Lost', pp: 'Lost', ipa: '/lɔːst/', pt: 'Perder', icon: '😞' },
                { base: 'Keep', past: 'Kept', pp: 'Kept', ipa: '/kɛpt/', pt: 'Manter', icon: '🔒' },
            ], color: 'bg-emerald-50 border-emerald-200'
        },
        {
            name: isPortuguese ? '🔴 Totalmente diferentes' : '🔴 Completely different', desc: isPortuguese ? 'Forma do passado completamente nova' : 'Past form is completely new', verbs: [
                { base: 'Go', past: 'Went', pp: 'Gone', ipa: '/wɛnt/', pt: 'Ir', icon: '🚶' },
                { base: 'See', past: 'Saw', pp: 'Seen', ipa: '/sɔː/', pt: 'Ver', icon: '👀' },
                { base: 'Do', past: 'Did', pp: 'Done', ipa: '/dɪd/', pt: 'Fazer', icon: '✅' },
                { base: 'Eat', past: 'Ate', pp: 'Eaten', ipa: '/eɪt/', pt: 'Comer', icon: '🍽️' },
                { base: 'Give', past: 'Gave', pp: 'Given', ipa: '/ɡeɪv/', pt: 'Dar', icon: '🎁' },
                { base: 'Take', past: 'Took', pp: 'Taken', ipa: '/tʊk/', pt: 'Pegar', icon: '🤲' },
                { base: 'Write', past: 'Wrote', pp: 'Written', ipa: '/roʊt/', pt: 'Escrever', icon: '✍️' },
                { base: 'Speak', past: 'Spoke', pp: 'Spoken', ipa: '/spoʊk/', pt: 'Falar', icon: '🎤' },
                { base: 'Drive', past: 'Drove', pp: 'Driven', ipa: '/droʊv/', pt: 'Dirigir', icon: '🚗' },
                { base: 'Know', past: 'Knew', pp: 'Known', ipa: '/njuː/', pt: 'Saber', icon: '🧠' },
                { base: 'Grow', past: 'Grew', pp: 'Grown', ipa: '/ɡruː/', pt: 'Crescer', icon: '🌱' },
                { base: 'Begin', past: 'Began', pp: 'Begun', ipa: '/bɪˈɡæn/', pt: 'Começar', icon: '🏁' },
                { base: 'Drink', past: 'Drank', pp: 'Drunk', ipa: '/dræŋk/', pt: 'Beber', icon: '🥤' },
                { base: 'Sing', past: 'Sang', pp: 'Sung', ipa: '/sæŋ/', pt: 'Cantar', icon: '🎵' },
                { base: 'Swim', past: 'Swam', pp: 'Swum', ipa: '/swæm/', pt: 'Nadar', icon: '🏊' },
                { base: 'Come', past: 'Came', pp: 'Come', ipa: '/keɪm/', pt: 'Vir', icon: '👋' },
                { base: 'Run', past: 'Ran', pp: 'Run', ipa: '/ræn/', pt: 'Correr', icon: '🏃' },
                { base: 'Become', past: 'Became', pp: 'Become', ipa: '/bɪˈkeɪm/', pt: 'Tornar-se', icon: '🦋' },
                { base: 'Break', past: 'Broke', pp: 'Broken', ipa: '/broʊk/', pt: 'Quebrar', icon: '💔' },
                { base: 'Choose', past: 'Chose', pp: 'Chosen', ipa: '/tʃoʊz/', pt: 'Escolher', icon: '✨' },
            ], color: 'bg-rose-50 border-rose-200'
        },
    ];
    const practiceExamples = [
        { en: 'I went to the supermarket yesterday.', pt: 'Eu fui ao supermercado ontem.', icon: '🛒' },
        { en: 'She saw a beautiful sunset last night.', pt: 'Ela viu um pôr do sol lindo ontem à noite.', icon: '🌅' },
        { en: 'We ate pizza for dinner.', pt: 'Nós comemos pizza no jantar.', icon: '🍕' },
        { en: 'He wrote a letter to his friend.', pt: 'Ele escreveu uma carta para seu amigo.', icon: '✉️' },
        { en: "They didn't come to the party.", pt: 'Eles não vieram para a festa.', icon: '🎉' },
        { en: 'Did you speak to the teacher?', pt: 'Você falou com o professor?', icon: '👩‍🏫' },
    ];
    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="relative p-8 rounded-[2rem] bg-purple-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-4xl shadow-lg border-2 border-purple-400">🔀</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">{isPortuguese ? "Past Simple: Verbos Irregulares" : "Past Simple: Irregular Verbs"}</h3>
                        <p className="text-purple-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Aqui está a notícia que ninguém quer ouvir: os verbos mais usados do inglês são irregulares. Não existe regra — você precisa memorizar. A boa notícia? São 'apenas' uns 200 verbos, e muitos seguem padrões semelhantes. Com prática diária, eles viram automáticos.\""
                                : "\"Here's the news nobody wants to hear: the most commonly used English verbs are irregular. There's no rule — you need to memorize them. The good news? There are 'only' about 200 verbs, and many follow similar patterns. With daily practice, they become automatic.\""}
                        </p>
                    </div>
                </div>
            </div>
            {/* Structure reminder */}
            <div className="grid md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
                    <div className="text-3xl mb-3">✅</div>
                    <p className="font-black text-emerald-700 text-lg mb-1">Subject + past form</p>
                    <button onClick={() => speak('I went to school.')} className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1 mx-auto font-medium"><Volume2 className="w-3 h-3" /> I went to school.</button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Eu fui à escola.</p>}
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center">
                    <div className="text-3xl mb-3">❌</div>
                    <p className="font-black text-rose-700 text-lg mb-1">Subject + didn't + base</p>
                    <button onClick={() => speak("I didn't go to school.")} className="text-sm text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 mx-auto font-medium"><Volume2 className="w-3 h-3" /> I didn't go.</button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Eu não fui à escola.</p>}
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center">
                    <div className="text-3xl mb-3">❓</div>
                    <p className="font-black text-blue-700 text-lg mb-1">Did + subject + base?</p>
                    <button onClick={() => speak('Did you go to school?')} className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 mx-auto font-medium"><Volume2 className="w-3 h-3" /> Did you go?</button>
                    {isPortuguese && <p className="text-[11px] text-slate-400 mt-1">Você foi à escola?</p>}
                </div>
            </div>
            {/* Pattern Groups */}
            {patterns.map((group, gIdx) => (
                <section key={gIdx} className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${group.color.split(' ')[0]} ${group.color.includes('sky') ? 'text-sky-600' : group.color.includes('emerald') ? 'text-emerald-600' : 'text-rose-600'}`}><List className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-2xl font-bold text-slate-800">{group.name}</h4>
                            <p className="text-xs text-slate-500">{group.desc}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.verbs.map((v, idx) => (
                            <button key={idx} onClick={() => speak(`${v.base}, ${v.past}`)} className={`group p-4 rounded-2xl border-2 ${group.color} hover:shadow-md transition-all text-left overflow-hidden`}>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0">{v.icon}</span>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                                            <span className="text-sm text-slate-400">{v.base}</span>
                                            <span className="text-xs text-slate-300">→</span>
                                            <span className="font-black text-purple-700 text-base">{v.past}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-400">{v.ipa}</span>
                                        {isPortuguese && <span className="text-[10px] font-bold text-indigo-400 uppercase block">{v.pt}</span>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            ))}
            {/* Practice Sentences */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><MessageCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">{isPortuguese ? '🗣️ Pratique com Frases' : '🗣️ Practice with Sentences'}</h4>
                </div>
                <div className="grid gap-3">
                    {practiceExamples.map((ex, idx) => (
                        <button key={idx} onClick={() => speak(ex.en)} className="w-full text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all flex items-center gap-4 group">
                            <span className="text-2xl flex-shrink-0">{ex.icon}</span>
                            <div className="flex-1 min-w-0">
                                <span className="font-bold text-slate-800 text-sm block">{ex.en}</span>
                                {isPortuguese && <span className="text-[11px] text-slate-400 block">{ex.pt}</span>}
                            </div>
                            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-purple-500 flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </section>
            {/* Common Mistakes */}
            <div className="p-6 rounded-2xl bg-slate-800 text-white">
                <h5 className="font-bold text-lg mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-rose-400" />{isPortuguese ? 'Erros Comuns' : 'Common Mistakes'}</h5>
                <div className="space-y-3">
                    {[
                        { wrong: 'I goed to school.', right: 'I went to school.', tip: isPortuguese ? "'Go' é irregular: went (não 'goed')" : "'Go' is irregular: went (not 'goed')" },
                        { wrong: "She didn't went.", right: "She didn't go.", tip: isPortuguese ? "Com 'didn't', volta p/ base!" : "With 'didn't', use base form!" },
                        { wrong: "Did you ate?", right: "Did you eat?", tip: isPortuguese ? "Com 'did', o verbo fica na base!" : "With 'did', verb stays in base form!" },
                        { wrong: "I taked the bus.", right: "I took the bus.", tip: isPortuguese ? "'Take' é irregular: took" : "'Take' is irregular: took" },
                    ].map((m, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-1"><span className="text-rose-400 font-black text-sm">✗ {m.wrong}</span></div>
                            <div className="flex items-center gap-3 mb-1"><span className="text-emerald-400 font-black text-sm">✓ {m.right}</span></div>
                            <p className="text-[11px] text-slate-400">{m.tip}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Golden Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "Não tente decorar todos de uma vez! Foque nos 20 mais usados primeiro (go, see, do, eat, give, take, make, have, get, come, know, think, say, tell, find, buy, write, speak, run, break). Use-os em frases do seu dia a dia e a memorização vem naturalmente."
                            : "Don't try to memorize them all at once! Focus on the 20 most common first (go, see, do, eat, give, take, make, have, get, come, know, think, say, tell, find, buy, write, speak, run, break). Use them in sentences from your daily life and memorization comes naturally."}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- IRREGULAR VERBS COMPLETE REFERENCE ---
const IrregularVerbsReference = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [search, setSearch] = useState('');
    const allVerbs = [
        { base: 'Arise', past: 'Arose', pp: 'Arisen', pt: 'Surgir' },
        { base: 'Awake', past: 'Awoke', pp: 'Awoken', pt: 'Acordar' },
        { base: 'Be', past: 'Was/Were', pp: 'Been', pt: 'Ser/Estar' },
        { base: 'Bear', past: 'Bore', pp: 'Borne/Born', pt: 'Suportar/Nascer' },
        { base: 'Beat', past: 'Beat', pp: 'Beaten', pt: 'Bater/Vencer' },
        { base: 'Become', past: 'Became', pp: 'Become', pt: 'Tornar-se' },
        { base: 'Begin', past: 'Began', pp: 'Begun', pt: 'Começar' },
        { base: 'Bend', past: 'Bent', pp: 'Bent', pt: 'Curvar' },
        { base: 'Bet', past: 'Bet', pp: 'Bet', pt: 'Apostar' },
        { base: 'Bind', past: 'Bound', pp: 'Bound', pt: 'Amarrar' },
        { base: 'Bite', past: 'Bit', pp: 'Bitten', pt: 'Morder' },
        { base: 'Bleed', past: 'Bled', pp: 'Bled', pt: 'Sangrar' },
        { base: 'Blow', past: 'Blew', pp: 'Blown', pt: 'Soprar' },
        { base: 'Break', past: 'Broke', pp: 'Broken', pt: 'Quebrar' },
        { base: 'Breed', past: 'Bred', pp: 'Bred', pt: 'Criar (animais)' },
        { base: 'Bring', past: 'Brought', pp: 'Brought', pt: 'Trazer' },
        { base: 'Build', past: 'Built', pp: 'Built', pt: 'Construir' },
        { base: 'Burn', past: 'Burnt/Burned', pp: 'Burnt/Burned', pt: 'Queimar' },
        { base: 'Burst', past: 'Burst', pp: 'Burst', pt: 'Estourar' },
        { base: 'Buy', past: 'Bought', pp: 'Bought', pt: 'Comprar' },
        { base: 'Cast', past: 'Cast', pp: 'Cast', pt: 'Lançar' },
        { base: 'Catch', past: 'Caught', pp: 'Caught', pt: 'Pegar' },
        { base: 'Choose', past: 'Chose', pp: 'Chosen', pt: 'Escolher' },
        { base: 'Cling', past: 'Clung', pp: 'Clung', pt: 'Agarrar-se' },
        { base: 'Come', past: 'Came', pp: 'Come', pt: 'Vir' },
        { base: 'Cost', past: 'Cost', pp: 'Cost', pt: 'Custar' },
        { base: 'Creep', past: 'Crept', pp: 'Crept', pt: 'Rastejar' },
        { base: 'Cut', past: 'Cut', pp: 'Cut', pt: 'Cortar' },
        { base: 'Deal', past: 'Dealt', pp: 'Dealt', pt: 'Lidar' },
        { base: 'Dig', past: 'Dug', pp: 'Dug', pt: 'Cavar' },
        { base: 'Do', past: 'Did', pp: 'Done', pt: 'Fazer' },
        { base: 'Draw', past: 'Drew', pp: 'Drawn', pt: 'Desenhar' },
        { base: 'Dream', past: 'Dreamt/Dreamed', pp: 'Dreamt/Dreamed', pt: 'Sonhar' },
        { base: 'Drink', past: 'Drank', pp: 'Drunk', pt: 'Beber' },
        { base: 'Drive', past: 'Drove', pp: 'Driven', pt: 'Dirigir' },
        { base: 'Eat', past: 'Ate', pp: 'Eaten', pt: 'Comer' },
        { base: 'Fall', past: 'Fell', pp: 'Fallen', pt: 'Cair' },
        { base: 'Feed', past: 'Fed', pp: 'Fed', pt: 'Alimentar' },
        { base: 'Feel', past: 'Felt', pp: 'Felt', pt: 'Sentir' },
        { base: 'Fight', past: 'Fought', pp: 'Fought', pt: 'Lutar' },
        { base: 'Find', past: 'Found', pp: 'Found', pt: 'Encontrar' },
        { base: 'Fly', past: 'Flew', pp: 'Flown', pt: 'Voar' },
        { base: 'Forbid', past: 'Forbade', pp: 'Forbidden', pt: 'Proibir' },
        { base: 'Forget', past: 'Forgot', pp: 'Forgotten', pt: 'Esquecer' },
        { base: 'Forgive', past: 'Forgave', pp: 'Forgiven', pt: 'Perdoar' },
        { base: 'Freeze', past: 'Froze', pp: 'Frozen', pt: 'Congelar' },
        { base: 'Get', past: 'Got', pp: 'Got/Gotten', pt: 'Conseguir/Obter' },
        { base: 'Give', past: 'Gave', pp: 'Given', pt: 'Dar' },
        { base: 'Go', past: 'Went', pp: 'Gone', pt: 'Ir' },
        { base: 'Grind', past: 'Ground', pp: 'Ground', pt: 'Moer' },
        { base: 'Grow', past: 'Grew', pp: 'Grown', pt: 'Crescer' },
        { base: 'Hang', past: 'Hung', pp: 'Hung', pt: 'Pendurar' },
        { base: 'Have', past: 'Had', pp: 'Had', pt: 'Ter' },
        { base: 'Hear', past: 'Heard', pp: 'Heard', pt: 'Ouvir' },
        { base: 'Hide', past: 'Hid', pp: 'Hidden', pt: 'Esconder' },
        { base: 'Hit', past: 'Hit', pp: 'Hit', pt: 'Bater/Acertar' },
        { base: 'Hold', past: 'Held', pp: 'Held', pt: 'Segurar' },
        { base: 'Hurt', past: 'Hurt', pp: 'Hurt', pt: 'Machucar' },
        { base: 'Keep', past: 'Kept', pp: 'Kept', pt: 'Manter' },
        { base: 'Kneel', past: 'Knelt', pp: 'Knelt', pt: 'Ajoelhar' },
        { base: 'Know', past: 'Knew', pp: 'Known', pt: 'Saber/Conhecer' },
        { base: 'Lay', past: 'Laid', pp: 'Laid', pt: 'Colocar/Deitar' },
        { base: 'Lead', past: 'Led', pp: 'Led', pt: 'Liderar' },
        { base: 'Lean', past: 'Leant/Leaned', pp: 'Leant/Leaned', pt: 'Inclinar' },
        { base: 'Learn', past: 'Learnt/Learned', pp: 'Learnt/Learned', pt: 'Aprender' },
        { base: 'Leave', past: 'Left', pp: 'Left', pt: 'Sair/Deixar' },
        { base: 'Lend', past: 'Lent', pp: 'Lent', pt: 'Emprestar' },
        { base: 'Let', past: 'Let', pp: 'Let', pt: 'Deixar/Permitir' },
        { base: 'Lie', past: 'Lay', pp: 'Lain', pt: 'Deitar-se' },
        { base: 'Light', past: 'Lit', pp: 'Lit', pt: 'Acender' },
        { base: 'Lose', past: 'Lost', pp: 'Lost', pt: 'Perder' },
        { base: 'Make', past: 'Made', pp: 'Made', pt: 'Fazer/Fabricar' },
        { base: 'Mean', past: 'Meant', pp: 'Meant', pt: 'Significar' },
        { base: 'Meet', past: 'Met', pp: 'Met', pt: 'Conhecer/Encontrar' },
        { base: 'Mistake', past: 'Mistook', pp: 'Mistaken', pt: 'Confundir' },
        { base: 'Overcome', past: 'Overcame', pp: 'Overcome', pt: 'Superar' },
        { base: 'Pay', past: 'Paid', pp: 'Paid', pt: 'Pagar' },
        { base: 'Put', past: 'Put', pp: 'Put', pt: 'Colocar' },
        { base: 'Quit', past: 'Quit', pp: 'Quit', pt: 'Desistir' },
        { base: 'Read', past: 'Read', pp: 'Read', pt: 'Ler' },
        { base: 'Ride', past: 'Rode', pp: 'Ridden', pt: 'Cavalgar/Andar' },
        { base: 'Ring', past: 'Rang', pp: 'Rung', pt: 'Tocar (sino)' },
        { base: 'Rise', past: 'Rose', pp: 'Risen', pt: 'Subir/Levantar' },
        { base: 'Run', past: 'Ran', pp: 'Run', pt: 'Correr' },
        { base: 'Say', past: 'Said', pp: 'Said', pt: 'Dizer' },
        { base: 'See', past: 'Saw', pp: 'Seen', pt: 'Ver' },
        { base: 'Seek', past: 'Sought', pp: 'Sought', pt: 'Procurar' },
        { base: 'Sell', past: 'Sold', pp: 'Sold', pt: 'Vender' },
        { base: 'Send', past: 'Sent', pp: 'Sent', pt: 'Enviar' },
        { base: 'Set', past: 'Set', pp: 'Set', pt: 'Definir/Ajustar' },
        { base: 'Sew', past: 'Sewed', pp: 'Sewn/Sewed', pt: 'Costurar' },
        { base: 'Shake', past: 'Shook', pp: 'Shaken', pt: 'Sacudir' },
        { base: 'Shed', past: 'Shed', pp: 'Shed', pt: 'Derramar' },
        { base: 'Shine', past: 'Shone', pp: 'Shone', pt: 'Brilhar' },
        { base: 'Shoot', past: 'Shot', pp: 'Shot', pt: 'Atirar' },
        { base: 'Show', past: 'Showed', pp: 'Shown', pt: 'Mostrar' },
        { base: 'Shrink', past: 'Shrank', pp: 'Shrunk', pt: 'Encolher' },
        { base: 'Shut', past: 'Shut', pp: 'Shut', pt: 'Fechar' },
        { base: 'Sing', past: 'Sang', pp: 'Sung', pt: 'Cantar' },
        { base: 'Sink', past: 'Sank', pp: 'Sunk', pt: 'Afundar' },
        { base: 'Sit', past: 'Sat', pp: 'Sat', pt: 'Sentar' },
        { base: 'Sleep', past: 'Slept', pp: 'Slept', pt: 'Dormir' },
        { base: 'Slide', past: 'Slid', pp: 'Slid', pt: 'Deslizar' },
        { base: 'Smell', past: 'Smelt/Smelled', pp: 'Smelt/Smelled', pt: 'Cheirar' },
        { base: 'Speak', past: 'Spoke', pp: 'Spoken', pt: 'Falar' },
        { base: 'Speed', past: 'Sped', pp: 'Sped', pt: 'Acelerar' },
        { base: 'Spell', past: 'Spelt/Spelled', pp: 'Spelt/Spelled', pt: 'Soletrar' },
        { base: 'Spend', past: 'Spent', pp: 'Spent', pt: 'Gastar' },
        { base: 'Spill', past: 'Spilt/Spilled', pp: 'Spilt/Spilled', pt: 'Derramar' },
        { base: 'Spin', past: 'Spun', pp: 'Spun', pt: 'Girar' },
        { base: 'Split', past: 'Split', pp: 'Split', pt: 'Dividir' },
        { base: 'Spread', past: 'Spread', pp: 'Spread', pt: 'Espalhar' },
        { base: 'Spring', past: 'Sprang', pp: 'Sprung', pt: 'Pular' },
        { base: 'Stand', past: 'Stood', pp: 'Stood', pt: 'Ficar de pé' },
        { base: 'Steal', past: 'Stole', pp: 'Stolen', pt: 'Roubar' },
        { base: 'Stick', past: 'Stuck', pp: 'Stuck', pt: 'Colar/Grudar' },
        { base: 'Sting', past: 'Stung', pp: 'Stung', pt: 'Picar' },
        { base: 'Stink', past: 'Stank', pp: 'Stunk', pt: 'Feder' },
        { base: 'Strike', past: 'Struck', pp: 'Struck', pt: 'Golpear' },
        { base: 'Swear', past: 'Swore', pp: 'Sworn', pt: 'Jurar' },
        { base: 'Sweep', past: 'Swept', pp: 'Swept', pt: 'Varrer' },
        { base: 'Swim', past: 'Swam', pp: 'Swum', pt: 'Nadar' },
        { base: 'Swing', past: 'Swung', pp: 'Swung', pt: 'Balançar' },
        { base: 'Take', past: 'Took', pp: 'Taken', pt: 'Pegar/Levar' },
        { base: 'Teach', past: 'Taught', pp: 'Taught', pt: 'Ensinar' },
        { base: 'Tear', past: 'Tore', pp: 'Torn', pt: 'Rasgar' },
        { base: 'Tell', past: 'Told', pp: 'Told', pt: 'Contar/Dizer' },
        { base: 'Think', past: 'Thought', pp: 'Thought', pt: 'Pensar' },
        { base: 'Throw', past: 'Threw', pp: 'Thrown', pt: 'Jogar/Arremessar' },
        { base: 'Tread', past: 'Trod', pp: 'Trodden', pt: 'Pisar' },
        { base: 'Undergo', past: 'Underwent', pp: 'Undergone', pt: 'Sofrer/Passar por' },
        { base: 'Understand', past: 'Understood', pp: 'Understood', pt: 'Entender' },
        { base: 'Undertake', past: 'Undertook', pp: 'Undertaken', pt: 'Empreender' },
        { base: 'Upset', past: 'Upset', pp: 'Upset', pt: 'Perturbar' },
        { base: 'Wake', past: 'Woke', pp: 'Woken', pt: 'Acordar' },
        { base: 'Wear', past: 'Wore', pp: 'Worn', pt: 'Vestir/Usar' },
        { base: 'Weave', past: 'Wove', pp: 'Woven', pt: 'Tecer' },
        { base: 'Weep', past: 'Wept', pp: 'Wept', pt: 'Chorar' },
        { base: 'Win', past: 'Won', pp: 'Won', pt: 'Ganhar/Vencer' },
        { base: 'Wind', past: 'Wound', pp: 'Wound', pt: 'Enrolar' },
        { base: 'Withdraw', past: 'Withdrew', pp: 'Withdrawn', pt: 'Retirar' },
        { base: 'Write', past: 'Wrote', pp: 'Written', pt: 'Escrever' },
    ];
    const filtered = allVerbs.filter(v =>
        v.base.toLowerCase().includes(search.toLowerCase()) ||
        v.past.toLowerCase().includes(search.toLowerCase()) ||
        v.pp.toLowerCase().includes(search.toLowerCase()) ||
        v.pt.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl shadow-lg border-2 border-white/20">📖</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">{isPortuguese ? 'Tabela Completa de Verbos Irregulares' : 'Complete Irregular Verbs Table'}</h3>
                        <p className="text-white/70 text-sm">{isPortuguese ? `${allVerbs.length} verbos irregulares do inglês com todas as formas` : `${allVerbs.length} English irregular verbs with all forms`}</p>
                    </div>
                </div>
            </div>
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={isPortuguese ? 'Buscar verbo (inglês ou português)...' : 'Search verb (English or Portuguese)...'} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none text-slate-800 bg-white shadow-sm text-sm font-medium" />
            </div>
            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-4 bg-slate-800 text-white text-xs font-black uppercase tracking-widest p-4">
                    <span>{isPortuguese ? 'Base' : 'Base Form'}</span>
                    <span>Past Simple</span>
                    <span>Past Participle</span>
                    <span>{isPortuguese ? 'Tradução' : 'Translation'}</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {filtered.map((v, idx) => (
                        <button key={idx} onClick={() => speak(`${v.base}, ${v.past}, ${v.pp}`)} className="grid grid-cols-4 w-full text-left p-3.5 hover:bg-indigo-50 transition-all text-sm group">
                            <span className="font-bold text-slate-800">{v.base}</span>
                            <span className="font-bold text-purple-700">{v.past}</span>
                            <span className="text-slate-600">{v.pp}</span>
                            <span className="text-slate-400 text-xs">{v.pt}</span>
                        </button>
                    ))}
                </div>
                {filtered.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">{isPortuguese ? 'Nenhum verbo encontrado.' : 'No verbs found.'}</div>}
            </div>
            <p className="text-center text-xs text-slate-400">{isPortuguese ? `Mostrando ${filtered.length} de ${allVerbs.length} verbos` : `Showing ${filtered.length} of ${allVerbs.length} verbs`}</p>
        </div>
    );
};

const FoodAndDrink = ({ isPortuguese }: { isPortuguese: boolean }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const categories = [
        {
            id: 'drinks', title: isPortuguese ? '🥤 Bebidas' : '🥤 Drinks', color: 'bg-blue-50', border: 'border-blue-200', headerBg: 'bg-blue-100', headerText: 'text-blue-700',
            items: [
                { word: 'Water', ipa: '/ˈwɔːtər/', trans: 'Água', icon: '💧' },
                { word: 'Coffee', ipa: '/ˈkɔːfi/', trans: 'Café', icon: '☕' },
                { word: 'Tea', ipa: '/tiː/', trans: 'Chá', icon: '🍵' },
                { word: 'Juice', ipa: '/dʒuːs/', trans: 'Suco', icon: '🧃' },
                { word: 'Milk', ipa: '/mɪlk/', trans: 'Leite', icon: '🥛' },
                { word: 'Soda', ipa: '/ˈsoʊdə/', trans: 'Refrigerante', icon: '🥤' },
                { word: 'Beer', ipa: '/bɪr/', trans: 'Cerveja', icon: '🍺' },
                { word: 'Wine', ipa: '/waɪn/', trans: 'Vinho', icon: '🍷' },
                { word: 'Smoothie', ipa: '/ˈsmuːði/', trans: 'Vitamina', icon: '🥤' },
                { word: 'Lemonade', ipa: '/ˌlɛməˈneɪd/', trans: 'Limonada', icon: '🍋' },
            ]
        },
        {
            id: 'fruits', title: isPortuguese ? '🍎 Frutas' : '🍎 Fruits', color: 'bg-red-50', border: 'border-red-200', headerBg: 'bg-red-100', headerText: 'text-red-700',
            items: [
                { word: 'Apple', ipa: '/ˈæpəl/', trans: 'Maçã', icon: '🍎' },
                { word: 'Banana', ipa: '/bəˈnænə/', trans: 'Banana', icon: '🍌' },
                { word: 'Orange', ipa: '/ˈɔːrɪndʒ/', trans: 'Laranja', icon: '🍊' },
                { word: 'Strawberry', ipa: '/ˈstrɔːbəri/', trans: 'Morango', icon: '🍓' },
                { word: 'Grape', ipa: '/ɡreɪp/', trans: 'Uva', icon: '🍇' },
                { word: 'Watermelon', ipa: '/ˈwɔːtərˌmɛlən/', trans: 'Melancia', icon: '🍉' },
                { word: 'Pineapple', ipa: '/ˈpaɪnˌæpəl/', trans: 'Abacaxi', icon: '🍍' },
                { word: 'Mango', ipa: '/ˈmæŋɡoʊ/', trans: 'Manga', icon: '🥭' },
                { word: 'Peach', ipa: '/piːtʃ/', trans: 'Pêssego', icon: '🍑' },
                { word: 'Lemon', ipa: '/ˈlɛmən/', trans: 'Limão', icon: '🍋' },
                { word: 'Cherry', ipa: '/ˈtʃɛri/', trans: 'Cereja', icon: '🍒' },
                { word: 'Pear', ipa: '/pɛr/', trans: 'Pera', icon: '🍐' },
            ]
        },
        {
            id: 'vegetables', title: isPortuguese ? '🥬 Vegetais' : '🥬 Vegetables', color: 'bg-emerald-50', border: 'border-emerald-200', headerBg: 'bg-emerald-100', headerText: 'text-emerald-700',
            items: [
                { word: 'Tomato', ipa: '/təˈmeɪtoʊ/', trans: 'Tomate', icon: '🍅' },
                { word: 'Carrot', ipa: '/ˈkærət/', trans: 'Cenoura', icon: '🥕' },
                { word: 'Potato', ipa: '/pəˈteɪtoʊ/', trans: 'Batata', icon: '🥔' },
                { word: 'Onion', ipa: '/ˈʌnjən/', trans: 'Cebola', icon: '🧅' },
                { word: 'Garlic', ipa: '/ˈɡɑːrlɪk/', trans: 'Alho', icon: '🧄' },
                { word: 'Lettuce', ipa: '/ˈlɛtɪs/', trans: 'Alface', icon: '🥬' },
                { word: 'Broccoli', ipa: '/ˈbrɑːkəli/', trans: 'Brócolis', icon: '🥦' },
                { word: 'Corn', ipa: '/kɔːrn/', trans: 'Milho', icon: '🌽' },
                { word: 'Pepper', ipa: '/ˈpɛpər/', trans: 'Pimentão', icon: '🫑' },
                { word: 'Mushroom', ipa: '/ˈmʌʃruːm/', trans: 'Cogumelo', icon: '🍄' },
                { word: 'Cucumber', ipa: '/ˈkjuːkʌmbər/', trans: 'Pepino', icon: '🥒' },
                { word: 'Pumpkin', ipa: '/ˈpʌmpkɪn/', trans: 'Abóbora', icon: '🎃' },
            ]
        },
        {
            id: 'meat', title: isPortuguese ? '🥩 Carnes & Proteínas' : '🥩 Meat & Protein', color: 'bg-rose-50', border: 'border-rose-200', headerBg: 'bg-rose-100', headerText: 'text-rose-700',
            items: [
                { word: 'Chicken', ipa: '/ˈtʃɪkɪn/', trans: 'Frango', icon: '🍗' },
                { word: 'Beef', ipa: '/biːf/', trans: 'Carne bovina', icon: '🥩' },
                { word: 'Pork', ipa: '/pɔːrk/', trans: 'Carne suína', icon: '🐖' },
                { word: 'Fish', ipa: '/fɪʃ/', trans: 'Peixe', icon: '🐟' },
                { word: 'Shrimp', ipa: '/ʃrɪmp/', trans: 'Camarão', icon: '🦐' },
                { word: 'Egg', ipa: '/ɛɡ/', trans: 'Ovo', icon: '🥚' },
                { word: 'Steak', ipa: '/steɪk/', trans: 'Bife', icon: '🥩' },
                { word: 'Bacon', ipa: '/ˈbeɪkən/', trans: 'Bacon', icon: '🥓' },
                { word: 'Sausage', ipa: '/ˈsɔːsɪdʒ/', trans: 'Salsicha', icon: '🌭' },
                { word: 'Turkey', ipa: '/ˈtɜːrki/', trans: 'Peru', icon: '🦃' },
            ]
        },
        {
            id: 'dairy', title: isPortuguese ? '🧀 Laticínios' : '🧀 Dairy', color: 'bg-yellow-50', border: 'border-yellow-200', headerBg: 'bg-yellow-100', headerText: 'text-yellow-700',
            items: [
                { word: 'Cheese', ipa: '/tʃiːz/', trans: 'Queijo', icon: '🧀' },
                { word: 'Butter', ipa: '/ˈbʌtər/', trans: 'Manteiga', icon: '🧈' },
                { word: 'Yogurt', ipa: '/ˈjoʊɡərt/', trans: 'Iogurte', icon: '🥛' },
                { word: 'Cream', ipa: '/kriːm/', trans: 'Creme', icon: '🍦' },
                { word: 'Ice cream', ipa: '/aɪs kriːm/', trans: 'Sorvete', icon: '🍨' },
            ]
        },
        {
            id: 'grains', title: isPortuguese ? '🍞 Grãos & Padaria' : '🍞 Grains & Bakery', color: 'bg-amber-50', border: 'border-amber-200', headerBg: 'bg-amber-100', headerText: 'text-amber-700',
            items: [
                { word: 'Bread', ipa: '/brɛd/', trans: 'Pão', icon: '🍞' },
                { word: 'Rice', ipa: '/raɪs/', trans: 'Arroz', icon: '🍚' },
                { word: 'Pasta', ipa: '/ˈpɑːstə/', trans: 'Macarrão', icon: '🍝' },
                { word: 'Toast', ipa: '/toʊst/', trans: 'Torrada', icon: '🍞' },
                { word: 'Cereal', ipa: '/ˈsɪriəl/', trans: 'Cereal', icon: '🥣' },
                { word: 'Pancake', ipa: '/ˈpænkeɪk/', trans: 'Panqueca', icon: '🥞' },
                { word: 'Flour', ipa: '/flaʊər/', trans: 'Farinha', icon: '🌾' },
                { word: 'Oats', ipa: '/oʊts/', trans: 'Aveia', icon: '🌾' },
                { word: 'Croissant', ipa: '/kwɑːˈsɑ̃/', trans: 'Croissant', icon: '🥐' },
                { word: 'Cookie', ipa: '/ˈkʊki/', trans: 'Biscoito', icon: '🍪' },
            ]
        },
        {
            id: 'fastfood', title: isPortuguese ? '🍔 Pratos Rápidos' : '🍔 Fast Food & Dishes', color: 'bg-orange-50', border: 'border-orange-200', headerBg: 'bg-orange-100', headerText: 'text-orange-700',
            items: [
                { word: 'Pizza', ipa: '/ˈpiːtsə/', trans: 'Pizza', icon: '🍕' },
                { word: 'Burger', ipa: '/ˈbɜːrɡər/', trans: 'Hambúrguer', icon: '🍔' },
                { word: 'Hot dog', ipa: '/hɑːt dɔːɡ/', trans: 'Cachorro-quente', icon: '🌭' },
                { word: 'French fries', ipa: '/frɛntʃ fraɪz/', trans: 'Batata frita', icon: '🍟' },
                { word: 'Sandwich', ipa: '/ˈsænwɪtʃ/', trans: 'Sanduíche', icon: '🥪' },
                { word: 'Taco', ipa: '/ˈtɑːkoʊ/', trans: 'Taco', icon: '🌮' },
                { word: 'Burrito', ipa: '/bəˈriːtoʊ/', trans: 'Burrito', icon: '🌯' },
                { word: 'Soup', ipa: '/suːp/', trans: 'Sopa', icon: '🍲' },
                { word: 'Salad', ipa: '/ˈsæləd/', trans: 'Salada', icon: '🥗' },
                { word: 'Sushi', ipa: '/ˈsuːʃi/', trans: 'Sushi', icon: '🍣' },
                { word: 'Fried rice', ipa: '/fraɪd raɪs/', trans: 'Arroz frito', icon: '🍛' },
                { word: 'Noodles', ipa: '/ˈnuːdəlz/', trans: 'Macarrão/Lámen', icon: '🍜' },
            ]
        },
        {
            id: 'desserts', title: isPortuguese ? '🍰 Sobremesas' : '🍰 Desserts & Sweets', color: 'bg-pink-50', border: 'border-pink-200', headerBg: 'bg-pink-100', headerText: 'text-pink-700',
            items: [
                { word: 'Cake', ipa: '/keɪk/', trans: 'Bolo', icon: '🎂' },
                { word: 'Chocolate', ipa: '/ˈtʃɑːklət/', trans: 'Chocolate', icon: '🍫' },
                { word: 'Candy', ipa: '/ˈkændi/', trans: 'Doce/Bala', icon: '🍬' },
                { word: 'Pie', ipa: '/paɪ/', trans: 'Torta', icon: '🥧' },
                { word: 'Doughnut', ipa: '/ˈdoʊnʌt/', trans: 'Rosquinha', icon: '🍩' },
                { word: 'Cupcake', ipa: '/ˈkʌpkeɪk/', trans: 'Cupcake', icon: '🧁' },
                { word: 'Pudding', ipa: '/ˈpʊdɪŋ/', trans: 'Pudim', icon: '🍮' },
                { word: 'Honey', ipa: '/ˈhʌni/', trans: 'Mel', icon: '🍯' },
                { word: 'Sugar', ipa: '/ˈʃʊɡər/', trans: 'Açúcar', icon: '🍬' },
                { word: 'Jam', ipa: '/dʒæm/', trans: 'Geleia', icon: '🫙' },
            ]
        },
        {
            id: 'condiments', title: isPortuguese ? '🧂 Condimentos & Temperos' : '🧂 Condiments & Seasonings', color: 'bg-slate-50', border: 'border-slate-200', headerBg: 'bg-slate-100', headerText: 'text-slate-700',
            items: [
                { word: 'Salt', ipa: '/sɔːlt/', trans: 'Sal', icon: '🧂' },
                { word: 'Pepper', ipa: '/ˈpɛpər/', trans: 'Pimenta', icon: '🌶️' },
                { word: 'Oil', ipa: '/ɔɪl/', trans: 'Óleo/Azeite', icon: '🫒' },
                { word: 'Vinegar', ipa: '/ˈvɪnɪɡər/', trans: 'Vinagre', icon: '🧴' },
                { word: 'Ketchup', ipa: '/ˈkɛtʃəp/', trans: 'Ketchup', icon: '🍅' },
                { word: 'Mustard', ipa: '/ˈmʌstərd/', trans: 'Mostarda', icon: '🟡' },
                { word: 'Mayonnaise', ipa: '/ˈmeɪəˌneɪz/', trans: 'Maionese', icon: '🥄' },
                { word: 'Soy sauce', ipa: '/sɔɪ sɔːs/', trans: 'Molho de soja', icon: '🥢' },
                { word: 'Hot sauce', ipa: '/hɑːt sɔːs/', trans: 'Molho picante', icon: '🌶️' },
            ]
        },
        {
            id: 'extras', title: isPortuguese ? '🥜 Outros Ingredientes' : '🥜 Other Ingredients', color: 'bg-lime-50', border: 'border-lime-200', headerBg: 'bg-lime-100', headerText: 'text-lime-700',
            items: [
                { word: 'Nuts', ipa: '/nʌts/', trans: 'Nozes/Castanhas', icon: '🥜' },
                { word: 'Beans', ipa: '/biːnz/', trans: 'Feijão', icon: '🫘' },
                { word: 'Avocado', ipa: '/ˌævəˈkɑːdoʊ/', trans: 'Abacate', icon: '🥑' },
                { word: 'Coconut', ipa: '/ˈkoʊkənʌt/', trans: 'Coco', icon: '🥥' },
                { word: 'Olive', ipa: '/ˈɑːlɪv/', trans: 'Azeitona', icon: '🫒' },
                { word: 'Popcorn', ipa: '/ˈpɑːpkɔːrn/', trans: 'Pipoca', icon: '🍿' },
                { word: 'Chips', ipa: '/tʃɪps/', trans: 'Batata chips', icon: '🥔' },
                { word: 'Pretzel', ipa: '/ˈprɛtsəl/', trans: 'Pretzel', icon: '🥨' },
                { word: 'Tofu', ipa: '/ˈtoʊfuː/', trans: 'Tofu', icon: '🧊' },
                { word: 'Peanut butter', ipa: '/ˈpiːnʌt ˈbʌtər/', trans: 'Pasta de amendoim', icon: '🥜' },
            ]
        },
    ];

    const orderingPhrases = [
        { phrase: "Can I have a water, please?", trans: "Posso pedir uma água, por favor?", icon: "🗣️" },
        { phrase: "I would like a coffee.", trans: "Eu gostaria de um café.", icon: "☕" },
        { phrase: "Do you have pizza?", trans: "Vocês têm pizza?", icon: "🍕" },
        { phrase: "The bill, please.", trans: "A conta, por favor.", icon: "🧾" },
        { phrase: "A table for two, please.", trans: "Uma mesa para dois, por favor.", icon: "🪑" },
        { phrase: "What do you recommend?", trans: "O que você recomenda?", icon: "🤔" },
        { phrase: "I'm allergic to nuts.", trans: "Sou alérgico a nozes.", icon: "⚠️" },
        { phrase: "Can I see the menu?", trans: "Posso ver o cardápio?", icon: "📖" },
        { phrase: "Is this dish spicy?", trans: "Este prato é picante?", icon: "🌶️" },
        { phrase: "I'll have the same.", trans: "Vou querer o mesmo.", icon: "👆" },
    ];

    const cookingVerbs = [
        { verb: 'Boil', ipa: '/bɔɪl/', trans: 'Ferver', icon: '♨️', ex: 'Boil the water for pasta.', exPt: 'Ferva a água para o macarrão.' },
        { verb: 'Fry', ipa: '/fraɪ/', trans: 'Fritar', icon: '🍳', ex: 'Fry the eggs.', exPt: 'Frite os ovos.' },
        { verb: 'Bake', ipa: '/beɪk/', trans: 'Assar (forno)', icon: '🧁', ex: 'Bake the cake for 30 minutes.', exPt: 'Asse o bolo por 30 minutos.' },
        { verb: 'Grill', ipa: '/ɡrɪl/', trans: 'Grelhar', icon: '🔥', ex: 'Grill the chicken.', exPt: 'Grelhe o frango.' },
        { verb: 'Chop', ipa: '/tʃɑːp/', trans: 'Picar', icon: '🔪', ex: 'Chop the onion.', exPt: 'Pique a cebola.' },
        { verb: 'Mix', ipa: '/mɪks/', trans: 'Misturar', icon: '🥄', ex: 'Mix the ingredients.', exPt: 'Misture os ingredientes.' },
        { verb: 'Stir', ipa: '/stɜːr/', trans: 'Mexer', icon: '🥣', ex: 'Stir the soup.', exPt: 'Mexa a sopa.' },
        { verb: 'Peel', ipa: '/piːl/', trans: 'Descascar', icon: '🍌', ex: 'Peel the potatoes.', exPt: 'Descasque as batatas.' },
    ];

    const dialogue = [
        { speaker: 'Waiter', line: 'Good evening! A table for how many?', pt: 'Boa noite! Mesa para quantos?', icon: '🧑‍🍳' },
        { speaker: 'You', line: 'For two, please.', pt: 'Para dois, por favor.', icon: '🙋' },
        { speaker: 'Waiter', line: 'Here\'s the menu. Can I get you something to drink?', pt: 'Aqui está o cardápio. Posso trazer algo para beber?', icon: '🧑‍🍳' },
        { speaker: 'You', line: 'I\'ll have a lemonade, please.', pt: 'Vou querer uma limonada, por favor.', icon: '🙋' },
        { speaker: 'Waiter', line: 'Are you ready to order?', pt: 'Estão prontos para pedir?', icon: '🧑‍🍳' },
        { speaker: 'You', line: 'Yes! I would like the grilled chicken with fries.', pt: 'Sim! Eu gostaria do frango grelhado com batatas fritas.', icon: '🙋' },
        { speaker: 'Waiter', line: 'Excellent choice! Anything for dessert?', pt: 'Excelente escolha! Algo de sobremesa?', icon: '🧑‍🍳' },
        { speaker: 'You', line: 'A piece of chocolate cake, please. And the bill.', pt: 'Um pedaço de bolo de chocolate, por favor. E a conta.', icon: '🙋' },
    ];

    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Intro */}
            <div className="relative p-8 rounded-[2rem] bg-orange-900 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Utensils className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center text-4xl shadow-lg border-2 border-orange-400">🍽️</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif-display mb-2">
                            {isPortuguese ? "Comida e Bebida" : "Food & Drink"}
                        </h3>
                        <p className="text-orange-100 text-sm leading-relaxed italic">
                            {isPortuguese
                                ? "\"Pedir comida é uma das primeiras coisas que você fará em uma viagem. Não passe fome! Nesta lição você vai aprender mais de 100 palavras essenciais de comida e bebida, como pedir no restaurante e até os verbos de cozinhar!\""
                                : "\"Ordering food is one of the first things you'll do on a trip. Don't go hungry! In this lesson you'll learn over 100 essential food and drink words, how to order at a restaurant, and even cooking verbs!\""
                            }
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 bg-orange-700/50 px-3 py-1.5 rounded-full text-xs font-bold">
                            <Utensils className="w-3 h-3" /> {totalItems} {isPortuguese ? 'palavras nesta lição' : 'words in this lesson'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.id ? `${cat.headerBg} ${cat.headerText} shadow-md` : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                        {cat.title} <span className="text-[10px] opacity-60">({cat.items.length})</span>
                    </button>
                ))}
            </div>

            {/* Food Categories */}
            {categories.map(cat => {
                const isOpen = activeCategory === null || activeCategory === cat.id;
                if (!isOpen) return null;
                return (
                    <section key={cat.id} className="space-y-4 animate-fade-in">
                        <div className={`flex items-center gap-3 p-3 rounded-xl ${cat.headerBg}`}>
                            <h4 className={`text-lg font-bold ${cat.headerText}`}>{cat.title}</h4>
                            <span className={`text-xs font-medium ${cat.headerText} opacity-60`}>{cat.items.length} {isPortuguese ? 'itens' : 'items'}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {cat.items.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => speak(item.word)}
                                    className={`group p-4 rounded-2xl border-2 border-transparent hover:${cat.border} transition-all flex flex-col items-center gap-2 text-center ${cat.color} shadow-sm hover:shadow-md`}
                                >
                                    <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-sm">{item.word}</h5>
                                        <div className="text-[9px] font-mono text-slate-400">{item.ipa}</div>
                                        {isPortuguese && <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-tight mt-0.5">{item.trans}</div>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* Cooking Verbs */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Flame className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? '👨‍🍳 Verbos de Cozinhar' : '👨‍🍳 Cooking Verbs'}
                    </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cookingVerbs.map((v, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(v.ex)}
                            className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-rose-200 shadow-sm hover:shadow-md transition-all text-left"
                        >
                            <span className="text-2xl mb-2 block">{v.icon}</span>
                            <div className="flex items-baseline gap-1.5 mb-1">
                                <span className="font-black text-slate-800">{v.verb}</span>
                                <span className="text-[9px] font-mono text-slate-400">{v.ipa}</span>
                            </div>
                            <p className="text-xs text-rose-600 font-medium">{v.ex}</p>
                            {isPortuguese && <p className="text-[10px] text-slate-400 mt-0.5">{v.exPt}</p>}
                            {isPortuguese && <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-tight mt-1">{v.trans}</div>}
                        </button>
                    ))}
                </div>
            </section>

            {/* Ordering Section */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><MessageCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "🗣️ Como Pedir no Restaurante" : "🗣️ How to Order at a Restaurant"}
                    </h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                    {orderingPhrases.map((p, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(p.phrase)}
                            className="text-left bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex items-center gap-4"
                        >
                            <span className="text-2xl flex-shrink-0">{p.icon}</span>
                            <div className="flex-1">
                                <div className="font-bold text-slate-700 text-sm">{p.phrase}</div>
                                {isPortuguese && <div className="text-[11px] text-slate-400 mt-0.5">{p.trans}</div>}
                            </div>
                            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Dialogue */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><MessageCircle className="w-5 h-5" /></div>
                    <h4 className="text-2xl font-bold text-slate-800">
                        {isPortuguese ? "🎭 Diálogo no Restaurante" : "🎭 Restaurant Dialogue"}
                    </h4>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    {dialogue.map((d, idx) => (
                        <button
                            key={idx}
                            onClick={() => speak(d.line)}
                            className={`w-full text-left p-4 flex items-start gap-3 transition-all hover:bg-slate-50 group ${idx > 0 ? 'border-t border-slate-50' : ''}`}
                        >
                            <span className="text-xl flex-shrink-0">{d.icon}</span>
                            <div className="flex-1">
                                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">{d.speaker}</div>
                                <div className="text-sm font-medium text-slate-700">{d.line}</div>
                                {isPortuguese && <div className="text-[11px] text-slate-400 mt-0.5">{d.pt}</div>}
                            </div>
                            <Volume2 className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 mt-1 flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Golden Tip */}
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h5 className="font-bold text-amber-800 text-lg mb-1">{isPortuguese ? 'Dica de Ouro' : 'Golden Tip'}</h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {isPortuguese
                            ? "Nos países de língua inglesa, gorjeta (tip) é esperada! Nos EUA, 15-20% da conta é o padrão. 'Keep the change' (fique com o troco) é uma forma informal de dar gorjeta. E lembre-se: 'check' é 'conta' no inglês americano, 'bill' no britânico!"
                            : "In English-speaking countries, tipping is expected! In the US, 15-20% of the bill is standard. 'Keep the change' is an informal way to tip. And remember: 'check' is American English, 'bill' is British English for the same thing!"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};


const Placeholder = ({ title }: { title: string }) => <div className="p-12 bg-white rounded-3xl border border-slate-100 text-center text-slate-400 italic">Content for {title} coming soon.</div>;

// --- ADMIN & TEACHER PANELS ---

const TeacherSelector = ({ isOpen, onSelect }: { isOpen: boolean, onSelect: (teacherId: string) => void }) => {
    const [teachers, setTeachers] = useState<UserProfile[]>([]);

    useEffect(() => {
        if (isOpen) {
            userService.getTeachers().then(setTeachers);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl text-center">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Choose Your Teacher</h2>
                <p className="text-slate-500 mb-8">Select who will be guiding your English journey.</p>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {teachers.map(t => (
                        <button key={t.uid} onClick={() => onSelect(t.uid)}
                            className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-4 group text-left"
                        >
                            <img src={t.photoURL || `https://ui-avatars.com/api/?name=${t.name}+${t.surname}`} className="w-12 h-12 rounded-full" />
                            <div>
                                <div className="font-bold text-slate-800 group-hover:text-indigo-700">{t.name} {t.surname}</div>
                                <div className="text-xs text-slate-400">English Teacher</div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- UNIFIED PROFILE MODAL ---

const ProfileModal = ({ isOpen, onClose, currentUser, onUpdateUser }: { isOpen: boolean, onClose: () => void, currentUser: User, onUpdateUser: (u: User) => void }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'directory' | 'students'>('profile');
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [myStudents, setMyStudents] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit State
    const [editName, setEditName] = useState(currentUser.name);
    const [editSurname, setEditSurname] = useState(currentUser.surname);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActiveTab('profile'); // Reset to profile on open
            setEditName(currentUser.name);
            setEditSurname(currentUser.surname);
        }
    }, [isOpen, currentUser]);

    // Fetch Lists based on Tab
    useEffect(() => {
        if (!isOpen) return;

        if (activeTab === 'directory' && currentUser.role === 'admin') {
            setLoading(true);
            userService.getAllUsers().then(u => {
                setUsers(u);
                setLoading(false);
            });
        }

        if (activeTab === 'students' && currentUser.role === 'teacher') {
            setLoading(true);
            userService.getMyStudents(currentUser.uid).then(s => {
                setMyStudents(s);
                setLoading(false);
            });
        }
    }, [activeTab, isOpen, currentUser]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await userService.updateProfile(currentUser.uid, { name: editName, surname: editSurname });
            onUpdateUser({ ...currentUser, name: editName, surname: editSurname });
            alert('Profile updated successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePromote = async (uid: string, newRole: UserRole) => {
        if (currentUser.role !== 'admin') return;
        await userService.updateUserRole(uid, newRole);
        setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    };

    if (!isOpen) return null;

    // Filter directory list
    const admins = users.filter(u => u.role === 'admin');
    const teachers = users.filter(u => u.role === 'teacher');
    const studentsList = users.filter(u => u.role === 'student');

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-900/90 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-5xl h-[85vh] flex overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full z-10">
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                {/* Sidebar Navigation */}
                <div className="w-64 bg-slate-50 p-6 flex flex-col border-r border-slate-100 hidden md:flex">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-slate-800">Account</div>
                    </div>

                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('profile')} className={`w-full p-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'profile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
                            <UserIcon className="w-4 h-4" /> My Profile
                        </button>

                        {currentUser.role === 'teacher' && (
                            <button onClick={() => setActiveTab('students')} className={`w-full p-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'students' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
                                <Users className="w-4 h-4" /> My Students
                            </button>
                        )}

                        {currentUser.role === 'admin' && (
                            <button onClick={() => setActiveTab('directory')} className={`w-full p-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'directory' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
                                <Settings className="w-4 h-4" /> User Directory
                            </button>
                        )}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative">

                    {/* --- TAB: PROFILE --- */}
                    {activeTab === 'profile' && (
                        <div className="max-w-xl mx-auto animate-fade-in">
                            <h2 className="text-3xl font-serif-display text-slate-900 mb-2">My Profile</h2>
                            <p className="text-slate-500 mb-8">Manage your personal information.</p>

                            <div className="flex flex-col items-center mb-8">
                                <div className="relative mb-4 group cursor-pointer">
                                    <img src={currentUser.photoURL || currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}+${currentUser.surname}`} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-xl" />
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold text-xs">Change</div>
                                </div>
                                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">{currentUser.role}</div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase">First Name</label>
                                        <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Surname</label>
                                        <input value={editSurname} onChange={e => setEditSurname(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                                    <input value={currentUser.email} disabled className="w-full p-4 bg-slate-100 rounded-2xl font-bold text-slate-500 cursor-not-allowed" />
                                </div>

                                <div className="pt-6">
                                    <button onClick={handleSaveProfile} disabled={isSaving} className="w-full p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: DIRECTORY --- */}
                    {activeTab === 'directory' && currentUser.role === 'admin' && (
                        <div className="animate-fade-in space-y-8">
                            <div>
                                <h2 className="text-3xl font-serif-display text-slate-900 mb-2">User Directory</h2>
                                <p className="text-slate-500">Manage {users.length} registered users.</p>
                            </div>

                            {loading ? <div className="text-center py-10 text-slate-400">Loading directory...</div> : (
                                <div className="space-y-8">
                                    {[
                                        { title: 'Administrators', list: admins, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                        { title: 'Teachers', list: teachers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { title: 'Students', list: studentsList, color: 'text-slate-600', bg: 'bg-slate-50' }
                                    ].map(group => group.list.length > 0 && (
                                        <div key={group.title}>
                                            <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${group.color}`}>{group.title}</h3>
                                            <div className="grid gap-3">
                                                {group.list.map(u => (
                                                    <div key={u.uid} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.name}+${u.surname}`} className="w-10 h-10 rounded-full" />
                                                            <div>
                                                                <div className="font-bold text-slate-800">{u.name} {u.surname}</div>
                                                                <div className="text-xs text-slate-400">{u.email}</div>
                                                            </div>
                                                        </div>

                                                        {currentUser.email !== u.email && (
                                                            <div className="flex items-center gap-2">
                                                                {u.role !== 'admin' && (
                                                                    <button onClick={() => handlePromote(u.uid, 'admin')} title="Make Admin" className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Settings className="w-4 h-4" /></button>
                                                                )}
                                                                {u.role !== 'teacher' && (
                                                                    <button onClick={() => handlePromote(u.uid, 'teacher')} title="Make Teacher" className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"><GraduationCap className="w-4 h-4" /></button>
                                                                )}
                                                                {u.role !== 'student' && (
                                                                    <button onClick={() => handlePromote(u.uid, 'student')} title="Demote to Student" className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"><ArrowRight className="w-4 h-4 rotate-90" /></button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB: MY STUDENTS --- */}
                    {activeTab === 'students' && currentUser.role === 'teacher' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-serif-display text-slate-900 mb-2">My Students</h2>
                            <p className="text-slate-500 mb-8">Tracking {myStudents.length} learners.</p>

                            {loading ? <div className="text-center py-10 text-slate-400">Loading students...</div> : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {myStudents.map(s => (
                                        <div key={s.uid} className="p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all bg-white hover:-translate-y-1">
                                            <img src={s.photoURL || `https://ui-avatars.com/api/?name=${s.name}+${s.surname}`} className="w-14 h-14 rounded-full border-4 border-slate-50" />
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg">{s.name} {s.surname}</h4>
                                                <p className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-md inline-block mt-1">{s.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};







// --- LAYOUT COMPONENTS ---

const WelcomeScreen = ({ onSelectLevel, user, onLogin, onSignup, unlockedLevels = [1], completedCount = 0 }: any) => (
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

            {!user ? (
                <div className="flex gap-4 animate-fade-in">

                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl animate-fade-in">
                    <LevelCard
                        title="Basic"
                        desc="Essential foundations: Grammar, phonetics & basic vocabulary."
                        icon={<ZapIcon className="w-6 h-6" />}
                        onClick={() => onSelectLevel(1)}
                        available={true}
                        color="from-indigo-600 to-indigo-700"
                    />
                    <LevelCard
                        title="Pre-Intermediate"
                        desc="Expanding reach with complex structures."
                        icon={<Layers className="w-6 h-6" />}
                        onClick={() => onSelectLevel(2)}
                        available={true}
                        color="from-blue-600 to-blue-700"
                    />
                    <LevelCard
                        title="Intermediate"
                        desc="Fluent conversations & professional writing."
                        icon={<Globe className="w-6 h-6" />}
                        onClick={() => onSelectLevel(3)}
                        available={true}
                        color="from-emerald-600 to-emerald-700"
                    />
                    <LevelCard
                        title="Advanced"
                        desc="Native-level nuance & logic."
                        icon={<Award className="w-6 h-6" />}
                        onClick={() => onSelectLevel(4)}
                        available={true}
                        color="from-rose-600 to-rose-700"
                    />
                </div>
            )}
        </div>
    </div>
);

const LevelCard = ({ title, desc, icon, onClick, available, color }: any) => {
    return (
        <button onClick={onClick} className={`group relative p-8 glass-card rounded-[2rem] text-left transition-all duration-500 flex flex-col h-full hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-indigo-500/20`}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between">
                {title}
            </h3>

            <p className="text-sm leading-relaxed mb-8 flex-1 text-slate-400">
                {desc}
            </p>

            <div className="inline-flex items-center gap-2 font-bold text-sm text-indigo-400">
                Start Learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
        </button>
    );
};

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

const BuildingLesson = ({ title, isPortuguese }: { title: string, isPortuguese: boolean }) => (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl">
            <Wrench className="w-10 h-10 text-indigo-400 animate-pulse" />
        </div>
        <h3 className="text-3xl font-serif-display text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 max-w-md">
            {isPortuguese
                ? "Esta lição está atualmente em construção. Estamos lapidando este material com muito carinho para garantir o melhor aprendizado!"
                : "This lesson is currently under construction. We are carefully crafting this material to ensure the best learning experience!"
            }
        </p>
    </div>
);

const Sidebar = ({ activeModule, onToggleModule, activeSection, onSelectSection, onBack, currentLevel, user, onLogout, completedLessons = [], isMobileMenuOpen, onCloseMobileMenu }: any) => {
    const allModules = [
        { level: 1, id: 1, title: 'First Steps', icon: <Star className="w-4 h-4" />, range: [0, 4] },
        { level: 1, id: 2, title: 'Nouns & Characteristics', icon: <BookOpen className="w-4 h-4" />, range: [5, 9] },
        { level: 1, id: 3, title: 'Quantity & Pointers', icon: <Hash className="w-4 h-4" />, range: [10, 13] },
        { level: 1, id: 4, title: 'Belonging & Family', icon: <User className="w-4 h-4" />, range: [14, 17] },
        { level: 1, id: 5, title: 'Space & Existence', icon: <MapPin className="w-4 h-4" />, range: [18, 20] },
        { level: 1, id: 6, title: 'Time & Routine', icon: <Clock className="w-4 h-4" />, range: [21, 26] },
        { level: 1, id: 7, title: 'Interaction & Ability', icon: <MessageCircle className="w-4 h-4" />, range: [27, 30] },
        // Level 2
        { level: 2, id: 8, title: 'The Past', icon: <IterationCw className="w-4 h-4" />, range: [31, 35] },
        { level: 2, id: 9, title: 'Quantities', icon: <ShoppingBag className="w-4 h-4" />, range: [36, 39] },
        { level: 2, id: 10, title: 'Continuous Actions', icon: <Activity className="w-4 h-4" />, range: [40, 43] },
        { level: 2, id: 11, title: 'Comparisons', icon: <Scale className="w-4 h-4" />, range: [44, 45] },
        { level: 2, id: 12, title: 'Future & Manner', icon: <Compass className="w-4 h-4" />, range: [46, 48] },
        // Level 3
        { level: 3, id: 13, title: 'The Future', icon: <FastIcon className="w-4 h-4" />, range: [49, 51] },
        { level: 3, id: 14, title: 'Modals & Conditions', icon: <AlertCircle className="w-4 h-4" />, range: [52, 56] },
        { level: 3, id: 15, title: 'Present Perfect', icon: <CheckCircle2 className="w-4 h-4" />, range: [57, 61] },
        { level: 3, id: 16, title: 'Clauses & Vocabulary', icon: <List className="w-4 h-4" />, range: [62, 66] },
        { level: 3, id: 17, title: 'Narrative Tenses', icon: <BookOpen className="w-4 h-4" />, range: [67, 69] },
        // Level 4
        { level: 4, id: 18, title: 'Passive Voice', icon: <Repeat className="w-4 h-4" />, range: [70, 72] },
        { level: 4, id: 19, title: 'Advanced Conditionals', icon: <HelpCircle className="w-4 h-4" />, range: [73, 76] },
        { level: 4, id: 20, title: 'Reported Speech', icon: <MessageSquare className="w-4 h-4" />, range: [77, 78] },
        { level: 4, id: 21, title: 'Perfect Tenses', icon: <Clock className="w-4 h-4" />, range: [79, 83] },
        { level: 4, id: 22, title: 'Advanced Cohesion', icon: <Link className="w-4 h-4" />, range: [84, 88] },
        { level: 4, id: 23, title: 'Mastery', icon: <Award className="w-4 h-4" />, range: [89, 94] }
    ];

    const modules = allModules.filter(m => m.level === currentLevel);

    const levelNames: any = { 1: 'Basic', 2: 'Pre-Intermediate', 3: 'Intermediate', 4: 'Advanced' };

    const getTitle = (idx: number) => {
        const titles = [
            // M1
            'Greetings & Farewells', 'Alphabet & Spelling', 'Subject Pronouns', 'Verb To Be (+)', 'Verb To Be (-/?)',
            // M2
            'Indefinite Articles', 'Jobs & Occupations', 'Singular/Plural', 'Colors & Adjectives', 'Countries & Nationalities',
            // M3
            'Numbers 0-20', 'Numbers 20-100', 'Big Numbers', 'Demonstrative Pronouns',
            // M4
            'Family Members', 'Verb to Have', "Possessive Case", "Genitive Case ('s)",
            // M5
            'House & Furniture', 'Prepositions of Place', 'There Is / There Are',
            // M6
            'Days & Months', 'Telling Time', 'Wh- Questions', 'Present Simple Rules', 'Daily Routine', 'Adverbs of Frequency',
            // M7
            'Object Pronouns', 'Imperatives', "Can / Can't", 'Food & Drink',
            // M8
            'Dates & Ordinal Numbers', 'Time Expressions for Past', 'Past Simple: Verb To Be', 'Past Simple: Regular Verbs', 'Past Simple: Irregular Verbs',
            // M9
            'Countable vs. Uncountable', 'Some / Any / No', 'Quantifiers (Much, Many...)', 'Clothes & Shopping Vocabulary',
            // M10
            'Weather & Seasons Vocabulary', 'Present Continuous', 'Present Simple vs. Continuous', 'Stative Verbs',
            // M11
            'Comparative Adjectives', 'Superlative Adjectives',
            // M12
            'Future with Going To', 'Adverbs of Manner', 'Prepositions of Time',
            // M13
            'Future with Will', 'Will vs. Going to', 'Continuous for Future Arrangements',
            // M14
            'Modals of Obligation', 'Modals of Advice', 'Modals of Possibility', 'Zero Conditional', 'First Conditional',
            // M15
            'Present Perfect Simple', 'Present Perfect: Ever / Never', 'Present Perfect: Just / Already', 'Present Perfect: For / Since', 'Present Perfect vs. Past Simple',
            // M16
            'Relative Pronouns', 'Defining Relative Clauses', 'Indefinite Pronouns', 'Reflexive Pronouns', 'Phrasal Verbs (Intro)',
            // M17
            'Past Continuous', 'Past Simple vs. Continuous', 'Used to',
            // M18
            'Passive Voice: Present Simple', 'Passive Voice: Past Simple', 'Passive Voice: Other Tenses',
            // M19
            'Second Conditional', 'Third Conditional', 'Mixed Conditionals', 'Wish / If only',
            // M20
            'Reported Speech: Statements', 'Reported Speech: Questions & Commands',
            // M21
            'Past Perfect Simple', 'Past Perfect vs. Past Simple', 'Present Perfect Continuous', 'Present Perfect Simple vs. Continuous', 'Future Perfect & Continuous',
            // M22
            'Non-defining Relative Clauses', 'Connectors & Linking Words', 'Question Tags', 'Too / Enough / So / Such', 'Causative Form',
            // M23
            'Modals of Deduction (Past)', 'Inversion', 'Cleft Sentences', 'Participle Clauses', 'Subjunctive Mood', 'Idioms & Collocations'
        ];
        return titles[idx] || `Lesson ${idx + 1}`;
    };

    const isModuleCompleted = (m: any) => {
        const totalLessons = m.range[1] - m.range[0] + 1;
        const lessonsInModule = Array.from({ length: totalLessons }, (_, i) => m.range[0] + i);
        return lessonsInModule.every(id => completedLessons.includes(id));
    };

    return (
        <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full lg:w-80 sidebar-glass h-screen overflow-y-auto flex-col shadow-2xl relative z-20`}>
            <div className="p-8 border-b border-white/5 flex flex-col gap-6 sticky top-0 bg-[#0f172a]/80 backdrop-blur-xl z-10">
                <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-all text-xs font-bold tracking-widest uppercase">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Menu
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
                {modules.map(m => {
                    const isLocked = false; // All modules are globally unlocked as per premium feature specification.

                    return (
                        <div key={m.id} className={`rounded-2xl overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
                            <button onClick={() => !isLocked && onToggleModule(m.id)}
                                disabled={isLocked}
                                className={`w-full p-4 flex items-center justify-between text-sm font-semibold transition-all ${activeModule === m.id ? 'bg-indigo-500/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'} ${isLocked ? 'cursor-not-allowed hover:bg-transparent hover:text-slate-400' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg relative ${activeModule === m.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                        {isLocked ? <LockIcon className="w-4 h-4" /> : m.icon}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[11px] font-black tracking-widest uppercase text-indigo-400">
                                            {`M${m.id}`}
                                        </span>
                                        <span className="truncate">{m.title}</span>
                                    </div>
                                </div>
                                {isLocked ? null : (activeModule === m.id ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 opacity-30" />)}
                            </button>

                            {activeModule === m.id && !isLocked && (
                                <div className="mt-1 ml-4 border-l border-white/5 space-y-1 pl-2 animate-fade-in">
                                    {Array.from({ length: m.range[1] - m.range[0] + 1 }, (_, i) => m.range[0] + i).map(idx => {
                                        return (
                                            <button key={idx} onClick={() => { onSelectSection(idx); onCloseMobileMenu(); }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all flex items-center gap-3 ${activeSection === idx ? 'bg-white/10 text-indigo-400 shadow-inner' : 'text-slate-500 hover:text-slate-500'}`} // Fixed hover text color on inner buttons generally or relevant logic
                                            >
                                                <div className={`w-1 h-1 rounded-full transition-all ${activeSection === idx ? 'bg-indigo-400 scale-150 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-slate-700'}`} />
                                                <span>
                                                    {getTitle(idx)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Profile Footer */}

            {/* Irregular Verbs Reference Button */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => { onSelectSection(-1); onCloseMobileMenu(); }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${activeSection === -1 ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-indigo-400 hover:bg-white/5'}`}
                >
                    <div className={`p-1.5 rounded-lg ${activeSection === -1 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <span>📖 Irregular Verbs Table</span>
                </button>
            </div>
        </aside>
    );
};

// --- LANGUAGE TOGGLE COMPONENT ---
const FloatingLanguageToggle = ({ isPortuguese, onToggle }: { isPortuguese: boolean, onToggle: (val: boolean) => void }) => {
    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:right-12 md:translate-x-0 z-[100] animate-slide-up" style={{ animationDelay: '1s' }}>
            <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-indigo-100 flex items-center gap-1 shadow-2xl language-toggle-shadow">
                <button
                    onClick={() => onToggle(false)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${!isPortuguese ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <span className="text-base">🇺🇸</span> English
                </button>
                <button
                    onClick={() => onToggle(true)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isPortuguese ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <span className="text-base">🇧🇷</span> Português
                </button>
            </div>
        </div>
    );
}

export default function App() {
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [activeModule, setActiveModule] = useState<number | null>(1);
    const [activeSection, setActiveSection] = useState(0);
    const [isPortuguese, setIsPortuguese] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

    // Auth State
    // Auth State
    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isTeacherSelectorOpen, setIsTeacherSelectorOpen] = useState(false);
    // const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup'); // Removed
    const [progress, setProgress] = useState<UserProgress>({ completedLessons: [], unlockedLevels: [1] });

    // Check for Student without Teacher
    useEffect(() => {
        if (user && user.role === 'student' && !user.teacherId) {
            setIsTeacherSelectorOpen(true);
        }
    }, [user]);

    // --- VOICE WARM-UP FIX ---
    useEffect(() => {
        const loadVoices = () => window.speechSynthesis.getVoices();
        loadVoices();
        // Some browsers need the event listener to trigger the load
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    const handleAssignTeacher = async (teacherId: string) => {
        if (user) {
            await userService.assignTeacher(user.uid, teacherId);
            setUser({ ...user, teacherId });
            setIsTeacherSelectorOpen(false);
            alert("Teacher assigned successfully! 🎉");
        }
    };

    // Load Progress & Profile (Silent Guest Mode)
    useEffect(() => {
        const initUser = async () => {
            let user = await userService.getCurrentUser();

            // If no user, create Guest automatically
            if (!user) {
                user = {
                    uid: 'guest',
                    email: '',
                    name: 'Student',
                    surname: '',
                    role: 'student'
                };
                await userService.createUser(user);
            }

            // Load State
            setUser(user);
            // Default to all levels unlocked for reference mode
            setProgress({ completedLessons: [], unlockedLevels: [1, 2, 3, 4] });
        };
        initUser();
    }, []);

    // Event Listeners for Panels
    useEffect(() => {
        const openProfile = () => setIsProfileModalOpen(true);
        document.addEventListener('openProfileModal', openProfile);
        return () => document.removeEventListener('openProfileModal', openProfile);
    }, []);

    const handleLessonComplete = async (lessonId: number) => {
        if (!user) return; // Use local user state

        const isCompleted = progress.completedLessons.includes(lessonId);
        const newCompleted = isCompleted
            ? progress.completedLessons.filter(id => id !== lessonId)
            : [...progress.completedLessons, lessonId];

        // Optimistic Update
        setProgress(prev => ({ ...prev, completedLessons: newCompleted }));

        await progressService.toggleLessonCompletion(user.uid, lessonId, !isCompleted);

        // Check Level Completion
        if (!isCompleted && newCompleted.length >= 25 && !progress.unlockedLevels.includes(2)) {
            await progressService.unlockLevel(user.uid, 2);
            setProgress(prev => ({ ...prev, unlockedLevels: [...prev.unlockedLevels, 2] }));
            alert("🎉 Congratulations! You've unlocked Level 2: Pre-Intermediate!");
        }
    };







    const renderContent = () => {
        // Find title dynamically from Sidebar's logical equivalent if possible, or just pass generic for building
        const getTitleForBuilding = (idx: number) => {
            const titles = [
                'Greetings & Farewells', 'Alphabet & Spelling', 'Subject Pronouns', 'Verb To Be (+)', 'Verb To Be (-/?)',
                'Indefinite Articles', 'Jobs & Occupations', 'Singular/Plural', 'Colors & Adjectives', 'Countries & Nationalities',
                'Numbers 0-20', 'Numbers 20-100', 'Big Numbers', 'Demonstrative Pronouns',
                'Family Members', 'Verb to Have', "Possessive Case", "Genitive Case ('s)",
                'House & Furniture', 'Prepositions of Place', 'There Is / There Are',
                'Days & Months', 'Telling Time', 'Wh- Questions', 'Present Simple Rules', 'Daily Routine', 'Adverbs of Frequency',
                'Object Pronouns', 'Imperatives', "Can / Can't", 'Food & Drink',
                'Dates & Ordinal Numbers', 'Time Expressions for Past', 'Past Simple: Verb To Be', 'Past Simple: Regular Verbs', 'Past Simple: Irregular Verbs',
                'Countable vs. Uncountable', 'Some / Any / No', 'Quantifiers (Much, Many...)', 'Clothes & Shopping Vocabulary',
                'Weather & Seasons Vocabulary', 'Present Continuous', 'Present Simple vs. Continuous', 'Stative Verbs',
                'Comparative Adjectives', 'Superlative Adjectives',
                'Future with Going To', 'Adverbs of Manner', 'Prepositions of Time',
                'Future with Will', 'Will vs. Going to', 'Continuous for Future Arrangements',
                'Modals of Obligation', 'Modals of Advice', 'Modals of Possibility', 'Zero Conditional', 'First Conditional',
                'Present Perfect Simple', 'Present Perfect: Ever / Never', 'Present Perfect: Just / Already', 'Present Perfect: For / Since', 'Present Perfect vs. Past Simple',
                'Relative Pronouns', 'Defining Relative Clauses', 'Indefinite Pronouns', 'Reflexive Pronouns', 'Phrasal Verbs (Intro)',
                'Past Continuous', 'Past Simple vs. Continuous', 'Used to',
                'Passive Voice: Present Simple', 'Passive Voice: Past Simple', 'Passive Voice: Other Tenses',
                'Second Conditional', 'Third Conditional', 'Mixed Conditionals', 'Wish / If only',
                'Reported Speech: Statements', 'Reported Speech: Questions & Commands',
                'Past Perfect Simple', 'Past Perfect vs. Past Simple', 'Present Perfect Continuous', 'Present Perfect Simple vs. Continuous', 'Future Perfect & Continuous',
                'Non-defining Relative Clauses', 'Connectors & Linking Words', 'Question Tags', 'Too / Enough / So / Such', 'Causative Form',
                'Modals of Deduction (Past)', 'Inversion', 'Cleft Sentences', 'Participle Clauses', 'Subjunctive Mood', 'Idioms & Collocations'
            ];
            return titles[idx] || `Lesson ${idx + 1}`;
        }

        switch (activeSection) {
            case 0: return <GreetingsFarewells isPortuguese={isPortuguese} />;
            case 1: return <AlphabetSpelling isPortuguese={isPortuguese} />;
            case 2: return <SubjectPronouns isPortuguese={isPortuguese} />;
            case 3: return <VerbToBeAffirmative isPortuguese={isPortuguese} />;
            case 4: return <VerbToBeNegInt isPortuguese={isPortuguese} />;
            case 5: return <IndefiniteArticles isPortuguese={isPortuguese} />;
            case 6: return <JobsOccupations isPortuguese={isPortuguese} />;
            case 7: return <SingularPlural isPortuguese={isPortuguese} />;
            case 8: return <ColorsAdjectives isPortuguese={isPortuguese} />;
            case 9: return <CountriesNationalities isPortuguese={isPortuguese} />;
            case 10: return <NumbersZeroToTwenty isPortuguese={isPortuguese} />;
            case 11: return <NumbersTwentyHundred isPortuguese={isPortuguese} />;
            case 12: return <BigNumbers isPortuguese={isPortuguese} />;
            case 13: return <DemonstrativesNew isPortuguese={isPortuguese} />;
            case 14: return <FamilyVocabulary isPortuguese={isPortuguese} />;
            case 15: return <VerbToHave isPortuguese={isPortuguese} />;
            case 16: return <PossessivesLesson isPortuguese={isPortuguese} />;
            case 17: return <GenitiveCase isPortuguese={isPortuguese} />;
            case 18: return <HouseFurniture isPortuguese={isPortuguese} />;
            case 19: return <PrepositionsPlace isPortuguese={isPortuguese} />;
            case 20: return <ThereIsAre isPortuguese={isPortuguese} />;
            case 21: return <DaysMonths isPortuguese={isPortuguese} />;
            case 22: return <TellingTime isPortuguese={isPortuguese} />;
            case 23: return <WhQuestions isPortuguese={isPortuguese} />;
            case 24: return <PresentSimpleRules mode="base" isPortuguese={isPortuguese} />;
            case 25: return <DailyRoutine isPortuguese={isPortuguese} />;
            case 26: return <AdverbsFrequency isPortuguese={isPortuguese} />;
            case 27: return <ObjectPronouns isPortuguese={isPortuguese} />;
            case 28: return <ImperativesLesson isPortuguese={isPortuguese} />;
            case 29: return <CanCantLesson isPortuguese={isPortuguese} />;
            case 30: return <FoodAndDrink isPortuguese={isPortuguese} />;
            case 31: return <DatesOrdinalNumbers isPortuguese={isPortuguese} />;
            case 32: return <TimeExpressionsPast isPortuguese={isPortuguese} />;
            case 33: return <PastSimpleLesson isPortuguese={isPortuguese} />;
            case 34: return <PastSimpleRegularVerbs isPortuguese={isPortuguese} />;
            case 35: return <PastSimpleIrregularVerbs isPortuguese={isPortuguese} />;
            case -1: return <IrregularVerbsReference isPortuguese={isPortuguese} />;
            default: return <BuildingLesson title={getTitleForBuilding(activeSection)} isPortuguese={isPortuguese} />;
        }
    };

    // Auto-Guest Mode means we always have a user after the effect runs
    // But while loading, we might want a loader or just return null to avoid flicker
    if (!user) {
        return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
    }

    if (!currentLevel) {
        // Show Level Select (Home)
        return (
            <>
                <style>{globalStyles}</style>
                <WelcomeScreen
                    onSelectLevel={setCurrentLevel}
                    user={user}
                    onLogin={() => { }} // No-op
                    onSignup={() => { }} // No-op
                    unlockedLevels={progress.unlockedLevels}
                    completedCount={progress.completedLessons.length}
                />
            </>
        );
    }

    // Levels 2, 3, and 4 are now unlocked and render their own sidebars without triggering UnderConstruction.

    return (
        <>
            <style>{globalStyles}</style>
            <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] relative">
                <Sidebar
                    activeModule={activeModule}
                    onToggleModule={(id: any) => setActiveModule(activeModule === id ? null : id)}
                    activeSection={activeSection}
                    onSelectSection={setActiveSection}
                    onBack={() => setCurrentLevel(null)}
                    currentLevel={currentLevel}
                    user={user}
                    onLogout={() => { }} // No-op
                    completedLessons={progress.completedLessons}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                />

                <main className={`flex-1 h-screen overflow-y-auto p-6 md:p-12 lg:p-20 relative scroll-smooth no-scrollbar ${!isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-16 animate-fade-in">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden flex items-center gap-2 text-indigo-500 mb-6 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Menu
                            </button>

                            <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-4">
                                <Sparkles className="w-4 h-4" /> Matthew's Curriculum
                            </div>
                            <h2 className="text-5xl font-serif-display text-slate-900 tracking-tight">
                                {isPortuguese ? "Contexto da Lição" : "Lesson Context"}
                            </h2>
                            <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-6"></div>
                        </header>
                        <div className="pb-32">
                            {renderContent()}


                        </div>
                    </div>
                </main>

                {/* Floating Language Switcher */}
                <FloatingLanguageToggle isPortuguese={isPortuguese} onToggle={setIsPortuguese} />
            </div>
        </>
    );
}
