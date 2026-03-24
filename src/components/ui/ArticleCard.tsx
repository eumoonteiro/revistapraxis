import Link from 'next/link';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';

interface ArticleProps {
    title: string;
    authors: string | string[];
    date: string;
    category: string;
    abstract: string;
    id: string;
}

export default function ArticleCard({ title, authors, date, category, abstract, id }: ArticleProps) {
    const authorString = Array.isArray(authors) ? authors.join(', ') : authors;

    return (
        <article className="group bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:border-blue-100">
            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                    {category || 'Artigo'}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                    <Calendar size={14} />
                    {date}
                </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                <Link href={`/artigo-ver?id=${id}`}>
                    {title}
                </Link>
            </h3>

            <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                {abstract}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <User size={16} />
                    <span className="truncate max-w-[150px]">{authorString}</span>
                </div>

                <Link
                    href={`/artigo-ver?id=${id}`}
                    className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:gap-2 transition-all"
                >
                    Ler Artigo <ArrowRight size={16} />
                </Link>
            </div>
        </article>
    );
}
