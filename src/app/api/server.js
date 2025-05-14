import express, { json } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import session from 'express-session';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(json());
app.use(session({
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Contacts API routes
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const { name, address, pin, phone } = req.body;
    
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create contacts' });
    }
    
    const newContact = await prisma.contact.create({
      data: {
        name,
        address,
        pin,
        phone,
        userId: req.user.id,
      },
    });
    
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, pin, phone } = req.body;
    
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can update contacts' });
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { name, address, pin, phone },
    });
    
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can delete contacts' });
    }
    
    await prisma.contact.delete({
      where: { id },
    });
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// User role update
app.put('/api/users/role', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['ADMIN', 'GUEST'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { role },
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});