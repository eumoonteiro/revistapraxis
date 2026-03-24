import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Image src="/logoradape.png" alt="Logo" width={40} height={40} className="brightness-0 invert" />
                            <h3 className="text-xl font-bold text-white">Revista Práxis Psicanalítica</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Revista científica dedicada à transmissão e discussão da psicanálise, suas conexões com a cultura e seus desafios na clínica contemporânea.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Navegação</h4>
                        <ul className="space-y-3">
                            <li><Link href="/sobre" className="text-slate-300 hover:text-white transition-colors text-sm">Sobre a Revista</Link></li>
                            <li><Link href="/edicoes" className="text-slate-300 hover:text-white transition-colors text-sm">Edições Anteriores</Link></li>
                            <li><Link href="/submissao" className="text-slate-300 hover:text-white transition-colors text-sm">Diretrizes para Autores</Link></li>
                            <li><Link href="/equipe" className="text-slate-300 hover:text-white transition-colors text-sm">Corpo Editorial</Link></li>
                        </ul>
                    </div>

                    {/* Legal / Policies */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Políticas</h4>
                        <ul className="space-y-3">
                            <li><Link href="/politica-privacidade" className="text-slate-300 hover:text-white transition-colors text-sm">Privacidade</Link></li>
                            <li><Link href="/etica" className="text-slate-300 hover:text-white transition-colors text-sm">Ética e Publicação</Link></li>
                            <li><Link href="/acesso-aberto" className="text-slate-300 hover:text-white transition-colors text-sm">Declaração de Acesso Aberto</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Contato</h4>
                        <p className="text-slate-300 text-sm mb-2 break-all">praxispsicanaliticarevista@gmail.com</p>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">Rua Coronel Tamarindo, Gragoatá<br />Niterói - Rio de Janeiro - Brasil</p>
                        <p className="text-slate-500 text-xs">
                            ISSN: 2763-9525 (Eletrônico)
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs">
                        &copy; {new Date().getFullYear()} Revista Práxis Psicanalítica. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
