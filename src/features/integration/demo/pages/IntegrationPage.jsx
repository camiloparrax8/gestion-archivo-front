import { env } from '@config/env';
import { AuthSection } from '../components/AuthSection';
import { AdminSection } from '../components/AdminSection';
import { MultimediaSection } from '../components/MultimediaSection';
import { ResultSection } from '../components/ResultSection';
import { useIntegrationDemo } from '../hooks/useIntegrationDemo';
export function IntegrationPage() {
    const { state, rutasPreview, setField, setTipo, handleLogin, handleMe, handleCrearCliente, handleCrearLlave, handleListar, handleSubir, handleEliminar, } = useIntegrationDemo();
    return (<main className="app">
      <h1>Guven</h1>
      <p className="muted">
        Base URL: <code>{env.apiUrl}</code>
      </p>
      <p className="muted">
        Master key configurada: <strong>{env.masterKey ? 'Si' : 'No'}</strong>
      </p>

      <AuthSection email={state.email} password={state.password} token={state.token} user={state.user} isLoading={state.isLoading} onEmailChange={(value) => setField('email', value)} onPasswordChange={(value) => setField('password', value)} onSubmit={handleLogin} onMe={handleMe}/>

      <AdminSection clienteEmail={state.clienteEmail} clienteNombre={state.clienteNombre} clienteId={state.clienteId} keyName={state.keyName} keyPrefixes={state.keyPrefixes} apiKey={state.apiKey} isLoading={state.isLoading} onClienteEmailChange={(value) => setField('clienteEmail', value)} onClienteNombreChange={(value) => setField('clienteNombre', value)} onClienteIdChange={(value) => setField('clienteId', value)} onKeyNameChange={(value) => setField('keyName', value)} onKeyPrefixesChange={(value) => setField('keyPrefixes', value)} onCrearCliente={handleCrearCliente} onCrearLlave={handleCrearLlave}/>

      <MultimediaSection contexto={state.contexto} entidadId={state.entidadId} tipo={state.tipo} archivoEliminar={state.archivoEliminar} rutasPreview={rutasPreview} isLoading={state.isLoading} onContextoChange={(value) => setField('contexto', value)} onEntidadIdChange={(value) => setField('entidadId', value)} onTipoChange={setTipo} onArchivoChange={(file) => setField('archivo', file)} onArchivoEliminarChange={(value) => setField('archivoEliminar', value)} onListar={handleListar} onSubir={handleSubir} onEliminar={handleEliminar}/>

      <ResultSection resultado={state.resultado}/>
    </main>);
}
