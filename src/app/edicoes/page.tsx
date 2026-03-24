"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EditionsPage() {
    const [editions, setEditions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEditions = async () => {
            try {
                // Fetch editions from Firebase
                const q = query(collection(db, "editions"), orderBy("createdAt", "desc"));
                const snap = await getDocs(q);

                // Colors array to make covers look colorful
                const colors = ['bg-blue-900', 'bg-slate-800', 'bg-indigo-900', 'bg-slate-700', 'bg-teal-900'];

                const data = snap.docs
                    .filter(doc => doc.data().status === 'published')
                    .map((doc, index) => ({
                        id: doc.id,
                        coverColor: colors[index % colors.length],
                        ...doc.data()
                    }));

                setEditions(data);
            } catch (error) {
                console.error("Erro ao carregar edições:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEditions();
    }, []);

    if (loading) {
        return <div className="min-h-screen py-32 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
            <div className="container-custom mt-[var(--header-height)]">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Acervo de Edições</h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Explore nossa coleção completa de publicações oficiais. Todo o conteúdo é de acesso aberto.
                    </p>
                </div>

                {editions.length === 0 ? (
                    <div className="text-center text-slate-500 py-10">
                        Nenhuma edição oficial foi publicada ainda.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {editions.map((edition, idx) => (
                            <div key={edition.id} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Cover Representation */}
                                {edition.coverUrl ? (
                                    <div className="h-48 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                        <img src={edition.coverUrl} alt={`Capa ${edition.title}`} className="w-full h-full object-cover" />
                                        {idx === 0 && (
                                            <div className="absolute top-4 right-4">
                                                <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white rounded text-xs font-bold uppercase tracking-wide">
                                                    Edição Atual
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`h-48 ${edition.coverColor} relative p-6 flex flex-col justify-between text-white overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>

                                        <div className="flex justify-between items-start relative z-10">
                                            <span className="font-serif font-bold text-lg tracking-wider">PRÁXIS</span>
                                            {idx === 0 && (
                                                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-xs font-bold uppercase tracking-wide">
                                                    Edição Atual
                                                </span>
                                            )}
                                        </div>

                                        <div className="relative z-10">
                                            <div className="text-4xl font-bold opacity-30 absolute -bottom-8 -right-4">{edition.year}</div>
                                            <div className="text-2xl font-bold mb-1">Vol. {edition.volume}</div>
                                            <div className="text-sm opacity-80">Nº {edition.number} • {edition.year}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Content Info */}
                                <div className="p-6">
                                    <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                        {edition.title || `Edição Regular`}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={16} /> {edition.year}
                                        </span>
                                    </div>

                                    <Link href={`/edicao-ver?id=${edition.id}`} className="flex items-center justify-between w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                                        Ver Sumário da Edição
                                        <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
