const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Get all events for current user
router.get('/', async (req, res) => {
  const events = await prisma.event.findMany({
    where: { ownerId: req.user.userId },
    orderBy: { startTime: 'asc' }
  });
  res.json(events);
});

// Create new event
router.post('/', async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  const event = await prisma.event.create({
    data: {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: status || 'BUSY',
      ownerId: req.user.userId
    }
  });
  res.status(201).json(event);
});

// Update event
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  if (existing.ownerId !== req.user.userId) return res.status(403).json({ error: 'Not authorized' });

  const { title, startTime, endTime, status } = req.body;
  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: title ?? existing.title,
      startTime: startTime ? new Date(startTime) : existing.startTime,
      endTime: endTime ? new Date(endTime) : existing.endTime,
      status: status ?? existing.status
    }
  });
  res.json(updated);
});

// Delete event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  if (existing.ownerId !== req.user.userId) return res.status(403).json({ error: 'Not authorized' });

  await prisma.event.delete({ where: { id } });
  res.json({ ok: true });
});

module.exports = router;
