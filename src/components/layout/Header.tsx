"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, UserCircle, LogOut, ChevronDown, Settings, LayoutDashboard, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        const checkRole = async () => {
            if (user) {
                if (user.email === 'praxispsicanaliticarevista@gmail.com') {
                    setIsAdmin(true);
                    return;
                }
                try {
                    const snap = await getDoc(doc(db, "users", user.uid));
                    if (snap.exists() && snap.data().role === 'admin') setIsAdmin(true);
                } catch (err) { }
            }
        };
        checkRole();

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [user]);

    const navItems = [
        { label: 'Início', href: '/' },
        { label: 'Sobre', href: '/sobre' },
        { label: 'Edições', href: '/edicoes' },
        { label: 'Submissão', href: '/submissao' },
        { label: 'Contato', href: '/contato' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container-custom h-[var(--header-height)] flex items-center justify-between">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/logoradape.png"
                        alt="Revista Práxis Psicanalítica"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="text-slate-900 font-bold text-lg leading-tight tracking-tight">
                            PRÁXIS
                        </span>
                        <span className="text-slate-500 text-xs uppercase tracking-widest font-medium">
                            Psicanalítica
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wide"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions Area */}
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" aria-label="Buscar">
                        <Search size={20} />
                    </button>
                    <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors focus:outline-none py-2"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle size={18} />}
                                </div>
                                Olá, {user.displayName?.split(' ')[0] || 'Autor'}
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right z-50">
                                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-sm font-bold text-slate-900 truncate">{user.displayName || 'Usuário'}</p>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/painel"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-bold"
                                        >
                                            <LayoutDashboard size={16} /> Meu Painel (Autor)
                                        </Link>
                                        <Link
                                            href="/submissao/nova"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                                        >
                                            <Upload size={16} /> Nova Submissão
                                        </Link>
                                        {isAdmin && (
                                            <div className="pt-2 mt-2 border-t border-slate-100">
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors font-bold"
                                                >
                                                    <Settings size={16} /> Gestão Editorial
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-slate-50">
                                        <button
                                            onClick={() => { setIsMenuOpen(false); logout(); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sair da Conta
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                            <UserCircle size={20} />
                            <span>Login</span>
                        </Link>
                    )}

                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-700">
                        {isMobileMenuOpen ? <ChevronDown size={24} className="rotate-180 transition-transform" /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-md p-4 flex justify-center z-40">
                    <div className="container-custom w-full max-w-2xl flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Buscar artigos, autores, palavras-chave..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    alert('Funcionalidade de busca estará disponível em breve!');
                                }
                            }}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        <button onClick={() => alert('Funcionalidade de busca estará disponível em breve!')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 whitespace-nowrap">
                            Buscar
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg z-40" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="flex flex-col p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile User Actions */}
                        <div className="pt-4 mt-2 border-t border-slate-100">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-2 text-sm text-slate-500 mb-2 border-b border-slate-50 pb-3">Conectado como <span className="font-bold text-slate-900 block truncate">{user.displayName || user.email}</span></div>
                                    <Link href="/painel" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-slate-50 text-slate-700 rounded-lg font-bold">
                                        <LayoutDashboard size={18} /> Meu Painel (Autor)
                                    </Link>
                                    <Link href="/submissao/nova" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-slate-50 text-slate-700 rounded-lg font-bold">
                                        <Upload size={18} /> Nova Submissão
                                    </Link>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-700 rounded-lg font-bold">
                                            <Settings size={18} /> Gestão Editorial
                                        </Link>
                                    )}
                                    <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-bold mt-4">
                                        <LogOut size={18} /> Sair da Conta
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md shadow-blue-200">
                                    <UserCircle size={20} /> Fazer Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
