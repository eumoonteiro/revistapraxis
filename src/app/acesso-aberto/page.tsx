import Link from 'next/link';
import { Unlock, ArrowRight } from 'lucide-react';

export default function OpenAccessPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-[var(--header-height)]">
            <div className="container-custom py-16 max-w-4xl">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <Unlock size={28} />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900">Declaração de Acesso Aberto</h1>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                    <h3>1. Filosofia Open Access</h3>
                    <p>
                        A Revista Práxis Psicanalítica é um periódico acadêmico focado em promover e compartilhar o livre acesso ao conhecimento. Acreditamos que fornecer acesso público de forma livre às pesquisas acadêmicas impulsiona a troca de ideias em um âmbito global. Sendo assim, a leitura, download, cópia, distribuição, impressão e pesquisa do conteúdo integral dos artigos pode ser feita por qualquer interessado de seu público, <strong>totalmente sem custo (livre acesso)</strong>.
                    </p>

                    <h3>2. Ausência de Taxas (APC - Article Processing Charges)</h3>
                    <p>
                        Informamos publicamente que <strong>não existem</strong> taxas para submissão, bem como nem taxa para avaliação, nem processamento (APC - Article Processing Charges) para publicação de qualquer um de nossos artigos.
                    </p>

                    <h3>3. Licenciamento Creative Commons (Creative Commons BY 4.0)</h3>
                    <p>
                        Esta revista encontra-se operando e sob as regulamentações e normativas de <em>Creative Commons Attribution 4.0 (CC BY 4.0)</em>, significando que o uso (seja qual for seu escopo, seja adaptado, construído sob outra perspectiva, em partes ou na íntegra de seu estado original como formato fonte) é permitido em meio a todos os devidos e originais registros referenciados explicitamente, atestando em toda modificação se houve de fato. Em outras palavras, todos os autores estão livres e autorizados a licenciar seu conhecimento sem perder os devidos créditos formais criativos de suas obras autorais inéditas, promovendo as discussões do campo de Psicanálise na era contemporânea mundial e sem limites de distribuição ou venda impeditiva a leitores acadêmicos do mercado.
                    </p>
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
