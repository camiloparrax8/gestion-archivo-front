export function MultimediaSection(props) {
    const { contexto, entidadId, tipo, archivoEliminar, rutasPreview, isLoading, onContextoChange, onEntidadIdChange, onTipoChange, onArchivoChange, onArchivoEliminarChange, onListar, onSubir, onEliminar, } = props;
    return (<section className="card">
      <h2>3) Multimedia (Llave)</h2>
      <p className="muted">
        Ruta: <code>/api/v1/multimedia/{'{contexto}'}/usuarios/{'{id}'}/{'{tipo}'}</code> - el segmento <code>usuarios</code>{' '}
        es fijo
      </p>
      <div className="grid">
        <input value={contexto} onChange={(e) => onContextoChange(e.target.value)} placeholder="contexto (ej. orion)"/>
        <input value={entidadId} onChange={(e) => onEntidadIdChange(e.target.value)} placeholder="id del recurso"/>
        <select value={tipo} onChange={(e) => onTipoChange(e.target.value)}>
          <option value="perfil">perfil</option>
          <option value="logo">logo</option>
          <option value="galeria">galeria</option>
          <option value="documentos">documentos</option>
          <option value="marca">marca</option>
          <option value="otros">otros</option>
        </select>
        <p>
          Ruta: <code>{rutasPreview}</code>
        </p>
        <div className="row">
          <button disabled={isLoading} type="button" onClick={onListar}>
            Listar
          </button>
        </div>
      </div>

      <form className="grid" onSubmit={onSubir}>
        <input type="file" onChange={(e) => onArchivoChange(e.target.files?.[0] || null)}/>
        <button disabled={isLoading} type="submit">
          Subir archivo
        </button>
      </form>

      <div className="row">
        <input value={archivoEliminar} onChange={(e) => onArchivoEliminarChange(e.target.value)} placeholder="nombre archivo para eliminar"/>
        <button disabled={isLoading} type="button" onClick={onEliminar}>
          Eliminar
        </button>
      </div>
    </section>);
}
