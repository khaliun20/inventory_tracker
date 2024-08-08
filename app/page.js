'use client'
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Typography, Stack, TextField } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

const headerStyle = {
  bgcolor: '#1976d2',
  color: '#fff',
  p: 2,
  borderRadius: '4px 4px 0 0',
};

const inputStyle = {
  borderRadius: 4,
  borderColor: '#1976d2',
};

const buttonStyle = {
  bgcolor: '#1976d2',
  color: '#fff',
  '&:hover': {
    bgcolor: '#155a9c',
  },
  borderRadius: 4,
};

const itemBoxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  bgcolor: '#f0f0f0',
  padding: '16px 24px',
  borderRadius: 4,
  boxShadow: 2,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
};

export default function Home() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openFindModal, setOpenFindModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [inventory, setInventory] = useState([]);
  const [findResult, setFindResult] = useState(null);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleOpenFindModal = () => setOpenFindModal(true);
  const handleCloseFindModal = () => {
    setFindResult(null);
    setItemName(''); // Clear the itemName when closing the modal
    setOpenFindModal(false);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const lowerCaseItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'inventory'), lowerCaseItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const findItem = async (item) => {
    const lowerCaseItem = item.toLowerCase();
    const displayName = item.toUpperCase();
    const docRef = doc(collection(firestore, 'inventory'), lowerCaseItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      setFindResult({ name: displayName, quantity });
    } else {
      setFindResult('Item not found');
    }
  };

  const removeItem = async (item) => {
    const lowerCaseItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'inventory'), lowerCaseItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor="#f5f5f5"
      p = {2}
    >
      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={headerStyle}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2} mt={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{ style: inputStyle }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleCloseAddModal();
              }}
              sx={buttonStyle}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpenAddModal} sx={buttonStyle}>
        Add New Item
      </Button>

      <Modal
        open={openFindModal}
        onClose={handleCloseFindModal}
        aria-labelledby="modal-find-title"
        aria-describedby="modal-find-description"
      >
        <Box sx={style}>
          <Typography id="modal-find-title" variant="h6" component="h2" sx={headerStyle}>
            Find Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2} mt={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{ style: inputStyle }}
            />
            <Button
              variant="contained"
              onClick={() => {
                findItem(itemName);
      
              }
               
              }
              
              sx={buttonStyle}
            >
              Find
            </Button>
          </Stack>
          {findResult && (
            typeof findResult === 'string' ? (
              <Typography variant="body1" mt={2}>{findResult}</Typography>
            ) : (
              <Typography variant="body1" mt={2}>
                {`Name: ${findResult.name}, Quantity: ${findResult.quantity}`}
              </Typography>
            )
          )}
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpenFindModal} sx={buttonStyle}>
        Find Item
      </Button>

      <Box border={'1px solid #333'} borderRadius={4} mt={4}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#1976d2'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius="4px 4px 0 0"
        >
          <Typography variant={'h2'} color={'#fff'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'} p={2} bgcolor={'#fff'}>
          {inventory.map(({ name, quantity }) => (
            <Box
            sx={itemBoxStyle}
              key={name}
              width="100%"
              minHeight="100px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#1976d2'}
              padding={2}
              borderRadius="4px 4px 0 0"
              boxShadow={2}
              mb={2}
            >
              <Typography variant={'h5'} color={'#333'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h6'} color={'#333'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)} sx={buttonStyle}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
