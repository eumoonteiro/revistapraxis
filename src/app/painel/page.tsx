"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import emailjs from '@emailjs/browser';
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthorDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Deep Submission Management
    const [selectedSub, setSelectedSub] = useState<any>(null);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        if (!user && !authLoading) {
            router.push('/login');
            return;
        }

        const fetchSubmissions = async () => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "submissions"),
                        where("userId", "==", user.uid)
                    );
                    const snap = await getDocs(q);
                    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Sort by date (descending)
                    data.sort((a: any, b: any) => {
                        const dateA = a.submittedAt?.toMillis() || 0;
                        const dateB = b.submittedAt?.toMillis() || 0;
                        return dateB - dateA;
                    });
                    setSubmissions(data);
                } catch (error) {
                    console.error("Erro ao buscar submissões", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (user) fetchSubmissions();
    }, [user, authLoading, router]);

    if (authLoading || loading) return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { text: 'Triagem / Pendente', icon: <Clock size={16} className="text-amber-500" />, bg: 'bg-amber-50', color: 'text-amber-700' };
            case 'reviewing': return { text: 'Em Avaliação (Peer Review)', icon: <FileText size={16} className="text-blue-500" />, bg: 'bg-blue-50', color: 'text-blue-700' };
            case 'accepted': return { text: 'Aceito para Publicação!', icon: <CheckCircle size={16} className="text-emerald-500" />, bg: 'bg-emerald-50', color: 'text-emerald-700' };
            case 'rejected': return { text: 'Arquivado', icon: <XCircle size={16} className="text-red-500" />, bg: 'bg-red-50', color: 'text-red-700' };
            default: return { text: 'Desconhecido', icon: null, bg: 'bg-slate-50', color: 'text-slate-700' };
        }
    };

    const handleSendMessageToEditor = async () => {
        if (!messageText.trim() || !selectedSub || !user) return;
        try {
            const newMessage = {
                sender: 'Autor',
                content: messageText,
                createdAt: new Date().toISOString()
            };
            await updateDoc(doc(db, "submissions", selectedSub.id), {
                messages: arrayUnion(newMessage)
            });
            const updatedMessages = [...(selectedSub.messages || []), newMessage];
            setSelectedSub({ ...selectedSub, messages: updatedMessages });
            setSubmissions(submissions.map(s => s.id === selectedSub.id ? { ...s, messages: updatedMessages } : s));
            setMessageText('');

            // Send EmailJS Notification to Editor
            await emailjs.send(
                'service_gacbp4r',
                'template_i7uqmoe',
                {
                    subject: `[Painel] Autor enviou mensagem no artigo: ${selectedSub.title}`,
                    message: `Aviso ao Conselho Editorial,\n\nO autor ${user.displayName} enviou a seguinte mensagem no painel do manuscrito "${selectedSub.title}":\n\n"${newMessage.content}"\n\nAcesse o Painel de Gestão da revista para visualizar o histórico de mensagens e responder ao autor.`,
                    to_email: 'praxispsicanaliticarevista@gmail.com'
                },
                '7aTf3vTqhx0QvQBUz'
            );
        } catch (err) {
            alert("Erro ao enviar mensagem");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-[var(--header-height)]">
            <div className="container-custom py-10">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel do Autor</h1>
                    <p className="text-slate-500">Acompanhe o status dos seus artigos submetidos e envie novos materiais.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-900">Minhas Submissões</h2>
                        <Link href="/submissao/nova" className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                            + Nova Submissão
                        </Link>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="p-16 text-center">
                            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Nenhum manuscrito encontrado</h3>
                            <p className="text-slate-500">Você ainda não submeteu nenhum artigo para nossa revista.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                                        <th className="p-6 font-medium uppercase tracking-wider">Artigo</th>
                                        <th className="p-6 font-medium uppercase tracking-wider">Categoria</th>
                                        <th className="p-6 font-medium uppercase tracking-wider">Status Atual</th>
                                        <th className="p-6 font-medium uppercase tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map(sub => {
                                        const statusObj = getStatusInfo(sub.status || 'pending');
                                        return (
                                            <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="p-6">
                                                    <div className="font-bold text-slate-900 mb-1">{sub.title}</div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs text-slate-400">Enviado em: {sub.submittedAt ? new Date(sub.submittedAt.toMillis()).toLocaleDateString('pt-BR') : 'Hoje'}</span>
                                                        <a href={sub.fileUrl} target="_blank" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Download PDF do Envio</a>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-sm text-slate-600">{sub.category}</td>
                                                <td className="p-6">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${statusObj.bg} ${statusObj.color}`}>
                                                        {statusObj.icon}
                                                        {statusObj.text}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <button onClick={() => setSelectedSub(sub)} className="text-xs bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">
                                                        Detalhes & Mensagens
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* MODAL DE DETALHES E MENSAGENS */}
                {selectedSub && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Acompanhamento e Feedback</h2>
                                    <p className="text-sm text-slate-500">ID: {selectedSub.id}</p>
                                </div>
                                <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-slate-700"><XCircle size={24} /></button>
                            </div>
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Seus Dados Enviados</h3>
                                        <p className="font-bold text-slate-900">{selectedSub.title}</p>
                                        <p className="text-sm text-slate-600">Categoria: <span className="font-medium text-slate-900">{selectedSub.category}</span></p>
                                        <div className="mt-2 text-xs bg-slate-50 p-3 rounded border border-slate-100 text-slate-500">{selectedSub.abstract}</div>
                                        <a href={selectedSub.fileUrl} target="_blank" className="mt-3 inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-blue-600 hover:bg-slate-200"><FileText size={16} /> Ver seu PDF submetido</a>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Status da Avaliação</h3>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${getStatusInfo(selectedSub.status || 'pending').bg} ${getStatusInfo(selectedSub.status || 'pending').color}`}>
                                            {getStatusInfo(selectedSub.status || 'pending').icon}
                                            {getStatusInfo(selectedSub.status || 'pending').text}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl border border-slate-100 flex flex-col h-[500px]">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-700">Comunicação e Feedback</h3>
                                    </div>
                                    <div className="p-4 flex-1 overflow-y-auto space-y-4">
                                        {(selectedSub.messages || []).map((msg: any, i: number) => (
                                            <div key={i} className={`flex flex-col ${msg.sender === 'Autor' ? 'items-end' : 'items-start'}`}>
                                                <span className="text-[10px] font-bold text-slate-400 mb-1">{msg.sender}</span>
                                                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.sender === 'Autor' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'}`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {!(selectedSub.messages || []).length && (
                                            <p className="text-center text-sm text-slate-400 py-10">Tire dúvidas com o Conselho Editorial por aqui.</p>
                                        )}
                                    </div>
                                    <div className="p-3 bg-white border-t border-slate-200">
                                        <textarea
                                            rows={2}
                                            value={messageText}
                                            onChange={e => setMessageText(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessageToEditor();
                                                }
                                            }}
                                            placeholder="Digite sua mensagem para o Editor (Enter para enviar, Shift+Enter para quebrar linha)..."
                                            className="w-full text-sm border-0 focus:ring-0 resize-none bg-slate-50 p-2 rounded"
                                        ></textarea>
                                        <div className="flex justify-end mt-2">
                                            <button onClick={handleSendMessageToEditor} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded hover:bg-blue-700">Enviar e Disparar E-mail</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
