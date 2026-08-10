import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../../services/supabaseService';
import { Badge } from '../../components/ui/Badge';
import { Clock } from 'lucide-react';

export const EducationPage: React.FC = () => {
  const articles = supabaseService.getArticles();
  const navigate = useNavigate();

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-2 md:py-6">
      
      {/* Blog Hero Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto border-b border-slate-200 pb-8">
        <Badge variant="pink" size="md" className="uppercase tracking-wider font-bold">
          JURNAL & PANDUAN LINGKUNGAN
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Edukasi Memilah Sampah & Tips Desa Rowotamtu
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Artikel informatif dari Mahasiswa KKN-K ROWOTAMTU untuk membantu warga menjaga lingkungan dan mengelola tabungan sampah digital.
        </p>
      </div>

      {/* Featured Main Article (Hero Post) */}
      {featuredArticle && (
        <section 
          onClick={() => navigate(`/edukasi/${featuredArticle.id}`)}
          className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-10 border-b border-slate-200"
        >
          <div className="md:col-span-7 overflow-hidden rounded-2xl shadow-sm bg-slate-100">
            <img
              src={featuredArticle.imageUrl}
              alt={featuredArticle.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="pink" size="sm" className="font-bold">
                {featuredArticle.category}
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-pink-500" /> {featuredArticle.readTime}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors leading-tight">
              {featuredArticle.title}
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {featuredArticle.summary}
            </p>
          </div>
        </section>
      )}

      {/* Grid of Regular Articles */}
      {regularArticles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {regularArticles.map(art => (
            <article 
              key={art.id}
              onClick={() => navigate(`/edukasi/${art.id}`)}
              className="group cursor-pointer space-y-3 border border-pink-100 p-4 rounded-2xl bg-white hover:border-pink-300 transition-colors"
            >
              <div className="overflow-hidden rounded-xl h-48 bg-slate-100">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="pink" size="sm">{art.category}</Badge>
                  <span className="text-xs text-slate-400 font-medium">{art.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
