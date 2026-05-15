export function ResultSection({ resultado }) {
    return (<section className="card">
      <h2>Resultado</h2>
      <pre>{resultado || 'Aun sin respuestas'}</pre>
    </section>);
}
