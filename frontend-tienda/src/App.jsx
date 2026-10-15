import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://tienda-camisetas-retro.onrender.com/api';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [camisetas, setCamisetas] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados de sesión y formularios
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', email: '' });
  const [nuevoPedido, setNuevoPedido] = useState({ camiseta_id: '', cantidad: 1, fecha: '' });
  
  const [vistaHistorial, setVistaHistorial] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resClientes, resCamisetas, resPedidos] = await Promise.all([
        axios.get(`${API_URL}/clientes`),
        axios.get(`${API_URL}/camisetas`),
        axios.get(`${API_URL}/pedidos`)
      ]);
      setClientes(resClientes.data);
      setCamisetas(resCamisetas.data);
      setPedidos(resPedidos.data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/clientes`, nuevoCliente);
      alert('¡Cliente registrado con éxito!');
      setNuevoCliente({ nombre: '', email: '' });
      await cargarDatos();
      if (res.data.id) {
        setClienteSeleccionado(res.data.id);
        setUsuarioLogueado(true);
      }
    } catch (error) {
      console.error(error);
      alert('Error detallado: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEntrarTienda = (e) => {
    e.preventDefault();
    if (!clienteSeleccionado) {
      alert('Por favor selecciona un usuario existente.');
      return;
    }
    setUsuarioLogueado(true);
  };

  const handleCrearPedido = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/pedidos`, {
        cliente_id: clienteSeleccionado,
        camiseta_id: nuevoPedido.camiseta_id,
        cantidad: nuevoPedido.cantidad,
        fecha: nuevoPedido.fecha
      });
      alert('¡Pedido realizado con éxito!');
      setNuevoPedido({ camiseta_id: '', cantidad: 1, fecha: '' });
      cargarDatos();
    } catch (error) {
      alert('Error al realizar el pedido');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#e2e8f0', minHeight: '100vh' }}>
      
      {/* PANTALLA 1: INICIO DE SESIÓN / REGISTRO */}
      {!usuarioLogueado ? (
        <div style={{ maxWidth: '500px', margin: '80px auto', background: '#ffffff', padding: '30px', borderRadius: '14px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)', borderTop: '6px solid #1e3a8a' }}>
          <h1 style={{ textAlign: 'center', fontSize: '1.8rem', color: '#0f172a', marginBottom: '10px' }}>⚽ Tienda Retro</h1>
          <p style={{ textAlign: 'center', color: '#475569', marginBottom: '25px' }}>Identifícate para entrar a la tienda</p>

          <form onSubmit={handleEntrarTienda} style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Seleccionar Usuario:</label>
            <select 
              value={clienteSeleccionado || ''} 
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', marginBottom: '12px', backgroundColor: '#f8fafc' }}
            >
              <option value="">-- Elige tu usuario --</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>
              ))}
            </select>
            <button type="submit" style={{ width: '100%', background: '#1e3a8a', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
              Entrar a la Tienda
            </button>
          </form>

          <hr style={{ border: '0', borderTop: '1px solid #cbd5e1', margin: '25px 0' }} />

          <form onSubmit={handleCrearCliente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontWeight: '600', color: '#1e293b' }}>¿Eres nuevo? Regístrate:</label>
            <input 
              type="text" 
              placeholder="Nombre Completo" 
              value={nuevoCliente.nombre} 
              onChange={e => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
              required
              style={{ padding: '11px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f8fafc' }}
            />
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              value={nuevoCliente.email} 
              onChange={e => setNuevoCliente({...nuevoCliente, email: e.target.value})}
              required
              style={{ padding: '11px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f8fafc' }}
            />
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Crear Cuenta y Entrar
            </button>
          </form>
        </div>
      ) : (
        /* PANTALLA 2: LA TIENDA COMPLETA */
        <>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#1e293b', padding: '18px 24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>⚽ Tienda de Camisetas Retro</h1>
              <span style={{ fontSize: '0.9rem', color: '#93c5fd', fontWeight: '600' }}>
                Conectado como: {clientes.find(c => c.id == clienteSeleccionado)?.nombre}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setVistaHistorial(!vistaHistorial)}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {vistaHistorial ? '🛍️ Ver Catálogo' : '📋 Ver Historial'}
              </button>
              <button 
                onClick={() => setUsuarioLogueado(false)}
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cerrar Sesión
              </button>
            </div>
          </nav>

          {!vistaHistorial ? (
            <>
              {/* Catálogo de Camisetas */}
              <section style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(15, 23, 42, 0.05)', marginBottom: '30px' }}>
                <h2 style={{ color: '#1e3a8a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Catálogo de Camisetas Retro</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                  {camisetas.map(c => (
                    <div key={c.id} style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '15px', background: '#f8fafc', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <img 
                        src={c.imagen || "https://images.unsplash.com/photo-1518063319789-7217d695c5d0?w=300&auto=format&fit=crop&q=80"} 
                        alt="Camiseta" 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                      />
                      <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '5px' }}>{c.equipo || c.nombre}</h3>
                      <p style={{ color: '#1e3a8a', fontWeight: 'bold', fontSize: '1.1rem' }}>${c.precio}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Formulario de Pedido */}
              <section style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(15, 23, 42, 0.05)' }}>
                <h2 style={{ color: '#1e3a8a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Realizar Pedido</h2>
                <form onSubmit={handleCrearPedido} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#1e293b' }}>Selecciona Camiseta:</label>
                    <select 
                      value={nuevoPedido.camiseta_id} 
                      onChange={e => setNuevoPedido({...nuevoPedido, camiseta_id: e.target.value})}
                      required
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f8fafc' }}
                    >
                      <option value="">-- Elige una camiseta --</option>
                      {camisetas.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.equipo || c.nombre || "Camiseta Retro"} - ${c.precio}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#1e293b' }}>Cantidad:</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={nuevoPedido.cantidad} 
                      onChange={e => setNuevoPedido({...nuevoPedido, cantidad: e.target.value})}
                      required
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#1e293b' }}>Fecha:</label>
                    <input 
                      type="date" 
                      value={nuevoPedido.fecha} 
                      onChange={e => setNuevoPedido({...nuevoPedido, fecha: e.target.value})}
                      required
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f8fafc' }}
                    />
                  </div>

                  <button type="submit" style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Confirmar Pedido
                  </button>
                </form>
              </section>
            </>
          ) : (
            /* Vista Historial de Compras */
            <section style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(15, 23, 42, 0.05)' }}>
              <h2 style={{ color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>📋 Historial Completo de Ventas y Pedidos</h2>
              {pedidos.length === 0 ? (
                <p style={{ color: '#64748b' }}>No hay pedidos registrados todavía.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {pedidos.map(p => {
                    const clienteEncontrado = clientes.find(c => c.id == p.cliente_id);
                    const camisetaEncontrada = camisetas.find(c => c.id == p.camiseta_id);

                    return (
                      <li key={p.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>Pedido #{p.id}</strong> — 
                          👤 <strong>{clienteEncontrado ? clienteEncontrado.nombre : `Cliente ID: ${p.cliente_id}`}</strong> | 
                          👕 <strong>{camisetaEncontrada ? (camisetaEncontrada.equipo || camisetaEncontrada.nombre) : `Camiseta ID: ${p.camiseta_id}`}</strong> | 
                          Cantidad: {p.cantidad}
                        </div>
                        <div style={{ color: '#475569', fontSize: '0.9rem' }}>
                          Fecha: {p.fecha ? p.fecha.split('T')[0] : 'N/A'}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
        </>
      )}

    </div>
  );
}