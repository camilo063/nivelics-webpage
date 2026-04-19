import { connection } from "next/server";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { getBlogPosts, getBlogCategories } from "@/lib/admin/actions/blog.actions";
import { BlogListClient } from "@/components/admin/forms/BlogListClient";
import { BlogListFilters } from "@/components/admin/forms/BlogListFilters";

const PAGE_SIZE = 20;
const VALID_STATUSES = new Set(["all", "published", "draft", "scheduled", "archived"]);

interface AdminSearchParams {
  page?: string;
  q?: string;
  cat?: string;
  status?: string;
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await connection();
  const params = await searchParams;
  const rawPage = parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const search = (params.q ?? "").trim();
  const categoryId = params.cat ?? "";
  const status = VALID_STATUSES.has(params.status ?? "") ? (params.status as string) : "all";

  const categories = await getBlogCategories();

  const { posts, total } = await getBlogPosts({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    categoryId: categoryId || undefined,
    status,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total);

  const hasFilters = Boolean(search) || Boolean(categoryId) || (status && status !== "all");
  const countLabel = hasFilters ? `${total} artículos encontrados` : `${total} artículos en total`;

  const categoryMap: Record<string, { id: string; nameEs: string; color: string | null }> =
    Object.fromEntries(
      categories.map((c) => [c.id, { id: c.id, nameEs: c.nameEs, color: c.color }]),
    );

  // Preserve filter params on page links.
  const filterQuery = new URLSearchParams();
  if (search) filterQuery.set("q", search);
  if (categoryId) filterQuery.set("cat", categoryId);
  if (status && status !== "all") filterQuery.set("status", status);
  const filterQueryString = filterQuery.toString();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-text-70">{countLabel}</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nuevo artículo
        </Link>
      </div>

      <BlogListFilters
        categories={categories.map((c) => ({ id: c.id, slug: c.slug, nameEs: c.nameEs }))}
        initialSearch={search}
        initialCategory={categoryId}
        initialStatus={status}
      />

      <BlogListClient initialPosts={posts} initialTotal={total} categoryMap={categoryMap} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={total}
          filterQuery={filterQueryString}
        />
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
  total,
  filterQuery,
}: {
  currentPage: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  total: number;
  filterQuery: string;
}) {
  const pageNumbers = buildPageNumbers(currentPage, totalPages);
  const hrefFor = (p: number) => {
    const qs = new URLSearchParams(filterQuery);
    qs.set("page", String(p));
    return `?${qs.toString()}`;
  };
  const prevHref = currentPage > 1 ? hrefFor(currentPage - 1) : undefined;
  const nextHref = currentPage < totalPages ? hrefFor(currentPage + 1) : undefined;

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-40"
    >
      <div>
        Mostrando <span className="text-text-100">{rangeStart}</span>–
        <span className="text-text-100">{rangeEnd}</span> de{" "}
        <span className="text-text-100">{total}</span>
      </div>
      <div className="flex items-center gap-1">
        <PaginationLink href={prevHref} aria-label="Página anterior">
          <ChevronLeft className="h-4 w-4" />
        </PaginationLink>
        {pageNumbers.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-text-40">
              …
            </span>
          ) : (
            <PaginationLink
              key={p}
              href={p === currentPage ? undefined : hrefFor(p)}
              active={p === currentPage}
            >
              {p}
            </PaginationLink>
          ),
        )}
        <PaginationLink href={nextHref} aria-label="Página siguiente">
          <ChevronRight className="h-4 w-4" />
        </PaginationLink>
      </div>
    </nav>
  );
}

function PaginationLink({
  href,
  active,
  children,
  ...rest
}: {
  href?: string;
  active?: boolean;
  children: React.ReactNode;
} & React.AriaAttributes) {
  const base =
    "inline-flex items-center justify-center min-w-[2.25rem] h-9 px-3 rounded-lg text-sm font-medium transition-colors";
  if (active) {
    return (
      <span className={`${base} bg-primary text-bg-base`} aria-current="page" {...rest}>
        {children}
      </span>
    );
  }
  if (!href) {
    return (
      <span className={`${base} text-text-40/50 cursor-not-allowed`} aria-disabled="true" {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} text-text-70 hover:bg-bg-elevated hover:text-text-100 border border-border`}
      {...rest}
    >
      {children}
    </Link>
  );
}

function buildPageNumbers(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: Array<number | "…"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}
