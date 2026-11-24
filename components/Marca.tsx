/** Logotipo en Postmark (sacado del cartel original). Sustituir por la fuente o un SVG cuando esté disponible. */
export function Marca({ className = "" }: { className?: string }) {
  return (
    <span className={`marca ${className}`}>
      <img src="/marca/wordmark.png" alt="Lazo Society" width={4315} height={665} />
    </span>
  );
}
