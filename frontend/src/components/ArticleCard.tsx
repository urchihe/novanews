import React from "react";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100 h-full">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.urlToImage}
          alt={article.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-md tracking-wider">
            {article?.category?.name}
          </span>
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold uppercase rounded-md tracking-wider">
            {article.source?.name}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-400 mb-2 gap-2">
          <span>{article.author?.name}</span>
          <span>•</span>
          <span>{formatDate(article.published_at)}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
          {article.description}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 mt-auto"
        >
          Read Full Story{" "}
          <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
