// src/components/products/catalogue/ProductCatalogue.tsx
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import productsData from '@/data/products.json';
import { slugify } from '@/utils/slugify';
import styles from './ProductCatalogue.module.scss';

export type ProductVariant = {
  name: string;
  packSize: string;
  category: string;
  image: string;
};

export type Product = {
  baseName: string;
  description: string;
  parentCollection: string;
  collections: string[];
  variants: ProductVariant[];
};

const PRODUCTS = productsData as Product[];

export default function ProductCatalogue() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState<number>(16); // default 16
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Parent → child categories map
  const parentMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};

    PRODUCTS.forEach((p) => {
      const parent = p.parentCollection || 'Other';
      if (!map[parent]) map[parent] = new Set();

      p.variants.forEach((v) => {
        if (v.category) map[parent].add(v.category);
      });
    });

    return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, Array.from(v).sort()]));
  }, []);

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
  }, [activeFilter, searchTerm]);

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
          <p className={styles.eyebrow}>Catalogue</p>
          <h2 className={styles.heading}>Browse the current frozen range.</h2>
          <p className={styles.subheading}>
            These products are currently in production. Specifications and artwork can be tuned for
            private-label or regional requirements.
          </p>
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
            <div className={styles.searchBox}>
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search products…"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
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
          const slug = slugify(p.baseName);

          const mainImage = p.variants[0]?.image || '/placeholder.jpg';
          const packSizes = p.variants.map((v) => v.packSize).join(' • ');

          return (
            <Link key={slug} href={`/products/${slug}`} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={mainImage}
                  alt={p.baseName}
                  fill
                  sizes="(min-width: 1200px) 25vw, (min-width: 880px) 33vw, 50vw"
                />
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
