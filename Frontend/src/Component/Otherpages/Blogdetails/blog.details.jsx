import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { FiArrowLeft, FiArrowUpRight, FiCalendar, FiClock } from "react-icons/fi";
import { fetchData } from "../../../utils/api";

const plainText = (content) =>
  (content || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (date) => {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "AgCell Journal"
    : parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

const getReadingTime = (content) =>
  Math.max(1, Math.ceil(plainText(content).split(/\s+/).filter(Boolean).length / 200));

function ArticleSkeleton() {
  return (
    <main className="min-h-[70vh] bg-[#f5f6f8] px-4 py-10" aria-busy="true">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="h-12 max-w-3xl rounded bg-slate-200" />
        <div className="h-5 max-w-xl rounded bg-slate-200" />
        <div className="h-[280px] rounded-3xl bg-slate-200 sm:h-[440px]" />
        <div className="space-y-3">
          <div className="h-4 max-w-4xl rounded bg-slate-200" />
          <div className="h-4 max-w-3xl rounded bg-slate-200" />
          <div className="h-4 max-w-4xl rounded bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError("");
    setBlog(null);

    Promise.all([fetchData(`/api/blog/${id}`), fetchData("/api/blog/get")])
      .then(([articleResponse, listResponse]) => {
        if (!active) return;

        if (!articleResponse?.success || !articleResponse.data) {
          setLoadError(articleResponse?.message || "This article could not be found.");
          setIsLoading(false);
          return;
        }

        setBlog(articleResponse.data);
        const articles = Array.isArray(listResponse?.data) ? listResponse.data : [];
        setOtherBlogs(
          articles.filter((item) => item._id !== id).slice(0, 4)
        );
        setIsLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Failed to load journal article:", error);
        setLoadError("We couldn’t load this article. Please try again.");
        setIsLoading(false);
      });

    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      active = false;
    };
  }, [id]);

  if (isLoading) return <ArticleSkeleton />;

  if (loadError || !blog) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f5f6f8] px-5 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B0000]">
          AgCell Journal
        </span>
        <h1 className="mt-3 text-3xl font-bold text-[#0F1F4B]">
          Article unavailable
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {loadError || "This article could not be found."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0F1F4B] px-5 text-sm font-semibold text-white transition hover:bg-[#8B0000]"
        >
          <FiArrowLeft /> Back to AgCell
        </Link>
      </main>
    );
  }

  const articleText = plainText(blog.description);
  const sanitizedDescription = DOMPurify.sanitize(blog.description || "");

  return (
    <main className="bg-white">
      <div className="bg-[#f5f6f8] px-4 pb-10 pt-7 sm:pb-14 sm:pt-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#8B0000]"
          >
            <FiArrowLeft aria-hidden="true" />
            Back to the journal
          </Link>

          <div className="mx-auto mt-8 max-w-4xl text-center sm:mt-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#8B0000]/15 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B0000]">
              AgCell Journal
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0F1F4B] sm:text-4xl md:text-5xl">
              {blog.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <FiCalendar className="text-[#8B0000]" aria-hidden="true" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span className="inline-flex items-center gap-2">
                <FiClock className="text-[#8B0000]" aria-hidden="true" />
                {getReadingTime(blog.description)} min read
              </span>
            </div>
          </div>

          {blog.image?.[0]?.url && (
            <figure className="relative mt-8 overflow-hidden rounded-2xl bg-slate-200 shadow-lg sm:mt-10 sm:rounded-3xl">
              <img
                src={blog.image[0].url}
                alt={blog.title}
                fetchPriority="high"
                className="max-h-[620px] min-h-[240px] w-full object-cover sm:min-h-[360px] lg:min-h-[460px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1F4B]/25 to-transparent" />
            </figure>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <article className="min-w-0">
          {articleText && (
            <p className="mb-8 border-l-2 border-[#8B0000] pl-5 text-lg font-medium leading-8 text-[#43516e] sm:text-xl sm:leading-9">
              {articleText.slice(0, 220)}
              {articleText.length > 220 ? "…" : ""}
            </p>
          )}
          <div
            className="journal-article-content"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          {blog.image?.length > 1 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {blog.image.slice(1).map((image, index) => (
                <img
                  key={image.fileId || image.url || index}
                  src={image.url}
                  alt={`${blog.title} — image ${index + 2}`}
                  loading="lazy"
                  className="h-56 w-full rounded-2xl bg-slate-100 object-cover sm:h-64"
                />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-[#0F1F4B] p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                Keep exploring
              </p>
              <h2 className="mt-2 text-xl font-bold">Find your next favorite.</h2>
            </div>
            <Link
              to="/products"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#0F1F4B] transition hover:bg-[#f5dede] sm:mt-0"
            >
              Shop the collection <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-5 flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B0000]">
                More to discover
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#0F1F4B]">
                Latest stories
              </h2>
            </div>
          </div>
          {otherBlogs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {otherBlogs.map((item) => {
                const excerpt = plainText(item.description);
                return (
                  <Link
                    key={item._id}
                    to={`/blog/${item._id}`}
                    className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-[#8B0000]/30 hover:shadow-md"
                  >
                    {item.image?.[0]?.url ? (
                      <img
                        src={item.image[0].url}
                        alt=""
                        loading="lazy"
                        className="h-20 w-24 shrink-0 rounded-xl bg-slate-100 object-cover"
                      />
                    ) : (
                      <span className="h-20 w-24 shrink-0 rounded-xl bg-gradient-to-br from-[#0F1F4B] to-[#8B0000]" />
                    )}
                    <span className="min-w-0 py-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-sm font-bold leading-snug text-[#0F1F4B] transition group-hover:text-[#8B0000]">
                        {item.title}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                        {excerpt}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              More stories are coming soon.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
