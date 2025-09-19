


function Compras() {
  const [proveedor, setProveedor] = useState('');
  const [items, setItems] = useState([
    // { medicamento_id: 1, lote_codigo: "L123", vencimiento: "2026-01-01", cantidad: 10, costo_unit: 2.5 }
  ]);
  const [resp, setResp] = useState(null);

  function setItem(idx, key, val) {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [key]: val };
    setItems(copy);
  }

  function addItem() { setItems([...items, { medicamento_id: '', lote_codigo: '', vencimiento: '', cantidad: 1, costo_unit: 0 }]); }
  function delItem(i) { setItems(items.filter((_, idx) => idx !== i)); }

  async function crearCompra() {
    try {
      const payload = {
        proveedor,
        usuario_id: 1,
        items: items.map(i => ({
          medicamento_id: Number(i.medicamento_id),
          lote_codigo: i.lote_codigo,
          vencimiento: i.vencimiento,
          cantidad: Number(i.cantidad),
          costo_unit: Number(i.costo_unit),
        }))
      };
      const r = await api.compra(payload);
      setResp(r);
      alert('Compra registrada');
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h1>Nueva Compra</h1>
      <label>Proveedor: <input value={proveedor} onChange={e => setProveedor(e.target.value)} /></label>
      <div style={{marginTop: 12}}>
        {items.map((it, i) => (
          <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr auto', gap:8, marginBottom:8}}>
            <input placeholder="ID medicamento" value={it.medicamento_id} onChange={e => setItem(i,'medicamento_id', e.target.value)} />
            <input placeholder="Lote código" value={it.lote_codigo} onChange={e => setItem(i,'lote_codigo', e.target.value)} />
            <input placeholder="Vencimiento (YYYY-MM-DD)" value={it.vencimiento} onChange={e => setItem(i,'vencimiento', e.target.value)} />
            <input placeholder="Cantidad" type="number" value={it.cantidad} onChange={e => setItem(i,'cantidad', e.target.value)} />
            <input placeholder="Costo unit" type="number" value={it.costo_unit} onChange={e => setItem(i,'costo_unit', e.target.value)} />
            <button onClick={() => delItem(i)}>🗑</button>
          </div>
        ))}
        <button onClick={addItem}>+ Agregar ítem</button>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={crearCompra}>Registrar compra</button>
      </div>
      {resp && <pre>{JSON.stringify(resp,null,2)}</pre>}
    </div>
  );
}

export default Compras;
