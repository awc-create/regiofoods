'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PAGE_GROUPS, sectionsForGroup } from '@/content/registry';
import SectionEditor from './SectionEditor';
import styles from './Editor.module.scss';

export default function PageEditor({ group }: { group: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const sections = useMemo(() => sectionsForGroup(group), [group]);
  const info = PAGE_GROUPS.find((g) => g.key === group);
  const requested = params.get('tab');
  const activeKey = sections.some((s) => s.key === requested) ? requested! : sections[0]?.key;
  const active = sections.find((s) => s.key === activeKey);
  const [dirty, setDirty] = useState(false);

  const go = (key: string) => {
    if (key === activeKey) return;
    if (dirty && !confirm('You have unsaved changes on this tab. Leave without saving?')) return;
    router.replace(`/admin/pages/${group}?tab=${encodeURIComponent(key)}`, { scroll: false });
  };

  if (!active) return <p>This page has no editable sections.</p>;

  const legalHref: Record<string, string> = {
    'legal.privacy': '/privacy-policy',
    'legal.terms': '/terms-of-service',
    'legal.cookies': '/cookies',
    'seo.privacy': '/privacy-policy',
    'seo.terms': '/terms-of-service',
    'seo.cookies': '/cookies',
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h1>{info?.label ?? 'Page'}</h1>
        <p>
          Choose a section, change the text or pictures, then press Save. Changes appear on the
          website straight away.
        </p>
      </div>

      <nav className={styles.tabs} role="tablist" aria-label="Sections">
        {sections.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={s.key === activeKey}
            className={`${styles.tab} ${s.key === activeKey ? styles.tabActive : ''}`}
            onClick={() => go(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <label className={styles.mobileTabs}>
        <span>Section</span>
        <select value={activeKey} onChange={(e) => go(e.target.value)}>
          {sections.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <SectionEditor
        key={active.key}
        def={active}
        viewHref={legalHref[active.key] ?? info?.href}
        onDirtyChange={setDirty}
      />
    </div>
  );
}
