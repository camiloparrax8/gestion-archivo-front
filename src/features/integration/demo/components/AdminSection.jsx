export function AdminSection(props) {
    const { clienteEmail, clienteNombre, clienteId, keyName, keyPrefixes, apiKey, isLoading, onClienteEmailChange, onClienteNombreChange, onClienteIdChange, onKeyNameChange, onKeyPrefixesChange, onCrearCliente, onCrearLlave, } = props;
    return (<section className="card">
      <h2>2) Admin (cliente + API key)</h2>

      <form className="grid" onSubmit={onCrearCliente}>
        <input placeholder="Email cliente" type="email" value={clienteEmail} onChange={(e) => onClienteEmailChange(e.target.value)} required/>
        <input placeholder="Nombre cliente" value={clienteNombre} onChange={(e) => onClienteNombreChange(e.target.value)} required/>
        <button disabled={isLoading} type="submit">
          Crear cliente
        </button>
      </form>

      <form className="grid" onSubmit={onCrearLlave}>
        <input placeholder="Cliente ID (publicId)" value={clienteId} onChange={(e) => onClienteIdChange(e.target.value)} required/>
        <input placeholder="Nombre API key" value={keyName} onChange={(e) => onKeyNameChange(e.target.value)} required/>
        <input placeholder="Prefijos separados por coma" value={keyPrefixes} onChange={(e) => onKeyPrefixesChange(e.target.value)} required/>
        <button disabled={isLoading} type="submit">
          Crear API key
        </button>
      </form>

      <p>
        API key ID: <code>{apiKey?.publicId || '(sin crear)'}</code>
      </p>
    </section>);
}
