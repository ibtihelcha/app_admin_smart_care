import { useState, useEffect } from 'react';
import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';

import { db } from 'src/lib/firebase';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

const STATUS_OPTIONS = ['pending', 'in progress', 'resolved', 'rejected'];

export default function ReclamationsPage() {
  const [reclamations, setReclamations] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState('');

  const loadReclamations = async () => {
    try {
      setError('');
      const snapshot = await getDocs(collection(db, 'reclamations'));
      setReclamations(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement reclamations.');
    }
  };

  useEffect(() => {
    loadReclamations();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'reclamations', id), { status, updatedAt: new Date().toISOString() });
      setReclamations((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Mise a jour statut impossible.');
    }
  };

  return (
    <>
      <title>{`Reclamations - ${CONFIG.appName}`}</title>
      <DashboardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Gestion des reclamations</Typography>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>ID</TableCell>
                  <TableCell>User ID</TableCell> */}
                  <TableCell>Sujet</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reclamations.map((item) => (
                  <TableRow key={String(item.id)}>
                    {/* <TableCell>{String(item.id)}</TableCell>
                    <TableCell>{String(item.userId ?? '-')}</TableCell> */}
                    <TableCell>{String(item.message ?? '-')}</TableCell>
                    <TableCell>{String(item.status ?? '-')}</TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={String(item.status ?? 'pending')}
                          onChange={(event) => updateStatus(String(item.id), event.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </DashboardContent>
    </>
  );
}
