// src/components/products/catalogue/ProductCatalogue.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCatalogue.module.scss';

import type { CatalogueProduct } from '@/lib/catalogue';
import type { productsCatalogue } from '@/content/sections/pages';

type Props = {
  heading: typeof productsCatalogue.defaults;
  products: CatalogueProduct[];
  /** Parent tabs and their sub-categories, in the order set in the admin. */
  tabs: { name: string; children: string[] }[];
};

export default function ProductCatalogue({ heading, products, tabs }: Props) {
  const PRODUCTS = products;
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState<number>(16); // default 16
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close the product list when clicking outside the search box
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Parent → child categories map (order comes from the admin)
  const parentMap = useMemo(
    () => Object.fromEntries(tabs.map((t) => [t.name, t.children])) as Record<string, string[]>,
    [tabs]
  );

  // Filter + search in one memo so it's cheap & predictable
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    if (activeFilter !== 'all') {
      result = result.filter(
        (p) =>
          p.parentCollection === activeFilter || p.variants.some((v) => v.category === activeFilter)
      );
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        if (p.baseName.toLowerCase().includes(q)) return true;
        return p.variants.some((v) => (v.name || '').toLowerCase().includes(q));
      });
    }

    return result;
  }, [PRODUCTS, activeFilter, searchTerm]);

  // Alphabetical product list shown under the search box
  const suggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return [...PRODUCTS]
      .filter((p) => !q || p.baseName.toLowerCase().includes(q))
      .sort((a, b) => a.baseName.localeCompare(b.baseName));
  }, [PRODUCTS, searchTerm]);

  // Pagination maths
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);

  const handleFilterClick = (value: string) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fromItem = totalItems === 0 ? 0 : startIndex + 1;
  const toItem = Math.min(endIndex, totalItems);

  return (
    <section id="product-catalogue" className={styles.section}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          {heading.eyebrow && <p className={styles.eyebrow}>{heading.eyebrow}</p>}
          <h2 className={styles.heading}>{heading.heading}</h2>
          {heading.intro && <p className={styles.subheading}>{heading.intro}</p>}
        </div>

        {/* TOP BAR – filters + search + per-page */}
        <div className={styles.topBar}>
          {/* FILTERS */}
          <div className={styles.filterGrid}>
            <button
              type="button"
              className={`${styles.parentChip} ${
                activeFilter === 'all' ? styles.activeParent : ''
              }`}
              onClick={() => handleFilterClick('all')}
            >
              All products
            </button>

            {Object.keys(parentMap).map((parent) => (
              <div key={parent} className={styles.parentWrap}>
                <button
                  type="button"
                  className={`${styles.parentChip} ${
                    activeFilter === parent ? styles.activeParent : ''
                  }`}
                  onClick={() => handleFilterClick(parent)}
                >
                  {parent}
                </button>

                {/* child dropdown */}
                <div className={styles.childMenu}>
                  {parentMap[parent].map((child) => (
                    <button
                      key={child}
                      type="button"
                      className={`${styles.childChip} ${
                        activeFilter === child ? styles.activeChild : ''
                      }`}
                      onClick={() => handleFilterClick(child)}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* SEARCH + PER PAGE */}
          <div className={styles.searchGroup}>
            <div className={styles.searchBox} ref={searchRef}>
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search or browse products…"
                value={searchTerm}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                  setSuggestOpen(true);
                }}
                onFocus={() => setSuggestOpen(true)}
                onKeyDown={(e) => e.key === 'Escape' && setSuggestOpen(false)}
                role="combobox"
                aria-expanded={suggestOpen}
                aria-controls="product-suggestions"
                aria-autocomplete="list"
              />

              {suggestOpen && (
                <ul id="product-suggestions" className={styles.suggestList} role="listbox">
                  <li className={styles.suggestMeta}>
                    {suggestions.length} product{suggestions.length === 1 ? '' : 's'}
                  </li>
                  {suggestions.length === 0 && (
                    <li className={styles.suggestEmpty}>No matching products</li>
                  )}
                  {suggestions.map((p) => (
                    <li key={p.slug} role="option" aria-selected={false}>
                      <Link
                        href={`/products/${p.slug}`}
                        className={styles.suggestItem}
                        onClick={() => setSuggestOpen(false)}
                      >
                        <span>{p.baseName}</span>
                        <small>{p.parentCollection}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.perPage}>
              <span className={styles.perPageLabel}>Show</span>
              <select
                className={styles.perPageSelect}
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
              >
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
              </select>
              <span className={styles.perPageSuffix}>per page</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className={styles.grid}>
        {pageProducts.length === 0 && (
          <div className={styles.emptyState}>
            No products match that search or filter. Try clearing the search box or choosing
            &ldquo;All products&rdquo;.
          </div>
        )}

        {pageProducts.map((p) => {
          const slug = p.slug;

          const mainImage = p.variants.find((v) => v.image)?.image || '';
          const packSizes = p.variants.map((v) => v.packSize).join(' • ');

          return (
            <Link key={slug} href={`/products/${slug}`} className={styles.card}>
              <div className={styles.imageWrap}>
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={p.baseName}
                    fill
                    sizes="(min-width: 1200px) 25vw, (min-width: 880px) 33vw, 50vw"
                  />
                ) : (
                  <span className={styles.noImage}>Image coming soon</span>
                )}
                {p.parentCollection && <span className={styles.badge}>{p.parentCollection}</span>}
              </div>

              <h3 className={styles.title}>{p.baseName}</h3>

              {packSizes && (
                <p className={styles.metaLine}>
                  <span>{packSizes}</span>
                </p>
              )}

              <span className={styles.moreBtn}>View details →</span>
            </Link>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalItems > 0 && (
        <div className={styles.paginationBar}>
          <p className={styles.paginationMeta}>
            Showing{' '}
            <strong>
              {fromItem}–{toItem}
            </strong>{' '}
            of <strong>{totalItems}</strong> products
          </p>

          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageButton}
              disabled={safePage <= 1}
              onClick={() => handlePageChange(safePage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = page === safePage;

              return (
                <button
                  key={page}
                  type="button"
                  className={`${styles.pageButton} ${isActive ? styles.pageButtonActive : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className={styles.pageButton}
              disabled={safePage >= totalPages}
              onClick={() => handlePageChange(safePage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
