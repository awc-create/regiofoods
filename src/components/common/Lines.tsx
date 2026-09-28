import { Fragment } from 'react';

/** Renders text typed in the admin, turning each new line into a <br />. */
export default function Lines({ text }: { text: string }) {
  const parts = (text ?? '').split('\n');
  return (
    <>
      {parts.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
