import React from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { supabaseService } from '../../services/supabaseService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Clock, User, Share2, Tag, BookOpen } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const articles = supabaseService.getArticles();
  const article = id ? articles.find(a => a.id === id) : undefined;
  const otherArticles = articles.filter(a => a.id !== id).slice(0, 2);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Artikel Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/edukasi')}>
          Kembali ke Blog Edukasi
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan artikel berhasil disalin ke clipboard!');
    }
  };

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-2 md:py-6">
      
      {/* Editorial Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={() => navigate('/edukasi')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-pink-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Edukasi
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" /> Bagikan Artikel
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="pink" size="sm" className="font-bold uppercase tracking-wider">
            {article.category}
          </Badge>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-pink-500" /> {article.readTime}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-pink-500" /> {article.author}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed bg-pink-50/50 p-4 rounded-2xl border border-pink-100 italic">
          "{article.summary}"
        </p>
      </div>

      {/* Main Cover Image */}
      <div className="overflow-hidden rounded-3xl shadow-sm border border-slate-200 bg-slate-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 sm:h-96 object-cover"
        />
      </div>

      {/* Main Article Content */}
      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4 whitespace-pre-line">
        {article.content}
      </div>

      {/* Article Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-200 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> KATA KUNCI:
          </span>
          {article.tags.map((t, idx) => (
            <span key={idx} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Related Articles Footer */}
      {otherArticles.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Artikel Edukasi Lainnya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherArticles.map(oArt => (
              <div
                key={oArt.id}
                onClick={() => navigate(`/edukasi/${oArt.id}`)}
                className="group p-4 rounded-2xl border border-pink-100 hover:border-pink-300 bg-white transition-colors cursor-pointer space-y-2"
              >
                <Badge variant="pink" size="sm">{oArt.category}</Badge>
                <h4 className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors text-sm line-clamp-1">
                  {oArt.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">{oArt.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
};
