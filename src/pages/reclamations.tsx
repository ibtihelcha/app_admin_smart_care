import { useState, useEffect } from 'react';
import {
  doc,
  getDocs,
  updateDoc,
  collection,
} from 'firebase/firestore';

import {
  Box,
  Card,
  Chip,
  Alert,
  Stack,
  Table,
  Paper,
  Button,
  Dialog,
  Select,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  FormControl,
  TableContainer,
} from '@mui/material';

import { db } from 'src/lib/firebase';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

const STATUS_OPTIONS = ['pending', 'in progress', 'resolved', 'rejected'];

export default function ReclamationsPage() {
  const [reclamations, setReclamations] = useState<Record<string, any>[]>([]);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState('');

  // LOAD
  const loadReclamations = async () => {
    try {
      setError('');
      const snapshot = await getDocs(collection(db, 'reclamations'));
      const rows = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReclamations(rows);
    } catch (e) {
      setError('Erreur chargement réclamations');
    }
  };

  useEffect(() => {
    loadReclamations();
  }, []);

  // UPDATE STATUS
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'reclamations', id), {
        status,
        updatedAt: new Date().toISOString(),
      });

      setReclamations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    } catch {
      setError('Erreur mise à jour status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'in progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <title>{`Reclamations - ${CONFIG.appName}`}</title>

      <DashboardContent>
        {/* HEADER */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            📩 Gestion des Réclamations
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Suivi et traitement des demandes utilisateurs
          </Typography>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        {/* TABLE */}
        <Card sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Sujet</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reclamations.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* USER INFO */}
                    <TableCell>
                      <Box>
                       
                        <Typography variant="caption" color="text.secondary">
                          {item.email ?? '-'}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {item.phone ?? '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* MESSAGE */}
                    <TableCell>
                      {item.message ?? '-'}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Chip
                        label={item.status ?? 'pending'}
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    </TableCell>

                    {/* ACTION */}
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelected(item)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* POPUP DETAILS */}
        <Dialog
          open={Boolean(selected)}
          onClose={() => setSelected(null)}
          fullWidth
          maxWidth="sm"
        >
          <Box p={3}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              📄 Détails Réclamation
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {selected && (
              <Stack spacing={2}>
               

                <Box>
                  <Typography fontWeight="bold">Email</Typography>
                  <Typography>{selected.email ?? '-'}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight="bold">Téléphone</Typography>
                  <Typography>{selected.phone ?? '-'}</Typography>
                </Box>

                <Box>
                  <Typography fontWeight="bold">Message</Typography>
                  <Typography>{selected.message ?? '-'}</Typography>
                </Box>

                {/* STATUS CHANGE */}
                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Statut
                  </Typography>

                  <FormControl fullWidth>
                    <Select
                      value={selected.status || 'pending'}
                      onChange={(e) =>
                        updateStatus(selected.id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => setSelected(null)}
                  sx={{ mt: 2 }}
                >
                  Fermer
                </Button>
              </Stack>
            )}
          </Box>
        </Dialog>
      </DashboardContent>
    </>
  );
}