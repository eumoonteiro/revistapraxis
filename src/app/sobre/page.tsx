import Link from 'next/link';
import { Mail, ShieldCheck, BookOpen, Users } from 'lucide-react';

export default function AboutPage() {
    const editorialBoard = [
        {
            role: 'Editora-chefe',
            members: [
                { name: 'Rosane de Albuquerque Costa', institution: 'Práxis Psicanalítica' }
            ]
        },
        {
            role: 'Conselho Editorial',
            members: [
                { name: 'Bárbara Breder Machado', institution: 'Universidade Federal Fluminense (UFF)' },
                { name: 'Jorge Alberto Berlaffa', institution: 'Práxis Psicanalítica' },
                { name: 'Marcio Garrit', institution: 'Práxis Psicanalítica' },
                { name: 'Maycon Torres', institution: 'Universidade Federal Fluminense (UFF)' },
                { name: 'Tatiana Pequeno', institution: 'Universidade Federal Fluminense (UFF)' },
                { name: 'Zeno Germano de Souza Neto', institution: 'Faculdade Católica de Rondônia (FCR)' },
            ]
        },
        {
            role: 'Assistente Editorial',
            members: [
                { name: 'Lucas Monteiro Silva', institution: 'Designer, Programador e Suporte Técnico', email: 'monteirolucas.rj@outlook.com' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
            <div className="container-custom">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Sobre a Revista</h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Conheça a história, o escopo e a equipe responsável pela Revista Práxis Psicanalítica.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Quem Somos */}
                        <section className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <ShieldCheck size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Quem somos</h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                                <p>
                                    A revista Práxis Psicanalítica surge, em 2021, a partir da necessidade de ampliação das publicações que divulgam a Psicanálise.
                                    Nosso propósito é contribuir para que a Psicanálise chegue a todos de forma rápida, consistente e fundamentada.
                                </p>
                                <p>
                                    Somos um grupo de psicanalistas orientados pelos valores éticos, plurais e diversos e comprometidos com a emancipação dos sujeitos.
                                    Nossas publicações privilegiam artigos que discutam a clínica, a teoria e também uma psicanálise comprometida com a urbe e com o contemporâneo.
                                </p>
                            </div>
                        </section>

                        {/* Escopo */}
                        <section className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <BookOpen size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Escopo</h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                                <p>
                                    A Revista Práxis Psicanalítica busca alicerçar um espaço editorial de natureza multidisciplinar, tendo como eixo a psicanálise voltada à discussão sobre a clínica e a teoria Psicanalítica realizadas por variadas categorias profissionais.
                                </p>
                                <p>
                                    Em cada número podemos ter artigos de resenha de filmes ou peças teatrais, de revisão de todas as modalidades, relatos de experiências, textos históricos, entrevistas e Resenhas.
                                </p>
                                <p>
                                    Aceitamos para publicação textos inéditos encaminhados pelos autores, cabendo aos editores a escolha da seção na qual o mesmo virá a ser publicado, se aceito.
                                </p>
                            </div>
                        </section>

                        {/* Corpo Editorial */}
                        <section className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <Users size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Corpo Editorial</h2>
                            </div>

                            <div className="space-y-10">
                                {editorialBoard.map((group, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                            {group.role}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {group.members.map((member, mIdx) => (
                                                <div key={mIdx} className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                                    <div className="font-semibold text-slate-900">{member.name}</div>
                                                    <div className="text-sm text-slate-500 mt-1">{member.institution}</div>
                                                    {(member as any).email && (
                                                        <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                                            <Mail size={12} /> {(member as any).email}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6">Informações Rápidas</h3>
                            <ul className="space-y-6">
                                <li>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ISSN</div>
                                    <div className="text-lg font-mono text-white">2763-9525 (Eletrônico)</div>
                                </li>
                                <li>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contato Institucional</div>
                                    <a href="mailto:praxispsicanaliticarevista@gmail.com" className="text-lg text-blue-400 hover:text-blue-300 transition-colors break-words">
                                        praxispsicanaliticarevista@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Periodicidade</div>
                                    <div className="text-lg text-white">Publicação Anual</div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-200">
                            <h3 className="text-xl font-bold mb-4">Publique seu trabalho</h3>
                            <p className="text-blue-100 mb-6 leading-relaxed">
                                Contribua para o avanço da psicanálise. Aceitamos artigos inéditos, resenhas e relatos de experiência.
                            </p>
                            <Link href="/submissao" className="block w-full text-center px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                                Enviar Submissão
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
