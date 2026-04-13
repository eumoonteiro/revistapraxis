"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bell, ArrowLeft, Calendar, ExternalLink, Loader2, Share2, Printer } from 'lucide-react';
import Link from 'next/link';

function NoticiaVerContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [noticia, setNoticia] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticia = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "news", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNoticia({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (err) {
                console.error("Erro ao buscar notícia:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNoticia();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen py-40 flex flex-col justify-center items-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-slate-500 font-medium animate-pulse">Carregando informações...</p>
            </div>
        );
    }

    if (!noticia) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col justify-center items-center text-center px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <Bell size={40} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Notícia não encontrada</h1>
                <p className="text-slate-600 mb-8 max-w-md">O conteúdo que você está procurando pode ter sido removido ou o link está incorreto.</p>
                <Link href="/noticias" className="btn-primary flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar para Notícias
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-32 pt-[var(--header-height)]">
            {/* Top Navigation Bar */}
            <div className="bg-slate-50 border-b border-slate-100 py-4">
                <div className="container-custom flex items-center justify-between">
                    <Link href="/noticias" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold">
                        <ArrowLeft size={16} /> Voltar para o Mural
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Imprimir">
                            <Printer size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Compartilhar">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <article className="container-custom max-w-4xl py-12 md:py-20">
                {/* Meta Information */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.15em] rounded-full shadow-lg shadow-blue-100">
                            Chamada Aberta
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                            <Calendar size={16} />
                            {noticia.createdAt?.toDate ? new Date(noticia.createdAt.toDate()).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            }) : 'Recentemente'}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight italic">
                        {noticia.title}
                    </h1>

                    <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
                </header>

                {/* Featured Image */}
                {noticia.imageUrl && (
                    <div className="mb-16 relative rounded-3xl overflow-hidden shadow-2xl group">
                        <img 
                            src={noticia.imageUrl} 
                            alt={noticia.title}
                            className="w-full h-auto object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg prose-slate max-w-none">
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-xl font-medium">
                        {noticia.description}
                    </div>
                </div>

                {/* Call to Action Box */}
                <div className="mt-20 p-10 md:p-16 bg-slate-950 rounded-[2.5rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-4">Interessado nesta chamada?</h2>
                            <p className="text-slate-400 text-lg">Confira todas as diretrizes e submeta seu trabalho através do portal.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link 
                                href={noticia.link || "/submissao/nova"}
                                className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-center hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                            >
                                ACESSAR DIRETRIZES <ExternalLink size={20} />
                            </Link>
                            <Link 
                                href="/submissao"
                                className="px-8 py-4 bg-slate-900 text-white border border-slate-800 rounded-2xl font-bold text-center hover:bg-slate-800 transition-all"
                            >
                                Portal de Submissão
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default function NoticiaVerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen py-40 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
            <NoticiaVerContent />
        </Suspense>
    );
}
