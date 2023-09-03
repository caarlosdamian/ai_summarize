// eslint-disable @typescript-eslint/ban-ts-comment
import React, { useState, useEffect } from 'react';
import { copy, linkIcon, tick, loader } from '../../assets';
import { useLazyGetSummaryQuery } from '../../services/article';

interface Article {
  url: string;
  summary: string;
}

export const Demo = () => {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [article, setArticle] = useState<Article>({
    url: '',
    summary: '',
  });
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState<string | undefined>(undefined);

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')!
    );
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    console.log(data);
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyurl: string) => {
    setCopied(copyurl);
    navigator.clipboard.writeText(copyurl);
    setTimeout(() => {
      setCopied(undefined);
    }, 2000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          action=""
          className="relative flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 w-5 ml-3"
          />
          <input
            type="url"
            placeholder="Enter a Url"
            value={article.url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setArticle(() => ({ ...article, url: e.target.value }))
            }
            required
            className="url_input peer"
          />
          <button
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
            type="submit"
          >
            <p>↵</p>
          </button>
        </form>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              className="link_card"
              key={`link-${index}`}
              onClick={() => setArticle(item)}
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happend
            <br />
            <span className="font-satoshi font-normal text-gray-700">
             {/* @ts-ignore */}
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};
