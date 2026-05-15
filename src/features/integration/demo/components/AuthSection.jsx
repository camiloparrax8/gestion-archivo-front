export function AuthSection(props) {
    const { email, password, token, user, isLoading, onEmailChange, onPasswordChange, onSubmit, onMe } = props;
    return (<section className="card">
      <h2>1) Auth (JWT)</h2>
      <form className="grid" onSubmit={onSubmit}>
        <input placeholder="Email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required/>
        <input placeholder="Password" type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} required/>
        <div className="row">
          <button disabled={isLoading} type="submit">
            Login
          </button>
          <button disabled={isLoading} type="button" onClick={onMe}>
            /auth/me
          </button>
        </div>
      </form>
      <p>
        Token: <code>{token ? `${token.slice(0, 25)}...` : '(vacio)'}</code>
      </p>
      <p>
        Usuario: <code>{user ? `${user.email} (${user.rol})` : '(sin sesion)'}</code>
      </p>
    </section>);
}
