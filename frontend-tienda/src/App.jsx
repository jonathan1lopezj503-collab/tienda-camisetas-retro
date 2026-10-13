import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://tienda-camisetas-retro.onrender.com/api';

export default function App() {
  // Estados para datos
  const [clientes, setClientes] = useState([]);
  const [camisetas, setCamisetas] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados para la sesión actual y formularios
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', email: '' });
  const [nuevoPedido, setNuevoPedido] = useState({ camiseta_id: '', cantidad: 1, fecha: '' });
  
  // Estado para alternar vistas (tienda vs historial)
  const [vistaHistorial, setVistaHistorial] = useState(false);

  // Cargar datos al iniciar
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

  // Registrar un nuevo cliente
  const handleCrearCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/clientes`, nuevoCliente);
      alert('¡Cliente registrado con éxito!');
      setNuevoCliente({ nombre: '', email: '' });
      cargarDatos();
      // Seleccionar automáticamente al cliente recién creado
      setClienteSeleccionado(res.data.id || clientes.length + 1);
    } catch (error) {
      alert('Error al registrar el cliente');
    }
  };

  // Crear un nuevo pedido
  const handleCrearPedido = async (e) => {
    e.preventDefault();
    if (!clienteSeleccionado) {
      alert('Por favor selecciona o crea un usuario primero.');
      return;
    }
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Barra de Navegación Superior */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1e293b', margin: 0 }}>⚽ Tienda de Camisetas Retro</h1>
        <button 
          onClick={() => setVistaHistorial(!vistaHistorial)}
          style={{ background: '#0f172a', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {vistaHistorial ? '🛍️ Volver a la Tienda' : '📋 Ver Historial de Compras'}
        </button>
      </nav>

      {!vistaHistorial ? (
        <>
          {/* PASO 1: Identificación / Selección de Usuario */}
          <section style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h2 style={{ color: '#2563eb', marginBottom: '15px' }}>1. Identifícate o Regístrate</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Seleccionar Usuario Existente:</label>
                <select 
                  value={clienteSeleccionado || ''} 
                  onChange={(e) => setClienteSeleccionado(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Elige tu usuario --</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <form onSubmit={handleCrearCliente} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontWeight: '600' }}>¿Nuevo usuario? Regístrate aquí:</label>
                  <input 
                    type="text" 
                    placeholder="Nombre Completo" 
                    value={nuevoCliente.nombre} 
                    onChange={e => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                    required
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <input 
                    type="email" 
                    placeholder="Correo Electrónico" 
                    value={nuevoCliente.email} 
                    onChange={e => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                    required
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Crear y Seleccionar Usuario
                  </button>
                </form>
              </div>
            </div>

            {clienteSeleccionado && (
              <div style={{ marginTop: '15px', padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontWeight: '600' }}>
                ✅ Usuario activo para la compra: {clientes.find(c => c.id == clienteSeleccionado)?.nombre}
              </div>
            )}
          </section>

          {/* PASO 2: Catálogo de Camisetas */}
          <section style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h2 style={{ color: '#2563eb', marginBottom: '15px' }}>2. Catálogo de Camisetas Retro</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
              {camisetas.map(c => (
                <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', background: '#f8fafc' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '8px' }}>{c.nombre}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>Equipo: {c.equipo}</p>
                  <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.1rem' }}>${c.precio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PASO 3: Realizar Pedido */}
          <section style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#2563eb', marginBottom: '15px' }}>3. Realizar Pedido</h2>
            <form onSubmit={handleCrearPedido} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Selecciona Camiseta:</label>
                <select 
                  value={nuevoPedido.camiseta_id} 
                  onChange={e => setNuevoPedido({...nuevoPedido, camiseta_id: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Elige una camiseta --</option>
                  {camisetas.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} - ${c.precio}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Cantidad:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={nuevoPedido.cantidad} 
                  onChange={e => setNuevoPedido({...nuevoPedido, cantidad: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Fecha:</label>
                <input 
                  type="date" 
                  value={nuevoPedido.fecha} 
                  onChange={e => setNuevoPedido({...nuevoPedido, fecha: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Confirmar Pedido
              </button>
            </form>
          </section>
        </>
      ) : (
        /* PASO 4: Vista de Historial de Ventas Independiente */
        <section style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>📋 Historial Completo de Ventas y Pedidos</h2>
          {pedidos.length === 0 ? (
            <p style={{ color: '#64748b' }}>No hay pedidos registrados todavía.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pedidos.map(p => (
                <li key={p.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Pedido #{p.id}</strong> — Cliente ID: {p.cliente_id} | Camiseta ID: {p.camiseta_id} | Cantidad: {p.cantidad}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Fecha: {p.fecha ? p.fecha.split('T')[0] : 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

    </div>
  );
}