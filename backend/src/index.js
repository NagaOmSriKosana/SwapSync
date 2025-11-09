const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const swapsRoutes = require('./routes/swaps');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api', swapsRoutes);

app.get('/', (req, res) => res.send('SlotSwapper API running '));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
