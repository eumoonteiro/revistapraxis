"use client";
import { useState } from 'react';
import { Mail, MapPin, Phone, Send, BookOpen, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('Dúvida sobre Submissão');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: any) => {
        e.preventDefault();
        if (!name || !email || !message) return alert("Preencha todos os campos obrigatórios.");
        setLoading(true);
        try {
            await emailjs.send(
                'service_gacbp4r',
                'template_i7uqmoe',
                {
                    subject: `[Contato Site] ${subject} - DE: ${name}`,
                    message: `Nova mensagem recebida pelo formulário de contato do site:\n\nNome: ${name}\nE-mail: ${email}\nAssunto: ${subject}\n\nMensagem:\n${message}`,
                    to_email: 'revista@praxispsicanalitica.com.br'
                },
                '7aTf3vTqhx0QvQBUz'
            );
            alert("Sua mensagem foi enviada ao Conselho Editorial! Entraremos em contato em breve.");
            setName(''); setEmail(''); setMessage('');
        } catch (err) {
            alert("Erro ao enviar mensagem. Tente novamente ou use nosso email direto.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Fale Conosco</h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Dúvidas sobre submissões, pareceres ou outras questões? Entre em contato com nossa equipe editorial.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

                    {/* Contact Info Side */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Canais de Atendimento</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mt-1">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">E-mail Principal</span>
                                        <a href="mailto:revista@praxispsicanalitica.com.br" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors">
                                            revista@praxispsicanalitica.com.br
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 text-slate-600 rounded-lg mt-1">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Endereço Institucional</span>
                                        <p className="text-slate-900 leading-relaxed">
                                            Rua Coronel Tamarindo, Gragoatá<br />
                                            Niterói, RJ - Brasil
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 text-slate-600 rounded-lg mt-1">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">ISSN</span>
                                        <p className="text-slate-900 font-bold leading-relaxed">
                                            2763-9525 (Eletrônico)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-white">
                            <h3 className="text-lg font-bold mb-4">Dúvidas Frequentes</h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                Antes de enviar sua mensagem, verifique se sua dúvida já está respondida em nossa seção de diretrizes.
                            </p>
                            <a href="/submissao" className="inline-block w-full text-center py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                                Ver Diretrizes de Submissão
                            </a>
                        </div>
                    </div>

                    {/* Contact Form Side */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Envie uma mensagem</h2>

                            <form onSubmit={handleSend} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Nome</label>
                                        <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50" placeholder="Seu nome completo" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
                                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50" placeholder="seu@email.com" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Assunto</label>
                                    <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50 text-slate-700">
                                        <option>Dúvida sobre Submissão</option>
                                        <option>Status de Avaliação</option>
                                        <option>Parecer Técnico</option>
                                        <option>Outros</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Mensagem</label>
                                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50 resize-none" placeholder="Digite sua mensagem aqui..." required></textarea>
                                </div>

                                <button disabled={loading} type="submit" className="w-full btn-primary disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-lg py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    {loading ? "Enviando..." : "Enviar Mensagem"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
