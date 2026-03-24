import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';

export default function EthicsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-[var(--header-height)]">
            <div className="container-custom py-16 max-w-4xl">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Leaf size={28} />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900">Política de Ética e Publicação</h1>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                    <h3>1. Compromisso Ético</h3>
                    <p>
                        A equipe editorial da Revista Práxis Psicanalítica e seus diferentes atores (editores, autores, e revisores pares) repudiam e sancionam energicamente todo comportamento contrário à lealdade, ética universitária e científica. Desta maneira, é terminantemente proibido o plágio, manipulação de citação, viés discriminatório e qualquer fraude em publicações acadêmicas.
                    </p>

                    <h3>2. Responsabilidades dos Autores</h3>
                    <p>
                        Os autores são inteiramente responsáveis pelo teor do conteúdo de seus artigos, assim como pela originalidade da obra submetida. Ao encaminharem um manuscrito para nossa avaliação:
                    </p>
                    <ul>
                        <li>Garantem que a obra seja inédita e original.</li>
                        <li>Afirmam que este trabalho não se encontra em avaliação simultânea em outro periódico ou meio editorial.</li>
                        <li>Devem certificar-se de referenciar adequadamente pesquisas alheias e trechos de textos de terceiros, se usados, concedendo seus respectivos créditos aos autores.</li>
                        <li>Os autores declaram se estão cientes e atuaram sem nenhum conflito de interesse.</li>
                    </ul>

                    <h3>3. Da Avaliação por Pares (Peer Review)</h3>
                    <p>
                        Os artigos científicos submetidos à avaliação passam por um rigoroso processo de 'avaliação cega por pares' (Double Blind Peer Review). O processo consiste na revisão de pelo menos dois pesquisadores distintos e ocultos. No processo se valorizam a confidencialidade e imparcialidade. O processo foca unicamente no rigor científico, excelência metodológica, aderência às temáticas da Psicanálise e contribuição.
                    </p>

                    <h3>4. Publicação Restificada ou Retratação</h3>
                    <p>
                        Se constatada a incidência de falhas significativas, violação aos princípios de conduta como difamação, falsificação ou plágio ou duplicidade de publicação após todo a sua tramitação normal, a editoria se reserva no pleno direito de rejeição ou eventual retratação e remoção permanente de artigos previamente publicados.
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
