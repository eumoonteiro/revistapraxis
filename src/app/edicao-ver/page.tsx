"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import ArticleCard from '@/components/ui/ArticleCard';

function ContentComp() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') as string;

    const [edition, setEdition] = useState<any>(null);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEditionData = async () => {
            if (!id) return;
            try {
                const edRef = doc(db, "editions", id);
                const edSnap = await getDoc(edRef);
                if (edSnap.exists()) {
                    setEdition({ id: edSnap.id, ...edSnap.data() });
                }

                const q = query(collection(db, "articles"), where("editionId", "==", id));
                const artSnap = await getDocs(q);
                setArticles(artSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEditionData();
    }, [id]);

    if (loading) return <div className="min-h-screen pt-32 pb-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    if (!edition) return (
        <div className="min-h-screen pt-32 pb-20 flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Edição não encontrada</h1>
            <Link href="/edicoes" className="text-blue-600 hover:underline">Voltar para o Acervo</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-[var(--header-height)]">
            {/* Header da Edição */}
            <div className="bg-slate-900 border-b border-slate-800 text-white pt-12 pb-16">
                <div className="container-custom">
                    <Link href="/edicoes" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft size={16} /> Voltar para Todas as Edições
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-800 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
                                <BookOpen size={14} /> Volume Completo
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {edition.title || `Vol. ${edition.volume}, Nº ${edition.number}`}
                            </h1>
                            <p className="text-xl text-slate-400">
                                {edition.year}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sumário */}
            <div className="container-custom py-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Artigos Publicados</h2>

                {articles.length === 0 ? (
                    <div className="text-slate-500 text-center py-10">
                        Nenhum artigo cadastrado neste volume ainda.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} {...article} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-20 flex justify-center text-blue-500">Carregando...</div>}>
      <ContentComp />
    </Suspense>
  );
}
