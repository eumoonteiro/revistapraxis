"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ArrowLeft, Loader2, Save, Trash2, Edit, UploadCloud, XCircle } from 'lucide-react';

function ContentComp() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id') as string;

    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    const [edition, setEdition] = useState<any>(null);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);

    // Editing State for inline article edit
    const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
    const [editArticleData, setEditArticleData] = useState<any>({});

    useEffect(() => {
        const init = async () => {
            // Security check
            if (!user && !authLoading) { router.push('/login'); return; }
            try {
                if (user) {
                    if (user.email === 'revista@praxispsicanalitica.com.br') {
                        setIsAdmin(true);
                    } else {
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        if (userDoc.exists() && userDoc.data().role === 'admin') setIsAdmin(true);
                        else setIsAdmin(false);
                    }
                }

                // Fetch Edition Details
                const edRef = doc(db, "editions", id);
                const edSnap = await getDoc(edRef);
                if (edSnap.exists()) {
                    setEdition({ id: edSnap.id, ...edSnap.data() });
                }

                // Fetch Articles belonging to this edition
                const q = query(collection(db, "articles"), where("editionId", "==", id));
                const artSnap = await getDocs(q);
                setArticles(artSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (!authLoading && id) init();
    }, [id, user, authLoading, router]);

    const handleSaveEditionData = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, "editions", id), {
                volume: edition.volume,
                number: edition.number,
                year: edition.year,
                title: edition.title,
                status: edition.status || 'draft',
                coverUrl: edition.coverUrl || null
            });
            alert("Metadados da Edição salvos!");
        } catch (error) {
            alert("Erro ao salvar.");
        } finally {
            setSaving(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCover(true);
        try {
            const storageRef = ref(storage, `covers/${Date.now()}_${file.name}`);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(uploadTask.ref);

            setEdition({ ...edition, coverUrl: downloadURL });
            alert("Capa carregada com sucesso! Lembre-se de clicar em 'Salvar Capa' para confirmar.");
        } catch (error) {
            console.error("Erro no upload da capa:", error);
            alert("Erro ao fazer upload da capa.");
        } finally {
            setUploadingCover(false);
        }
    };

    const handleArticlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPdf(true);
        try {
            const storageRef = ref(storage, `articles/${Date.now()}_${file.name}`);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(uploadTask.ref);

            setEditArticleData({ ...editArticleData, pdfUrl: downloadURL });
            alert("PDF do artigo carregado! Clique em 'Aplicar Alteração' para salvá-lo definitivamente.");
        } catch (error) {
            console.error("Erro no upload do PDF:", error);
            alert("Erro ao fazer upload do PDF.");
        } finally {
            setUploadingPdf(false);
        }
    };

    const handleSaveArticleData = async (articleId: string) => {
        try {
            await updateDoc(doc(db, "articles", articleId), editArticleData);
            // Update local state
            setArticles(articles.map(a => a.id === articleId ? { ...a, ...editArticleData } : a));
            setEditingArticleId(null);
            alert("Artigo atualizado!");
        } catch (error) {
            alert("Erro ao atualizar o artigo.");
        }
    };

    const handleDeleteArticle = async (articleId: string) => {
        if (!confirm("Tem certeza que deseja apagar este artigo do acervo público?")) return;
        try {
            await deleteDoc(doc(db, "articles", articleId));
            setArticles(articles.filter(a => a.id !== articleId));
        } catch (error) {
            alert("Erro ao apagar o artigo.");
        }
    };

    if (loading || authLoading) return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    if (!isAdmin) return (
        <div className="min-h-screen pt-32 flex flex-col items-center gap-4 bg-slate-50">
            <XCircle size={48} className="text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900">Acesso Negado</h1>
            <p className="text-slate-500 font-medium">Você não possui privilégios de Editor/Administrador para visualizar esta página.</p>
            <Link href="/" className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg">Voltar ao Início</Link>
        </div>
    );
    if (!edition) return <div className="text-center pt-32">Edição não encontrada.</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-[var(--header-height)]">
            <div className="container-custom py-10">
                <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 text-sm font-medium">
                    <ArrowLeft size={16} /> Voltar ao Painel Admin
                </Link>

                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Editor de Volume: {edition.volume}</h1>
                        <p className="text-slate-500">Altere os dados da capa ou corrija os artigos anexados a este número.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Painel lateral: Edição */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit sticky top-[100px]">
                        <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Metadados da Edição</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500">Volume</label>
                                <input type="text" value={edition.volume} onChange={e => setEdition({ ...edition, volume: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Número (Nº)</label>
                                <input type="text" value={edition.number} onChange={e => setEdition({ ...edition, number: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Ano</label>
                                <input type="text" value={edition.year} onChange={e => setEdition({ ...edition, year: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Título / Dossiê Temático</label>
                                <input type="text" value={edition.title || ''} onChange={e => setEdition({ ...edition, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm" />
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-500 block mb-2">Visibilidade / Status</label>
                                <select value={edition.status || 'draft'} onChange={e => setEdition({ ...edition, status: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                                    <option value="draft">Rascunho (Oculto ao Público)</option>
                                    <option value="published">Publicado (Visível no Site)</option>
                                </select>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-500 block mb-2">Imagem de Capa (Opcional)</label>
                                {edition.coverUrl ? (
                                    <div className="mb-3">
                                        <img src={edition.coverUrl} alt="Capa" className="w-full h-auto max-w-[150px] mx-auto rounded shadow-sm" />
                                        <button onClick={() => setEdition({ ...edition, coverUrl: '' })} className="text-xs text-red-500 hover:underline block text-center mt-2 w-full">Remover Imagem</button>
                                    </div>
                                ) : (
                                    <div className="relative border-2 border-dashed border-slate-200 bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                            disabled={uploadingCover}
                                        />
                                        {uploadingCover ? (
                                            <><Loader2 size={24} className="text-blue-500 mb-2 animate-spin" /><span className="text-xs text-slate-500">Carregando...</span></>
                                        ) : (
                                            <><UploadCloud size={24} className="text-blue-400 mb-2" /><span className="text-xs text-slate-500 text-center font-bold">Subir Imagem da Capa</span></>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button onClick={handleSaveEditionData} disabled={saving} className="w-full mt-4 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-colors">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar Dados
                            </button>

                            <a href={`/edicao-ver?id=${edition.id}`} target="_blank" rel="noopener noreferrer" className="w-full mt-2 flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded font-bold transition-colors text-sm">
                                Visualizar Modo Público
                            </a>
                        </div>
                    </div>

                    {/* Central: Artigos */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Artigos Contidos Nesta Edição ({articles.length})</h3>

                        {articles.length === 0 ? (
                            <div className="p-8 text-center bg-white border border-slate-100 rounded-xl text-slate-500">
                                Nenhum artigo vinculado a esta edição ainda. Utilize a tela de Nova Edição Rápida para subir PDFs.
                            </div>
                        ) : (
                            articles.map(article => (
                                <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                    {editingArticleId === article.id ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-bold text-blue-500">Título do Artigo</label>
                                                <input type="text" value={editArticleData.title} onChange={e => setEditArticleData({ ...editArticleData, title: e.target.value })} className="w-full border-b-2 border-blue-500 focus:outline-none py-1 font-bold text-slate-900" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-blue-500">Autor(es)</label>
                                                <div className="space-y-2 mt-1 mb-3">
                                                    {(Array.isArray(editArticleData.authors) ? editArticleData.authors : [editArticleData.authors || '']).map((author: string, idx: number) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input type="text" value={author} onChange={e => {
                                                                const arr = [...(Array.isArray(editArticleData.authors) ? editArticleData.authors : [editArticleData.authors || ''])];
                                                                arr[idx] = e.target.value;
                                                                setEditArticleData({ ...editArticleData, authors: arr });
                                                            }} className="w-full border-b-2 border-slate-300 focus:border-blue-500 focus:outline-none py-1 text-slate-700 text-sm" placeholder="Nome do autor" />
                                                            <button onClick={() => {
                                                                const arr = [...(Array.isArray(editArticleData.authors) ? editArticleData.authors : [editArticleData.authors || ''])];
                                                                arr.splice(idx, 1);
                                                                setEditArticleData({ ...editArticleData, authors: arr });
                                                            }} className="px-3 text-red-500 font-bold hover:bg-red-50 rounded" title="Remover Autor">X</button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => {
                                                        const arr = [...(Array.isArray(editArticleData.authors) ? editArticleData.authors : [editArticleData.authors || ''])];
                                                        arr.push('');
                                                        setEditArticleData({ ...editArticleData, authors: arr });
                                                    }} className="text-xs text-blue-600 font-bold hover:bg-blue-50 px-2 py-1 rounded inline-block">
                                                        + Adicionar Autor
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-blue-500">Resumo</label>
                                                <textarea rows={3} value={editArticleData.abstract} onChange={e => setEditArticleData({ ...editArticleData, abstract: e.target.value })} className="w-full border-2 border-blue-500 rounded p-2 focus:outline-none text-slate-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-blue-500">Data / Ano da Publicação</label>
                                                <input type="text" value={editArticleData.date || ''} onChange={e => setEditArticleData({ ...editArticleData, date: e.target.value })} className="w-full border-b-2 border-slate-200 focus:outline-none py-1 text-slate-700 text-sm" placeholder="ex: 2024" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-blue-500">DOI / Identificador</label>
                                                <input type="text" value={editArticleData.doi || ''} onChange={e => setEditArticleData({ ...editArticleData, doi: e.target.value })} className="w-full border-b-2 border-slate-200 focus:outline-none py-1 text-slate-700 text-sm" placeholder="ex: 10.1234/rpp.v5.123" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-blue-500 block mb-1">Substituir Arquivo PDF</label>
                                                <div className="flex items-center gap-3">
                                                    <input type="file" accept="application/pdf" onChange={handleArticlePdfUpload} disabled={uploadingPdf} className="text-sm border border-slate-200 p-1 rounded w-full" />
                                                    {uploadingPdf && <Loader2 size={16} className="animate-spin text-blue-500" />}
                                                </div>
                                                {editArticleData.pdfUrl && <a href={editArticleData.pdfUrl} target="_blank" className="text-xs text-blue-600 hover:underline mt-1 block">Visualizar PDF Atual</a>}
                                            </div>

                                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                                <button onClick={() => setEditingArticleId(null)} className="px-4 py-2 text-slate-500 text-sm font-bold hover:bg-slate-50 rounded">Cancelar</button>
                                                <button onClick={() => handleSaveArticleData(article.id)} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded shadow flex items-center gap-2"><Save size={14} /> Aplicar Alteração</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 text-lg">{article.title}</h4>
                                                <p className="text-slate-600 text-sm mt-1 mb-3">{Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}</p>
                                                <p className="text-slate-500 text-sm line-clamp-2 italic border-l-2 border-slate-300 pl-3">{article.abstract}</p>

                                                {article.doi && <div className="mt-3 text-xs font-mono text-blue-600">DOI: {article.doi}</div>}
                                            </div>
                                            <div className="flex flex-col gap-2 border-l border-slate-100 pl-4 justify-start">
                                                <button onClick={() => { setEditingArticleId(article.id); setEditArticleData(article); }} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors" title="Editar Artigo">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteArticle(article.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors" title="Excluir Artigo">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
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
