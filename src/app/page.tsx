"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, PenTool, Search, Bell, Calendar } from 'lucide-react';
import ArticleCard from '@/components/ui/ArticleCard';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// Fallback local data if Firebase is empty initially
import { articles as localArticles } from '@/lib/data';

export default function Home() {
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [latestEdition, setLatestEdition] = useState<any>(null);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest published edition
        const edQ = query(collection(db, "editions"), orderBy("createdAt", "desc"), limit(5));
        const edSnap = await getDocs(edQ);
        if (!edSnap.empty) {
          const publishedEditionDocs = edSnap.docs.filter(doc => doc.data().status === 'published');
          if (publishedEditionDocs.length > 0) {
            const edData = publishedEditionDocs[0].data();
            setLatestEdition({ id: publishedEditionDocs[0].id, ...edData });
          }
        }

        // Fetch recent articles
        const q = query(collection(db, "articles"), orderBy("publishedAt", "desc"), limit(6));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setRecentArticles(data);
        } else {
          setRecentArticles(localArticles);
        }

        // Fetch latest news
        const newsQ = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(3));
        const newsSnap = await getDocs(newsQ);
        setLatestNews(newsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((n: any) => n.status !== 'deleted')
        );
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setRecentArticles(localArticles);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-24 md:gap-40 pb-32">
      {/* Hero Section */}
      <section className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-900/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-indigo-900/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

        <div className="container-custom relative z-10 py-28 md:py-48 flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-4">
              <span className="text-blue-400/80 text-xs font-mono tracking-[0.2em] uppercase">ISSN 2763-9525</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-800 text-blue-200 text-xs font-semibold uppercase tracking-wider w-fit">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                {latestEdition ? `Edição Atual: Vol. ${latestEdition.volume}, Nº ${latestEdition.number} (${latestEdition.year})` : 'Acompanhe Nossas Publicações'}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              A Psicanálise em <br />
              <span className="text-blue-500">Diálogo com o Tempo</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Revista científica dedicada à transmissão e discussão da psicanálise,
              suas conexões com a cultura e seus desafios na clínica contemporânea.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {latestEdition ? (
                <Link href={`/edicao-ver?id=${latestEdition.id}`} className="btn-primary flex items-center gap-2">
                  <BookOpen size={20} />
                  Ler Edição Atual
                </Link>
              ) : (
                <Link href="/edicoes" className="btn-primary flex items-center gap-2">
                  <BookOpen size={20} />
                  Ver Edições
                </Link>
              )}
              <Link href="/sobre" className="px-6 py-3 rounded-md bg-transparent border border-slate-700 text-white hover:bg-slate-800 transition-colors font-medium">
                Saiba Mais
              </Link>
            </div>
          </div>

          {/* Cover Visual Visualization */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-64 md:w-80 aspect-[3/4] bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-[-6deg] hover:rotate-0 transition-all duration-500 overflow-hidden group">
              {latestEdition?.coverUrl ? (
                <img src={latestEdition.coverUrl} className="w-full h-full object-cover" alt="Capa da Edição Atual" />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 p-6 flex flex-col justify-between`}>
                  <div className="text-slate-900 font-serif font-bold text-2xl border-b-2 border-slate-900 pb-4">
                    PRÁXIS <br />
                    <span className="text-sm font-sans font-normal tracking-widest uppercase">Psicanalítica</span>
                  </div>
                  <div className="space-y-4">
                    <div className="h-1 w-full bg-slate-900"></div>
                    <div className="text-4xl font-bold text-blue-900/20">{latestEdition?.year || '2024'}</div>
                    <div className="text-sm text-slate-500 font-medium">
                      Vol. {latestEdition?.volume || '5'} • Nº {latestEdition?.number || '2'} <br />
                      ISSN 2763-9525
                    </div>
                  </div>
                </div>
              )}
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-y-full group-hover:translate-y-[-200%] transition-transform duration-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">Artigos em Destaque</h2>
            <p className="text-slate-500 mt-2">Seleção dos trabalhos mais acessados e relevantes da última edição.</p>
          </div>
          <Link href="/edicoes" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Ver todas as edições <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/edicoes" className="text-blue-600 font-medium">Ver todas as edições &rarr;</Link>
        </div>
      </section>

      {/* News Preview Section */}
      {latestNews.length > 0 && (
        <section className="bg-blue-50/50 py-24">
            <div className="container-custom">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="section-title">Avisos e Chamadas</h2>
                        <p className="text-slate-500 mt-2">Dossiês temáticos com submissões abertas e notícias institucionais.</p>
                    </div>
                    <Link href="/noticias" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition-colors">
                        Ver mural completo <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestNews.map(item => (
                        <Link href={item.link || "/noticias"} key={item.id} className="group bg-white rounded-2xl p-2 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col">
                            {item.imageUrl && (
                                <div className="aspect-video w-full rounded-xl overflow-hidden mb-4">
                                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                </div>
                            )}
                            <div className="p-4 flex-grow">
                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                                    <Bell size={12} className="text-blue-500" /> Chamada Aberta
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                            </div>
                            <div className="px-4 pb-4 mt-auto">
                                <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs group-hover:gap-3 transition-all">
                                    Acesse as Diretrizes <ArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* Call to Action for Submission */}
      <section className="container-custom py-8 md:py-16">
        <div className="bg-slate-100/80 backdrop-blur-sm rounded-[2rem] p-10 md:p-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 border border-slate-200/50">
          <div className="flex-1 space-y-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
              <PenTool size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Publique conosco</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              A Revista Práxis Psicanalítica convida pesquisadores e psicanalistas a submeterem seus trabalhos.
              Nosso processo de revisão é rigoroso e transparente.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Revisão por pares duplo-cega
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Indexação em bases relevantes
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Publicação em acesso aberto (Open Access)
              </li>
            </ul>
            <Link href="/submissao" className="inline-block mt-4 px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
              Ver Diretrizes de Submissão
            </Link>
          </div>
          <div className="flex-1 w-full relative h-[300px] bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200">
            {/* Abstract representation of writing/reviewing */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <div className="text-center space-y-4 p-8">
                <div className="text-slate-300 mx-auto w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center">
                  <span className="text-2xl font-serif">¶</span>
                </div>
                <div className="h-2 w-32 bg-slate-200 rounded mx-auto"></div>
                <div className="h-2 w-24 bg-slate-200 rounded mx-auto"></div>
                <div className="h-2 w-28 bg-slate-200 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Notifications */}
      <section className="container-custom text-center py-20 border-t border-slate-100/50">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Fique atualizado</h3>
        <p className="text-slate-500 mb-6">Receba notificações sobre novas edições e chamadas de artigos.</p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Inscrever
          </button>
        </div>
      </section>
    </div>
  );
}
