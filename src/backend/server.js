import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
import { senha } from "../utils";
const { Pool } = pkg;

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: senha,
  port: 5432,
});

let orders = [];

app.get("/menu", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM lanchonete_db");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar o menu: ", error);
    res.status(500).json({ erro: "Erro ao buscar o menu" });
  }
});

const newOrder = {
  id: 1,
  code: "café",
  nameProduct: "Café",
  description: "Café fresco e aromático.",
  image:
    "https://github.com/JessicaDSL/desafio-jessica-lima/blob/main/src/assets/image/coffe.png?raw=true",
  value: 3,
};

app.post("/add-order", async (req, res) => {
  const newOrder = req.body;
  console.log(newOrder);
  try {
  await pool.query(
    'INSERT INTO orders (id, code, name_product, description, image, value_product, extra, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        newOrder.id,
        newOrder.code,
        newOrder.name_product,
        newOrder.description,
        newOrder.image,
        newOrder.value_product,
        newOrder.extra,
        newOrder.quantity
      ]
  )
  console.log("Novo pedido adicionado:", newOrder);
  res.json({ message: "Novo pedido adicionado com sucesso!" });
} catch (error) {
  console.error("Erro ao adicionar o pedido:", error);
  res.status(500).json({ error: "Erro ao adicionar o pedido" });
}
});

app.post('/update-cart-item/:productId', async (req, res) => {
  const productId = req.params.productId;
  const newQuantity = req.body.quantity;

  try {
    await pool.query(
      'UPDATE orders SET quantity = $1 WHERE id = $2',
      [newQuantity, productId]
    );
    res.json({ message: 'Quantidade atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar a quantidade do pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar a quantidade do pedido' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders');
    console.log('Aqui estao o get do orders: ', rows);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar os pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar os pedidos' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
