

export default function LotesDisponibles() {
  const [medId, setMedId] = useState('');
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');

  async function load() {
    try {
      setErr('');
      const data = await apiAddons.lotes(medId ? Number(medId) : undefined, true);
      // Asegura array:
      const list = Array.isArray(data) ? data : [];
      setRows(list);
      console.log('LotesDisponibles -> data:', data); // debug
    } catch (e) {
      setErr(e.message || 'Error al cargar lotes');
      setRows([]);
      console.error(e);
    }
  }

  useEffect(() => { load(); /* carga inicial */ }, []);

  return (
    <div className="container" style={{maxWidth: 900}}>
      <h1>Lotes disponibles</h1>
      <div style={{marginBottom:12}}>
        <input
          placeholder="ID medicamento (opcional)"
          value={medId}
          onChange={e=>setMedId(e.target.value)}
          style={{marginRight:8}}
        />
        <button onClick={load}>Buscar</button>
      </div>

      {err && <div style={{color:'crimson', marginBottom:12}}>{err}</div>}

      <table>
        <thead>
          <tr>
            <th>ID Lote</th>
            <th>ID Med.</th>
            <th>Medicamento</th>
            <th>Lote</th>
            <th>Vence</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.length > 0 ? (
            rows.map((r) => (
              <tr key={r.lote_id ?? `${r.medicamento_id}-${r.lote_codigo}-${r.vencimiento}`}>
                <td>{r.lote_id}</td>
                <td>{r.medicamento_id}</td>
                <td>{r.medicamento}</td>
                <td>{r.lote_codigo}</td>
                <td>{r.vencimiento}</td>
                <td>{r.stock_lote}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6} style={{textAlign:'center', color:'#777'}}>Sin resultados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
