import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://tienda-camisetas-retro.onrender.com/api';

// Diccionario de imágenes mapeadas por equipo
const imagenesCamisetas = {
  'Francia': 'https://futbolcamis.es/wp-content/uploads/2023/10/6f828320-scaled.jpeg',
  'Colo-Colo': 'https://acdn.mitiendanube.com/stores/002/011/196/products/camisa-retro-colo-colo-home-1995-41-af4a88648992aaaaa216505857202673-640-0.jpg',
  'Lazio': 'https://matchdaycr.com/cdn/shop/files/IMG-9749.jpg?v=1752506872&width=1445',
  'Leverkusen': 'https://static.wixstatic.com/media/b6658d_9ef0f61cffe144128785a46bd665d1d7~mv2.jpg/v1/fill/w_2000,h_3000,al_c,q_90,enc_avif,quality_auto/b6658d_9ef0f61cffe144128785a46bd665d1d7~mv2.jpg',
  'Liverpool': 'https://www.sportskompany.com/wp-content/uploads/2025/08/0da670ca.jpg',
  'Tottenham': 'https://static.wixstatic.com/media/435082_0b82f54957fa4938b4444fed022d7482~mv2.jpeg/v1/fill/w_3456,h_3456,al_c,q_90,enc_avif,quality_auto/435082_0b82f54957fa4938b4444fed022d7482~mv2.jpeg',
  'Barcelona': 'https://futbolcamis.es/wp-content/uploads/2023/09/32543de8-scaled.jpeg',
  'Argentina': 'https://lojamantodeclasse.com/cdn/shop/files/12_5161fe05-7b25-4597-a95c-ee6d675d777a.png?v=1760542668&width=1090',
  'Milan': 'https://futbolcamis.es/wp-content/uploads/2023/09/811b2233.jpeg',
  'Real Madrid': 'https://www.myretrojersey.com/wp-content/uploads/2022/09/a_8_c7bd1ef5-84a0-425f-982d-437bef41565e-600x600.jpg'
};

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [camisetas, setCamisetas] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados de interfaz y flujo
  const [paso, setPaso] = useState('bienvenida'); // 'bienvenida', 'tienda'
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', email: '' });
  const [nuevoPedido, setNuevoPedido] = useState({ camiseta_id: '', cantidad: 1, fecha: '' });
  const [vistaHistorial, setVistaHistorial] = useState(false);

  useEffect(() => {
    // Eliminar márgenes blancos por completo
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.backgroundColor = '#0f172a';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#0f172a';
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
      if (resClientes.data.length > 0 && !clienteSeleccionado) {
        setClienteSeleccionado(resClientes.data[0].id);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const handleEntrarConCliente = (e) => {
    e.preventDefault();
    if (!clienteSeleccionado) {
      alert('Por favor selecciona un usuario existente.');
      return;
    }
    setMostrarModalLogin(false);
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
        setMostrarModalLogin(false);
      }
    } catch (error) {
      console.error(error);
      alert('Error detallado: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCrearPedido = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/pedidos`, {
        cliente_id: clienteSeleccionado || (clientes[0] ? clientes[0].id : 1),
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

  const obtenerImagenCamiseta = (camiseta) => {
    if (camiseta.imagen) return camiseta.imagen;
    const nombreEquipo = camiseta.equipo || camiseta.nombre || '';
    for (const key in imagenesCamisetas) {
      if (nombreEquipo.toLowerCase().includes(key.toLowerCase())) {
        return imagenesCamisetas[key];
      }
    }
    return "https://images.unsplash.com/photo-1518063319789-7217d695c5d0?w=300&auto=format&fit=crop&q=80";
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%', color: '#f8fafc', padding: '20px', boxSizing: 'border-box', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* PANTALLA 1: BIENVENIDA */}
      {paso === 'bienvenida' && (
        <div style={{ maxWidth: '480px', margin: '100px auto', background: '#1e293b', padding: '40px 30px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>⚽</div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: '0 0 10px 0', fontWeight: '700' }}>TIENDA RETRO</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '30px', lineHeight: '1.5' }}>
            Bienvenido a la colección exclusiva de camisetas de fútbol retro.
          </p>
          <button 
            onClick={() => setPaso('tienda')}
            style={{ width: '100%', background: '#2563eb', color: '#ffffff', border: 'none', padding: '14px 20px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)' }}
          >
            Ingresar a la Tienda
          </button>
        </div>
      )}

      {/* PANTALLA 2: DASHBOARD Y CATÁLOGO DE LA TIENDA */}
      {paso === 'tienda' && (
        <div style={{ maxWidth: '100%', width: '100%', margin: '0 auto' }}>
          
          {/* BARRA SUPERIOR CON BOTONES ALINEADOS A LA DERECHA */}
          <nav style={{ 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px', 
            background: '#1e293b', 
            padding: '18px 24px', 
            borderRadius: '12px', 
            border: '1px solid #334155',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚽</span>
              <h1 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0, fontWeight: '700' }}>TIENDA DE CAMISETAS RETRO</h1>
            </div>
            
            {/* BOTONES ALINEADOS TOTALMENTE A LA ESQUINA DERECHA */}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button 
                onClick={() => setVistaHistorial(!vistaHistorial)}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {vistaHistorial ? 'Ver Catálogo' : 'Ver Historial'}
              </button>
              <button 
                onClick={() => setMostrarModalLogin(true)}
                style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Registrarse
              </button>
              <button 
                onClick={() => setPaso('bienvenida')}
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Salir
              </button>
            </div>
          </nav>

          {!vistaHistorial ? (
            <>
              {/* CATÁLOGO DE CAMISETAS */}
              <section style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '30px' }}>
                <h2 style={{ color: '#60a5fa', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px', fontSize: '1.3rem' }}>
                  Catálogo de Camisetas Retro
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                  {camisetas.map(c => (
                    <div key={c.id} style={{ border: '1px solid #334155', borderRadius: '10px', padding: '15px', background: '#0f172a', textAlign: 'center' }}>
                      <img 
                        src={obtenerImagenCamiseta(c)} 
                        alt={c.equipo || c.nombre} 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                      />
                      <h3 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '6px' }}>{c.equipo || c.nombre}</h3>
                      <p style={{ color: '#34d399', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>${c.precio}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* REALIZAR PEDIDO */}
              <section style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
                <h2 style={{ color: '#60a5fa', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px', fontSize: '1.3rem' }}>
                  Realizar Pedido
                </h2>
                <form onSubmit={handleCrearPedido} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#cbd5e1' }}>Selecciona Camiseta:</label>
                    <select 
                      value={nuevoPedido.camiseta_id} 
                      onChange={e => setNuevoPedido({...nuevoPedido, camiseta_id: e.target.value})}
                      required
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc' }}
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
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#cbd5e1' }}>Cantidad:</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={nuevoPedido.cantidad} 
                      onChange={e => setNuevoPedido({...nuevoPedido, cantidad: e.target.value})}
                      required
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#cbd5e1' }}>Fecha:</label>
                    <input 
                      type="date" 
                      value={nuevoPedido.fecha} 
                      onChange={e => setNuevoPedido({...nuevoPedido, fecha: e.target.value})}
                      required
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc' }}
                    />
                  </div>

                  <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Confirmar Pedido
                  </button>
                </form>
              </section>
            </>
          ) : (
            /* VISTA DE HISTORIAL */
            <section style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
              <h2 style={{ color: '#ffffff', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px', fontSize: '1.3rem' }}>
                Historial Completo de Ventas y Pedidos
              </h2>
              {pedidos.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No hay pedidos registrados todavía.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {pedidos.map(p => {
                    const clienteEncontrado = clientes.find(c => c.id == p.cliente_id);
                    const camisetaEncontrada = camisetas.find(c => c.id == p.camiseta_id);

                    return (
                      <li key={p.id} style={{ background: '#0f172a', border: '1px solid #334155', padding: '16px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#60a5fa' }}>Pedido #{p.id}</strong> — 
                          <strong style={{ color: '#f8fafc' }}> {clienteEncontrado ? clienteEncontrado.nombre : `Cliente ID: ${p.cliente_id}`}</strong> | 
                          <strong style={{ color: '#f8fafc' }}> {camisetaEncontrada ? (camisetaEncontrada.equipo || camisetaEncontrada.nombre) : `Camiseta ID: ${p.camiseta_id}`}</strong> | 
                          <span style={{ color: '#cbd5e1' }}> Cantidad: {p.cantidad}</span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                          Fecha: {p.fecha ? p.fecha.split('T')[0] : 'N/A'}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
        </div>
      )}

      {/* MODAL DE REGISTRO / CAMBIO DE USUARIO */}
      {mostrarModalLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ maxWidth: '480px', width: '90%', background: '#1e293b', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', color: '#ffffff', marginBottom: '20px' }}>Identifícate o Regístrate</h2>

            <form onSubmit={handleEntrarConCliente} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#cbd5e1' }}>Seleccionar Usuario Exisitente:</label>
              <select 
                value={clienteSeleccionado} 
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', marginBottom: '12px', backgroundColor: '#0f172a', color: '#f8fafc' }}
              >
                <option value="">-- Elige tu usuario --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>
                ))}
              </select>
              <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Seleccionar y Cerrar
              </button>
            </form>

            <hr style={{ border: '0', borderTop: '1px solid #334155', margin: '20px 0' }} />

            <form onSubmit={handleCrearCliente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontWeight: '600', color: '#cbd5e1' }}>¿Eres nuevo? Regístrate aquí:</label>
              <input 
                type="text" 
                placeholder="Nombre Completo" 
                value={nuevoCliente.nombre} 
                onChange={e => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                required
                style={{ padding: '11px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc' }}
              />
              <input 
                type="email" 
                placeholder="Correo Electrónico" 
                value={nuevoCliente.email} 
                onChange={e => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                required
                style={{ padding: '11px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc' }}
              />
              <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Crear Cuenta y Entrar
              </button>
            </form>

            <button 
              onClick={() => setMostrarModalLogin(false)}
              style={{ width: '100%', background: 'transparent', color: '#94a3b8', border: 'none', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}