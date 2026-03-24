import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-[var(--header-height)]">
            <div className="container-custom py-16 max-w-4xl">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <ShieldCheck size={28} />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900">Política de Privacidade</h1>
                    </div>
                    <p className="text-lg text-slate-600">
                        Compromisso com a segurança e privacidade dos dados dos nossos autores, avaliadores e leitores.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                    <h3>1. Coleta de Dados Pessoais</h3>
                    <p>
                        A Revista Práxis Psicanalítica coleta informações pessoais (como nome, endereço de e-mail e filiação institucional) estritamente necessárias para o funcionamento editorial da revista. Estes dados são essenciais para os processos de submissão, avaliação por pares e comunicação com os autores.
                    </p>

                    <h3>2. Uso das Informações</h3>
                    <p>
                        Os nomes e endereços informados nesta revista serão usados exclusivamente para os serviços prestados por esta publicação. Não serão disponibilizados para outras finalidades ou fornecidos a terceiros. A equipe editorial se compromete a preservar a confidencialidade dos autores e avaliadores envolvidos.
                    </p>

                    <h3>3. Sistema de Avaliação Duplo-Cega</h3>
                    <p>
                        Garantimos o sigilo durante o processo de revisão. Os avaliadores não terão acesso aos nomes dos autores e vice-versa, protegendo a imparcialidade e evitando conflitos de interesse.
                    </p>

                    <h3>4. Publicação e Acesso Aberto</h3>
                    <p>
                        Como a revista é de acesso aberto, os nomes dos autores, filiações e endereços profissionais (e-mail) associados aos artigos serão publicados junto com o manuscrito final em nosso site ou indexadores, e portanto, de domínio público no contexto acadêmico.
                    </p>

                    <h3>5. Direitos do Usuário</h3>
                    <p>
                        Qualquer usuário registrado no sistema da revista (autores, leitores ou avaliadores) pode solicitar a exclusão de sua conta ou alterações em seus dados pessoais a qualquer momento, enviando um e-mail para a equipe editorial.
                    </p>

                    <div className="mt-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="m-0 font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Contato Encarregado de Dados</p>
                        <a href="mailto:revista@praxispsicanalitica.com.br" className="text-blue-600 hover:underline">revista@praxispsicanalitica.com.br</a>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium">
                        Voltar para o Início <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
