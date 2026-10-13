import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://tienda-camisetas-retro.onrender.com/api';

function App() {
  // Estados para listas
  const [clientes, setClientes] = useState([]);
  const [camisetas, setCamisetas] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados para formularios
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', email: '' });
  const [nuevoPedido, setNuevoPedido] = useState({ cliente_id: '', camiseta_id: '', cantidad: 1, fecha: '' });

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
      console.error('Error cargando datos:', error);
    }
  };

  // Crear Cliente
  const handleCrearCliente = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/clientes`, nuevoCliente);
      alert('Cliente registrado correctamente');
      setNuevoCliente({ nombre: '', email: '' });
      cargarDatos();
    } catch (error) {
      alert('Error al crear cliente: ' + (error.response?.data?.error || error.message));
    }
  };

  // Crear Pedido
  const handleCrearPedido = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/pedidos`, nuevoPedido);
      alert('¡Pedido registrado con éxito!');
      setNuevoPedido({ cliente_id: '', camiseta_id: '', cantidad: 1, fecha: '' });
      cargarDatos();
    } catch (error) {
      alert('Error al registrar pedido: ' + (error.response?.data?.error || error.message));
    }
  };

  // Obtener camiseta seleccionada actualmente para mostrar su precio fijo
  const camisetaSeleccionada = camisetas.find(c => c.id === parseInt(nuevoPedido.camiseta_id));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>⚽ Tienda de Camisetas Retro</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* FORMULARIO 1: Registrar Cliente */}
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2>1. Registrar Cliente</h2>
          <form onSubmit={handleCrearCliente}>
            <label style={{ fontWeight: 'bold' }}>Nombre Completo:</label>
            <input
              type="text"
              placeholder="Ej. Iker Casillas"
              value={nuevoCliente.nombre}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
              required
              style={{ display: 'block', width: '95%', marginBottom: '15px', padding: '8px', marginTop: '5px' }}
            />
            <label style={{ fontWeight: 'bold' }}>Correo Electrónico:</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={nuevoCliente.email}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
              required
              style={{ display: 'block', width: '95%', marginBottom: '15px', padding: '8px', marginTop: '5px' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Guardar Cliente
            </button>
          </form>
        </div>

        {/* FORMULARIO 2: Realizar Pedido seleccionando del Catálogo */}
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2>2. Realizar Pedido</h2>
          <form onSubmit={handleCrearPedido}>
            <label style={{ fontWeight: 'bold' }}>Seleccionar Cliente:</label>
            <select
              value={nuevoPedido.cliente_id}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, cliente_id: e.target.value })}
              required
              style={{ display: 'block', width: '98%', marginBottom: '15px', padding: '8px', marginTop: '5px' }}
            >
              <option value="">-- Escoja un Cliente --</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>
              ))}
            </select>

            <label style={{ fontWeight: 'bold' }}>Seleccionar Camiseta del Catálogo:</label>
            <select
              value={nuevoPedido.camiseta_id}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, camiseta_id: e.target.value })}
              required
              style={{ display: 'block', width: '98%', marginBottom: '15px', padding: '8px', marginTop: '5px' }}
            >
              <option value="">-- Escoja una Camiseta --</option>
              {camisetas.map(cam => (
                <option key={cam.id} value={cam.id}>
                  {cam.equipo} ({cam.temporada}) - Talla {cam.talla} | ${Number(cam.precio).toFixed(2)}
                </option>
              ))}
            </select>

            {/* Muestra el precio fijo informativo de la camiseta seleccionada */}
            {camisetaSeleccionada && (
              <div style={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px', marginBottom: '15px' }}>
                <strong>Precio Unitario (Fijo):</strong> ${Number(camisetaSeleccionada.precio).toFixed(2)}
              </div>
            )}

            <label style={{ fontWeight: 'bold' }}>Cantidad:</label>
            <input
              type="number"
              min="1"
              value={nuevoPedido.cantidad}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, cantidad: e.target.value })}
              required
              style={{ display: 'block', width: '95%', marginBottom: '15px', padding: '8px', marginTop: '5px' }}
            />

            <label style={{ fontWeight: 'bold' }}>Fecha del Pedido:</label>
            <input
              type="date"
              value={nuevoPedido.fecha}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, fecha: e.target.value })}
              required
              style={{ display: 'block', width: '95%', marginBottom: '15px', padding: '8px', marginTop: '5px' }}
            />

            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Confirmar Pedido
            </button>
          </form>
        </div>

      </div>

      {/* TABLA DE PEDIDOS */}
      <h2>Historial de Ventas y Pedidos</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textIndent: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#212121', color: 'white' }}>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Camiseta</th>
            <th>Talla</th>
            <th>Precio U.</th>
            <th>Cant.</th>
            <th>Total</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.cliente_nombre}</td>
              <td>{p.camiseta_equipo} ({p.camiseta_temporada})</td>
              <td>{p.camiseta_talla}</td>
              <td>${Number(p.precio_unitario).toFixed(2)}</td>
              <td>{p.cantidad}</td>
              <td><strong>${Number(p.total).toFixed(2)}</strong></td>
              <td>{p.fecha ? p.fecha.split('T')[0] : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
