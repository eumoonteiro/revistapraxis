"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Download, Quote, Share2, Loader2 } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { articles as localArticles } from '@/lib/data'; // fallback

function ContentComp() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') as string;

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchArticle = async () => {
            try {
                const docRef = doc(db, "articles", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setArticle({ id: docSnap.id, ...docSnap.data() });
                } else {
                    // Tenta achar no localArticles (Mock antigo) caso a pessoa clique num link do data.ts
                    const localMatch = localArticles.find((a) => a.id === id);
                    if (localMatch) {
                        setArticle(localMatch);
                    } else {
                        setArticle(null);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar artigo:", error);
                const localMatch = localArticles.find((a) => a.id === id);
                setArticle(localMatch || null);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen pt-32 pb-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Artigo não encontrado</h1>
                <Link href="/" className="text-blue-600 hover:underline">Voltar para a página inicial</Link>
            </div>
        );
    }

    const authorString = Array.isArray(article.authors) ? article.authors.join(', ') : article.authors;

    const handleDownload = async () => {
        if (!article.pdfUrl) return;
        try {
            await updateDoc(doc(db, "articles", id), {
                downloads: (article.downloads || 0) + 1
            });
            setArticle((prev: any) => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
        } catch (error) {
            console.error("Erro ao registrar download:", error);
        }
        window.open(article.pdfUrl, "_blank");
    };

    const handleShare = async () => {
        const shareData = {
            title: article.title,
            text: `Confira este artigo na Revista Práxis Psicanalítica: ${article.title}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copiado para a área de transferência!");
            }
        } catch (err) {
            console.error("Erro ao compartilhar", err);
        }
    };

    const handleCite = () => {
        const authorArr = authorString?.split(',') || ['Autor Desconhecido'];
        const firstAuthorUpper = authorArr[0].split(' ').pop()?.toUpperCase() || 'AUTOR';
        const year = article.date || new Date().getFullYear();
        const citeText = `${firstAuthorUpper}, et al. ${article.title}. Revista Práxis Psicanalítica, v. 1, n. 1, ${year}. Disponível em: https://www.revistapraxis.com.br/artigo-ver?id=${id}`;

        navigator.clipboard.writeText(citeText);
        alert("Citação (Modelo ABNT) copiada para sua área de transferência!\n\n" + citeText);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-[var(--header-height)]">
            {/* Article Header */}
            <div className="bg-white border-b border-slate-100 pt-10 pb-12">
                <div className="container-custom">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft size={16} /> Voltar para Início
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                                {article.category || 'Artigo'}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 text-sm">
                                <Calendar size={16} />
                                {article.date || 'Recente'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            {article.title}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center gap-6 text-slate-600">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-full">
                                    <User size={20} className="text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{authorString}</p>
                                    {article.institution && <p className="text-xs text-slate-500">{article.institution}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content (Reading Area) */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 md:p-12">
                        <div className="mb-10 p-6 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Resumo</h3>
                            <p className="text-slate-700 italic leading-relaxed">
                                {article.abstract}
                            </p>
                            {article.keywords && (
                                <p className="mt-4 text-sm text-slate-600"><strong>Palavras-chave:</strong> {article.keywords}</p>
                            )}
                        </div>

                        <div
                            className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-blockquote:border-l-blue-500"
                            dangerouslySetInnerHTML={{ __html: article.content || '<p>Conteúdo não disponível em HTML.</p>' }}
                        />

                        <div className="mt-16 pt-8 border-t border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">Referências</h4>
                            <p className="text-slate-500 text-sm italic">
                                (As referências foram suprimidas da visualização em tela, consulte o PDF.)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Tools & Metadata) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Action Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
                        {article.pdfUrl ? (
                            <button onClick={handleDownload} className="w-full btn-primary flex flex-col items-center justify-center gap-1 mb-4 shadow-blue-200 shadow-lg py-3">
                                <div className="flex items-center gap-2"><Download size={20} /> Baixar PDF Completo</div>
                                <span className="text-blue-200 text-xs font-normal">{(article.downloads || 0)} downloads registrados</span>
                            </button>
                        ) : (
                            <button disabled className="w-full bg-slate-200 text-slate-500 rounded flex items-center justify-center gap-3 mb-4 py-3 cursor-not-allowed">
                                <Download size={20} />
                                PDF Indisponível
                            </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleCite} className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600">
                                <Quote size={20} className="mb-2" />
                                <span className="text-xs font-medium">Citar</span>
                            </button>
                            <button onClick={handleShare} className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600">
                                <Share2 size={20} className="mb-2" />
                                <span className="text-xs font-medium">Compartilhar</span>
                            </button>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">DOI</span>
                                <a href="#" className="text-blue-600 hover:underline break-all text-sm">{article.doi || 'Não atribuído'}</a>
                            </div>
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Licença</span>
                                <span className="text-slate-700 text-sm">Creative Commons BY 4.0</span>
                            </div>
                        </div>
                    </div>
                </div>
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
