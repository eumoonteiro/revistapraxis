"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, UserPlus, Trash2, Users } from 'lucide-react';

interface CoAuthor {
    name: string;
    email: string;
}

const MAX_AUTHORS = 7; // 1 principal + 6 coautores

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

    const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);

    const canAddCoAuthor = coAuthors.length < MAX_AUTHORS - 1; // -1 porque o autor principal já conta

    const addCoAuthor = () => {
        if (!canAddCoAuthor) return;
        setCoAuthors(prev => [...prev, { name: '', email: '' }]);
    };

    const removeCoAuthor = (index: number) => {
        setCoAuthors(prev => prev.filter((_, i) => i !== index));
    };

    const updateCoAuthor = (index: number, field: keyof CoAuthor, value: string) => {
        setCoAuthors(prev => prev.map((author, i) =>
            i === index ? { ...author, [field]: value } : author
        ));
    };

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

            // Build full author list string for emails
            const allAuthorsString = [user.displayName, ...coAuthors.filter(a => a.name).map(a => a.name)].join(', ');
            const coAuthorsData = coAuthors.filter(a => a.name); // only save non-empty

            // 2. Save Metadata to Firestore
            await addDoc(collection(db, "submissions"), {
                userId: user.uid,
                userEmail: user.email,
                authorName: user.displayName,
                coAuthors: coAuthorsData,
                title: formData.title,
                abstract: formData.abstract,
                keywords: formData.keywords,
                category: formData.category,
                fileUrl: downloadURL,
                status: 'pending',
                submittedAt: serverTimestamp()
            });

            // 3. Email de confirmação para o autor principal
            try {
                await emailjs.send(
                    'service_gacbp4r',
                    'template_i7uqmoe',
                    {
                        subject: `Submissão Recebida: ${formData.title}`,
                        message: `Olá ${user.displayName},\n\nRecebemos seu artigo "${formData.title}" com sucesso em nosso sistema de submissões da Revista Práxis Psicanalítica.\n\nAutor(es): ${allAuthorsString}\n\nO status do seu artigo atualmente é: Em Análise Inicial.\nVocê será notificado por este mesmo e-mail caso haja atualizações.\n\nAtenciosamente,\nConselho Editorial - Revista Práxis Psicanalítica`,
                        to_email: user.email || 'praxispsicanaliticarevista@gmail.com'
                    },
                    '7aTf3vTqhx0QvQBUz'
                );

                // 4. Notificar equipe editorial
                await emailjs.send(
                    'service_gacbp4r',
                    'template_i7uqmoe',
                    {
                        subject: `[Painel Admin] Nova Submissão Recebida de ${user.displayName}`,
                        message: `Aviso ao Corpo Editorial,\n\nUm novo artigo acabou de ser submetido na plataforma e aguarda triagem.\n\nTítulo: ${formData.title}\nAutor(es): ${allAuthorsString}\nCategoria: ${formData.category}\n\nAcesse o Painel Admin do site para visualizar o PDF e alterar o status.\n\nSistema Automático - Revista Práxis Psicanalítica`,
                        to_email: 'praxispsicanaliticarevista@gmail.com'
                    },
                    '7aTf3vTqhx0QvQBUz'
                );

                // 5. Notificar coautores com e-mail (se houver)
                for (const coAuthor of coAuthorsData) {
                    if (coAuthor.email) {
                        await emailjs.send(
                            'service_gacbp4r',
                            'template_i7uqmoe',
                            {
                                subject: `Submissão de Artigo: ${formData.title}`,
                                message: `Olá ${coAuthor.name},\n\nVocê foi listado(a) como coautor(a) no artigo "${formData.title}", submetido à Revista Práxis Psicanalítica por ${user.displayName}.\n\nO artigo está atualmente em análise inicial pela equipe editorial.\n\nAtenciosamente,\nConselho Editorial - Revista Práxis Psicanalítica`,
                                to_email: coAuthor.email
                            },
                            '7aTf3vTqhx0QvQBUz'
                        );
                    }
                }
            } catch (emailError) {
                console.error("Erro ao enviar email automático:", emailError);
            }

            setSuccess(true);
            setTimeout(() => router.push('/painel'), 5000);

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

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Dados do artigo */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">

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
                    </div>

                    {/* Seção de Coautores */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Autoria</h2>
                                    <p className="text-xs text-slate-400">
                                        Autor principal: <span className="font-medium text-slate-600">{user?.displayName}</span>
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                                {1 + coAuthors.length} / {MAX_AUTHORS}
                            </span>
                        </div>

                        <p className="text-sm text-slate-500 mb-6">
                            Adicione coautores opcionalmente. O e-mail é opcional, mas recomendado para que recebam a confirmação de submissão.
                        </p>

                        {coAuthors.length > 0 && (
                            <div className="space-y-4 mb-5">
                                {coAuthors.map((author, index) => (
                                    <div key={index} className="flex gap-3 items-start p-4 bg-slate-50 rounded-xl border border-slate-200 group">
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                                    Nome completo <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={author.name}
                                                    onChange={e => updateCoAuthor(index, 'name', e.target.value)}
                                                    placeholder="Nome do coautor"
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                                    E-mail <span className="text-slate-400">(opcional)</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={author.email}
                                                    onChange={e => updateCoAuthor(index, 'email', e.target.value)}
                                                    placeholder="email@exemplo.com"
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCoAuthor(index)}
                                            className="mt-5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remover coautor"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={addCoAuthor}
                            disabled={!canAddCoAuthor}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
                        >
                            <UserPlus size={16} />
                            {canAddCoAuthor
                                ? `Adicionar Coautor (${MAX_AUTHORS - 1 - coAuthors.length} disponível${MAX_AUTHORS - 1 - coAuthors.length !== 1 ? 'is' : ''})`
                                : `Limite de ${MAX_AUTHORS} autores atingido`
                            }
                        </button>
                    </div>

                    {/* Upload */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
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

                    {/* Declaração e envio */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <input type="checkbox" required id="declaration" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                            <label htmlFor="declaration" className="text-sm text-slate-600">
                                Declaro que este trabalho é original e li todas as <a href="/submissao" className="text-blue-600 hover:underline">diretrizes de submissão</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-4 text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                            {loading ? 'Enviando...' : 'Confirmar Submissão'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
