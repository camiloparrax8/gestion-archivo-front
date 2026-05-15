export function buildClienteCreatePayload({ email, nombre, telefono, activo, tipoDocumento, numeroDocumento }) {
  const t = telefono.trim();
  const td = tipoDocumento.trim();
  const nd = numeroDocumento.trim();
  return {
    email: email.trim(),
    nombre: nombre.trim(),
    telefono: t,
    phone: t,
    activo,
    tipoDocumento: td,
    documentType: td,
    numeroDocumento: nd,
  };
}
