const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API Tienda de Camisetas Retro activa ' });
});

// ==========================================
// RUTAS PARA CLIENTES
// ==========================================

// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear cliente
app.post('/api/clientes', async (req, res) => {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios.' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO clientes (nombre, email) VALUES (?, ?)',
            [nombre, email]
        );
        res.status(201).json({ id: result.insertId, nombre, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar cliente
app.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM clientes WHERE id = ?', [id]);
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// RUTAS PARA CAMISETAS
// ==========================================

// Obtener todas las camisetas
app.get('/api/camisetas', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM camisetas ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear camiseta
app.post('/api/camisetas', async (req, res) => {
    const { equipo, temporada, talla, precio } = req.body;
    if (!equipo || !temporada || !talla || !precio) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO camisetas (equipo, temporada, talla, precio) VALUES (?, ?, ?, ?)',
            [equipo, temporada, talla, precio]
        );
        res.status(201).json({ id: result.insertId, equipo, temporada, talla, precio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar camiseta
app.delete('/api/camisetas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM camisetas WHERE id = ?', [id]);
        res.json({ message: 'Camiseta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// RUTAS PARA PEDIDOS (CON INNER JOIN)
// ==========================================

// Obtener pedidos con información cruzada (INNER JOIN)
app.get('/api/pedidos', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id,
                p.cliente_id,
                p.camiseta_id,
                c.nombre AS cliente_nombre,
                c.email AS cliente_email,
                cam.equipo AS camiseta_equipo,
                cam.temporada AS camiseta_temporada,
                cam.talla AS camiseta_talla,
                cam.precio AS precio_unitario,
                p.cantidad,
                (p.cantidad * cam.precio) AS total,
                p.fecha
            FROM pedidos p
            INNER JOIN clientes c ON p.cliente_id = c.id
            INNER JOIN camisetas cam ON p.camiseta_id = cam.id
            ORDER BY p.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear pedido
app.post('/api/pedidos', async (req, res) => {
    const { cliente_id, camiseta_id, cantidad, fecha } = req.body;
    if (!cliente_id || !camiseta_id || !cantidad || !fecha) {
        return res.status(400).json({ error: 'Todos los campos del pedido son requeridos.' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO pedidos (cliente_id, camiseta_id, cantidad, fecha) VALUES (?, ?, ?, ?)',
            [cliente_id, camiseta_id, cantidad, fecha]
        );
        res.status(201).json({ id: result.insertId, cliente_id, camiseta_id, cantidad, fecha });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar pedido
app.delete('/api/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM pedidos WHERE id = ?', [id]);
        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});