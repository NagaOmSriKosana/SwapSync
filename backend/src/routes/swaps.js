const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET swappable slots
router.get('/swappable-slots', async (req, res) => {
  const slots = await prisma.event.findMany({
    where: {
      status: 'SWAPPABLE',
      NOT: { ownerId: req.user.userId }
    },
    include: { owner: { select: { id: true, name: true, email: true } } },
    orderBy: { startTime: 'asc' }
  });
  res.json(slots);
});

// POST swap-request
router.post('/swap-request', async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ error: 'Missing slot ids' });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const mySlot = await tx.event.findUnique({ where: { id: mySlotId } });
      const theirSlot = await tx.event.findUnique({ where: { id: theirSlotId } });

      if (!mySlot || !theirSlot) throw { status: 404, message: 'Slot not found' };
      if (mySlot.ownerId !== req.user.userId) throw { status: 403, message: 'Not your slot' };
      if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE')
        throw { status: 409, message: 'Slots not swappable' };

      await tx.event.updateMany({
        where: { id: { in: [mySlotId, theirSlotId] }, status: 'SWAPPABLE' },
        data: { status: 'SWAP_PENDING' }
      });

      const swap = await tx.swapRequest.create({
        data: {
          requesterId: req.user.userId,
          responderId: theirSlot.ownerId,
          mySlotId,
          theirSlotId
        }
      });

      return swap;
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Internal error' });
  }
});

// GET swap-requests
router.get('/swap-requests', async (req, res) => {
  const incoming = await prisma.swapRequest.findMany({
    where: { responderId: req.user.userId },
    orderBy: { createdAt: 'desc' }
  });
  const outgoing = await prisma.swapRequest.findMany({
    where: { requesterId: req.user.userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ incoming, outgoing });
});

// POST swap-response/:requestId
router.post('/swap-response/:id', async (req, res) => {
  const { id } = req.params;
  const { accept } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.swapRequest.findUnique({ where: { id } });
      if (!request) throw { status: 404, message: 'Request not found' };
      if (request.responderId !== req.user.userId) throw { status: 403, message: 'Not authorized' };
      if (request.status !== 'PENDING') throw { status: 409, message: 'Already handled' };

      const mySlot = await tx.event.findUnique({ where: { id: request.mySlotId } });
      const theirSlot = await tx.event.findUnique({ where: { id: request.theirSlotId } });

      if (!accept) {
        await tx.swapRequest.update({ where: { id }, data: { status: 'REJECTED' } });
        await tx.event.updateMany({
          where: { id: { in: [mySlot.id, theirSlot.id] } },
          data: { status: 'SWAPPABLE' }
        });
        return { status: 'REJECTED' };
      }

      await tx.event.update({ where: { id: mySlot.id }, data: { ownerId: theirSlot.ownerId, status: 'BUSY' } });
      await tx.event.update({ where: { id: theirSlot.id }, data: { ownerId: mySlot.ownerId, status: 'BUSY' } });

      await tx.swapRequest.update({ where: { id }, data: { status: 'ACCEPTED' } });
      return { status: 'ACCEPTED' };
    });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Internal error' });
  }
});

module.exports = router;
