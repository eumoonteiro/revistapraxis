import Link from 'next/link';
import { FileText, CheckCircle, Upload, AlertCircle, ArrowRight, FileCheck, Scale } from 'lucide-react';

export default function SubmissionPage() {
    const conditions = [
        "A contribuição é original e inédita, e não está sendo avaliada para publicação por outra revista.",
        "Os arquivos para submissão estão em formato Microsoft Word (.doc).",
        "O texto segue as normas de formatação (espaçamento 1,5, margens 3/2cm, fonte Arial/Times 12).",
        "Figuras e tabelas estão inseridas no texto, não no final.",
        "Utilizei o template oficial da revista.",
        "As referências bibliográficas foram incluídas obrigatoriamente.",
        "Declaração de Responsabilidade e Conflito de Interesses aceite.",
        "Critérios éticos (Resolução 466/12) respeitados para pesquisas com seres humanos."
    ];

    const formattingRules = [
        { label: "Extensão", value: "Até 18 páginas (incluindo tudo)" },
        { label: "Formato", value: ".doc, sem comentários/identificação" },
        { label: "Margens", value: "3cm (sup/esq) e 2cm (inf/dir)" },
        { label: "Fonte", value: "Arial ou Times New Roman" },
        { label: "Tamanho", value: "12 (texto), 14 (títulos), 10 (citações)" },
        { label: "Espaçamento", value: "1,5 (texto), Simples (citações longas)" },
        { label: "Citações", value: "Recuo de 4cm para longas (>3 linhas)" },
        { label: "Resumo", value: "Max. 150 palavras, abaixo do título" }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto">

                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                            Instruções para Autores
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Submissão Online</h1>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Utilize nosso sistema seguro para submeter seu manuscrito, acompanhar o processo de avaliação e gerenciar suas publicações.
                        </p>
                    </div>

                    {/* Submission Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
                        <div className="hidden md:block absolute top-8 left-16 right-16 h-0.5 bg-slate-200 -z-10"></div>

                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="w-16 h-16 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 border-4 border-white shadow-lg">1</div>
                            <h3 className="font-bold text-slate-900 mb-2">Login/Cadastro</h3>
                            <p className="text-sm text-slate-500">Crie sua conta de autor no sistema.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="w-16 h-16 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 border-4 border-white shadow-lg">2</div>
                            <h3 className="font-bold text-slate-900 mb-2">Upload</h3>
                            <p className="text-sm text-slate-500">Envie o manuscrito e metadados.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 border-4 border-white shadow-lg">3</div>
                            <h3 className="font-bold text-slate-900 mb-2">Acompanhamento</h3>
                            <p className="text-sm text-slate-500">Status em tempo real da avaliação.</p>
                        </div>
                    </div>

                    {/* Alert Box for System Submission */}
                    <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl mb-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                        <h2 className="text-2xl font-bold mb-4 relative z-10">Pronto para submeter?</h2>
                        <p className="text-slate-300 max-w-xl mx-auto mb-8 relative z-10">
                            Certifique-se de que seu arquivo está nas normas antes de iniciar o processo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/login" className="btn-primary bg-blue-600 hover:bg-blue-500 text-lg px-8 py-4 flex items-center justify-center gap-2">
                                <Upload size={20} />
                                Fazer Login e Submeter
                            </Link>
                            <button className="px-8 py-4 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors font-medium">
                                Baixar Template
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Formatting Specs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <FileText className="text-blue-600" />
                                <h2 className="text-xl font-bold text-slate-900">Diretrizes de Formatação</h2>
                            </div>
                            <div className="space-y-4">
                                {formattingRules.map((rule, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                                        <span className="font-bold text-slate-700 w-24 flex-shrink-0">{rule.label}</span>
                                        <span className="text-slate-600 text-right">{rule.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <FileCheck className="text-emerald-600" />
                                <h2 className="text-xl font-bold text-slate-900">Condições para Submissão</h2>
                            </div>
                            <ul className="space-y-4">
                                {conditions.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-slate-700">
                                        <div className="mt-0.5 text-emerald-500 flex-shrink-0">
                                            <CheckCircle size={16} />
                                        </div>
                                        <span className="leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Legal / Copyright */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Scale size={20} className="text-slate-500" />
                            <h3 className="font-bold text-slate-900">Declaração de Direitos Autorais e Ética</h3>
                        </div>
                        <div className="prose prose-sm prose-slate max-w-none text-slate-600 columns-1 md:columns-2 gap-8">
                            <p>
                                <strong>Direitos Autorais:</strong> Em caso de aceitação, os autores concordam que os direitos autorais tornam-se propriedade exclusiva da Revista Práxis Psicanalítica.
                            </p>
                            <p>
                                <strong>Responsabilidade:</strong> Todos os autores afirmam ter participado do trabalho e garantem que o conteúdo é original.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
