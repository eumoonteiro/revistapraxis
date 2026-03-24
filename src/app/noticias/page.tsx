"use client";
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bell, ArrowRight, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NoticiasPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
                const snap = await getDocs(q);
                // Filter out logically deleted news
                const data = snap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter((item: any) => item.status !== 'deleted');
                setNews(data);
            } catch (err) {
                console.error("Error fetching news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return (
        <div className="min-h-screen py-20 flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                       <Bell size={14} /> Mural de Avisos
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Notícias e Chamadas</h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Fique por dentro das chamadas para dossiês temáticos, eventos e atualizações do conselho editorial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {news.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                {item.imageUrl ? (
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Bell size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                                        Chamada Aberta
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                                    <Calendar size={14} />
                                    {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Recentemente'}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-4">
                                    {item.description}
                                </p>
                                
                                <div className="mt-auto pt-6 border-t border-slate-50">
                                    <Link 
                                        href={item.link || "/submissao/nova"} 
                                        className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all"
                                    >
                                        Acesse as Diretrizes <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {news.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 italic">Nenhum aviso ou chamada publicada no momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
