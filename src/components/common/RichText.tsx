import { Fragment } from 'react';

/**
 * Very small formatter for text typed in the admin:
 *   "## Heading"  → <h2>
 *   "- item"      → bullet list
 *   blank line    → new paragraph
 */
export default function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = (text ?? '').replace(/\r\n/g, '\n').split('\n');
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push(
        <p key={blocks.length}>
          {para.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {l}
            </Fragment>
          ))}
        </p>
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={blocks.length}>
          {list.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('## ')) {
      flushPara();
      flushList();
      blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>);
    } else if (/^[-•]\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^[-•]\s+/, ''));
    } else if (line.trim() === '') {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();

  return <>{blocks}</>;
}
