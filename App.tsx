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
    Sparkles, ShieldCheck, Rocket, ZapIcon, Quote, Lightbulb, GraduationCap as TeacherIcon,
    Languages, Keyboard, Fingerprint, MousePointer2, SpellCheck, UserCheck, Flame, HelpCircle as QuestionIcon
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
        { phrase: "What's up?", ipa: "/wʌts ʌp/", trans: "E aí?", example: "Hey man, what's up? Nothing much." },
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
            <div className="p-6 bg-rose-50 border-2 border-rose-100 rounded-[2rem] flex gap-5 shadow-sm">
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
                                    <button onClick={() => speak(g.phrase)} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-indigo-600"><Volume2 className="w-4 h-4"/></button>
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
                                    <button onClick={() => speak(g.phrase)} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-indigo-600"><Volume2 className="w-4 h-4"/></button>
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
                                className={`w-full group relative p-5 rounded-3xl border-2 border-transparent hover:border-indigo-200 transition-all flex items-center gap-4 text-left ${p.bg} shadow-sm`}
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
                                className={`w-full group relative p-5 rounded-3xl border-2 border-transparent hover:border-blue-200 transition-all flex items-center gap-4 text-left ${p.bg} shadow-sm`}
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
                            className={`p-6 rounded-[2rem] border-2 transition-all hover:shadow-lg flex flex-col items-center text-center ${colors[c.color]}`}
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
                    <X className="w-4 h-4"/> 
                    {isPortuguese ? "Negativa" : "Negative"}
                </button>
                <button 
                    onClick={() => setMode('int')} 
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${mode === 'int' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <QuestionIcon className="w-4 h-4"/> 
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

    const renderContent = () => {
        switch(activeSection) {
            case 0: return <GreetingsFarewells isPortuguese={isPortuguese} />;
            case 1: return <AlphabetSpelling isPortuguese={isPortuguese} />;
            case 2: return <SubjectPronouns isPortuguese={isPortuguese} />;
            case 3: return <VerbToBeAffirmative isPortuguese={isPortuguese} />;
            case 4: return <VerbToBeNegInt isPortuguese={isPortuguese} />;
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
            <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] relative">
                <Sidebar 
                    activeModule={activeModule}
                    onToggleModule={(id: any) => setActiveModule(activeModule === id ? null : id)}
                    activeSection={activeSection}
                    onSelectSection={setActiveSection}
                    onBack={() => setCurrentLevel(null)}
                    currentLevel={currentLevel}
                />
                <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12 lg:p-20 relative scroll-smooth no-scrollbar">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-16 animate-fade-in">
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
