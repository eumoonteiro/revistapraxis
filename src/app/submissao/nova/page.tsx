"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function NewSubmissionPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        keywords: '',
        category: 'Artigo Original'
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !file) return;
        setLoading(true);

        try {
            // 1. Upload File to Firebase Storage
            const fileRef = ref(storage, `submissoes/${user.uid}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save Metadata to Firestore
            await addDoc(collection(db, "submissions"), {
                userId: user.uid,
                userEmail: user.email,
                authorName: user.displayName,
                title: formData.title,
                abstract: formData.abstract,
                keywords: formData.keywords,
                category: formData.category,
                fileUrl: downloadURL,
                status: 'pending', // pending, reviewing, accepted, rejected
                submittedAt: serverTimestamp()
            });

            // 3. Trigger automatic email for Submission Confirmation
            try {
                await emailjs.send(
                    'service_gacbp4r',
                    'template_i7uqmoe',
                    {
                        subject: `Submissão Recebida: ${formData.title}`,
                        message: `Olá ${user.displayName},\n\nRecebemos seu artigo "${formData.title}" com sucesso em nosso sistema de submissões da Revista Práxis Psicanalítica.\n\nO status do seu artigo atualmente é: Em Análise Inicial.\nVocê será notificado por este mesmo e-mail caso haja atualizações.\n\nAtenciosamente,\nConselho Editorial - Revista Práxis Psicanalítica`,
                        to_email: user.email || 'praxispsicanaliticarevista@gmail.com'
                    },
                    '7aTf3vTqhx0QvQBUz'
                );

                // Disparo 2: Notificar equipe editorial / Diretores (que um NOVO artigo chegou)
                await emailjs.send(
                    'service_gacbp4r',
                    'template_i7uqmoe',
                    {
                        subject: `[Painel Admin] Nova Submissão Recebida de ${user.displayName}`,
                        message: `Aviso ao Corpo Editorial,\n\nUm novo artigo acabou de ser submetido na plataforma e aguarda triagem.\n\nTítulo: ${formData.title}\nAutor(es): ${user.displayName}\nCategoria: ${formData.category}\n\nAcesse o Painel Admin do site para visualizar o PDF e alterar o status.\n\nSistema Automático - Revista Práxis Psicanalítica`,
                        to_email: 'praxispsicanaliticarevista@gmail.com' // Trocar por email real do Conselho Editorial se diferente
                    },
                    '7aTf3vTqhx0QvQBUz'
                );
            } catch (emailError) {
                console.error("Erro ao enviar email automático:", emailError);
            }

            setSuccess(true);
            setTimeout(() => router.push('/painel'), 5000); // Redirect to new author dashboard

        } catch (error) {
            console.error("Error submitting:", error);
            alert("Erro ao enviar submissão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-lg">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Submissão Recebida!</h2>
                    <p className="text-slate-600 mb-4">Seu artigo foi enviado com sucesso para nossa equipe editorial. Você receberá atualizações por e-mail.</p>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 mt-4 text-left">
                        <div className="flex gap-2 text-amber-800 font-bold mb-1 items-center">
                            <AlertCircle size={18} />
                            Atenção
                        </div>
                        <p className="text-sm text-amber-700 leading-snug">
                            Um e-mail de confirmação acaba de ser enviado para você. <span className="font-bold">Por favor, verifique sua caixa de SPAM ou Lixo Eletrônico</span> caso não o encontre na caixa de entrada principal.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-10 pb-20 bg-slate-50/50">
            <div className="container-custom max-w-3xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Nova Submissão</h1>
                <p className="text-slate-500 mb-8">Preencha os dados abaixo e anexe seu manuscrito.</p>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Título do Artigo</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Resumo (Abstract)</label>
                        <textarea
                            rows={6}
                            required
                            value={formData.abstract}
                            onChange={e => setFormData({ ...formData, abstract: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                            placeholder="Cole o resumo do seu trabalho aqui (máx. 250 palavras)..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Palavras-chave</label>
                            <input
                                type="text"
                                required
                                value={formData.keywords}
                                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Ex: Psicanálise; Freud; Clínica"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                            >
                                <option>Artigo Original</option>
                                <option>Ensaio Teórico</option>
                                <option>Relato de Experiência</option>
                                <option>Resenha</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-4">Arquivo do Manuscrito (.doc ou .docx)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                            <input
                                type="file"
                                accept=".doc,.docx,.pdf"
                                onChange={handleFileChange}
                                required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                            />
                            <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform relative z-10 pointer-events-none">
                                {file ? (
                                    <>
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-medium text-slate-900">{file.name}</span>
                                        <span className="text-xs text-slate-500">Clique para alterar</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-slate-600">Arraste seu arquivo ou clique para selecionar</span>
                                        <span className="text-xs text-slate-400">Tamanho máximo: 10MB</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <input type="checkbox" required className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                        <label className="text-sm text-slate-600">
                            Declaro que este trabalho é original e li todas as <a href="/submissao" className="text-blue-600 hover:underline">diretrizes de submissão</a>.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-4 text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                        {loading ? 'Enviando...' : 'Confirmar Submissão'}
                    </button>

                </form>
            </div>
        </div>
    );
}
