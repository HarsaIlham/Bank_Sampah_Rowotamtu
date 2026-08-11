import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../../services/supabaseService';
import { resolveImageUrl } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft, 
  Clock, 
  Share2, 
  BookOpen, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const articles = supabaseService.getArticles();
  const currentIndex = articles.findIndex(a => a.id === id);
  const article = currentIndex !== -1 ? articles[currentIndex] : undefined;

  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const otherArticles = articles.filter(a => a.id !== id).slice(0, 3);

  const [copied, setCopied] = React.useState(false);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Artikel Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Maaf, materi edukasi yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/edukasi')}>
          Kembali ke Pusat Edukasi
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch {
        // user cancelled or failed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-2 md:py-6">
      
      {/* Top Editorial Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={() => navigate('/edukasi')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-pink-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100/70 border border-pink-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Tautan Disalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Artikel</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <Badge variant="pink" size="sm" className="font-extrabold uppercase tracking-wider">
            {article.category}
          </Badge>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-pink-500" /> {article.readTime}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-pink-500" /> {article.date}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Lead Intro Box */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50/60 to-pink-50/40 p-4 sm:p-5 rounded-2xl border border-pink-200/80 shadow-2xs">
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            {article.summary}
          </p>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="overflow-hidden rounded-3xl shadow-sm border border-slate-200/80 bg-slate-100 max-h-[380px]">
        <img
          src={resolveImageUrl(article.imageUrl)}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Structured Modern Blog Content */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
        
        {/* If structured sections exist, render rich UI */}
        {article.sections && article.sections.length > 0 ? (
          article.sections.map((sec, sIdx) => (
            <section key={sIdx} className="space-y-4">
              
              {/* Section Heading */}
              {sec.title && (
                <div className="flex items-center gap-2.5 pt-2 border-b border-slate-100 pb-2">
                  <span className="w-2.5 h-6 bg-pink-500 rounded-full inline-block"></span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {sec.title}
                  </h2>
                </div>
              )}

              {/* Callout Box */}
              {sec.isCallout && sec.body && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 space-y-1">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {sec.body}
                  </p>
                </div>
              )}

              {/* Regular Body Paragraph */}
              {!sec.isCallout && sec.body && (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {sec.body}
                </p>
              )}

              {/* Step Sequence List */}
              {sec.isSteps && sec.items && (
                <div className="space-y-3 pt-1">
                  {sec.items.map((item, iIdx) => (
                    <div 
                      key={iIdx} 
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-pink-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs shadow-pink-200 mt-0.5">
                        {iIdx + 1}
                      </div>
                      <div className="space-y-1 flex-1">
                        {item.title && (
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.title}
                          </h3>
                        )}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Item Grid / Key Highlights */}
              {!sec.isSteps && sec.items && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {sec.items.map((item, iIdx) => (
                    <div 
                      key={iIdx} 
                      className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex flex-col justify-between space-y-2 hover:border-pink-200 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          {item.title && (
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                              {item.title}
                            </h3>
                          )}
                          {item.badge && (
                            <span className="text-[10px] font-extrabold text-pink-700 bg-pink-100/90 px-2 py-0.5 rounded-md">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </section>
          ))
        ) : (
          /* Fallback for simple plain content */
          <p className="text-sm text-slate-700 leading-relaxed">
            {article.content}
          </p>
        )}

        {/* Highlight Key Takeaway Box */}
        {article.takeaway && (
          <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50/40 to-pink-50/70 border border-amber-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-2xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span>Poin Penting untuk Warga</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {article.takeaway}
            </p>
          </div>
        )}

      </div>

      {/* Author & Tags Footer */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
            KKN
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{article.author}</p>
            <p className="text-[11px] text-slate-500">Program Kerja Pemberdayaan Bank Sampah Desa Rowotamtu</p>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {article.tags.map((t, idx) => (
              <span key={idx} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Previous & Next Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {prevArticle ? (
          <button
            onClick={() => {
              navigate(`/edukasi/${prevArticle.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-pink-300 hover:shadow-md transition-all text-left group cursor-pointer space-y-1"
          >
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-pink-600 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Materi Sebelumnya
            </span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-1">
              {prevArticle.title}
            </p>
          </button>
        ) : (
          <div className="hidden sm:block"></div>
        )}

        {nextArticle && (
          <button
            onClick={() => {
              navigate(`/edukasi/${nextArticle.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-pink-300 hover:shadow-md transition-all text-right group cursor-pointer space-y-1 ml-auto w-full sm:w-auto"
          >
            <span className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1 group-hover:text-pink-600 transition-colors">
              Materi Selanjutnya <ChevronRight className="w-4 h-4" />
            </span>
            <p className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-1">
              {nextArticle.title}
            </p>
          </button>
        )}
      </div>

      {/* Other Articles Recommendation */}
      {otherArticles.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80 space-y-4">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" /> Materi Edukasi Terkait
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherArticles.map(oArt => (
              <div
                key={oArt.id}
                onClick={() => {
                  navigate(`/edukasi/${oArt.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group p-4 rounded-2xl border border-pink-100 hover:border-pink-300 bg-white transition-all hover:shadow-md cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md inline-block">
                    {oArt.category}
                  </span>
                  <h4 className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors text-xs line-clamp-2 leading-snug">
                    {oArt.title}
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-pink-500 flex items-center gap-1 pt-2 border-t border-slate-50">
                  Baca Selengkapnya →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
};
