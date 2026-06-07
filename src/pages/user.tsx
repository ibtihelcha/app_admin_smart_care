// import { useMemo, useState } from 'react';
// import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Alert from '@mui/material/Alert';
// import Stack from '@mui/material/Stack';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import TableRow from '@mui/material/TableRow';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import CardContent from '@mui/material/CardContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import TableContainer from '@mui/material/TableContainer';

// import { db } from 'src/lib/firebase';
// import { CONFIG } from 'src/config-global';
// import { DashboardContent } from 'src/layouts/dashboard';

// // ----------------------------------------------------------------------

// export default function Page() {
//   const [users, setUsers] = useState<Record<string, unknown>[]>([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const snapshot = await getDocs(collection(db, 'users'));
//       const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
//       setUsers(rows);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Erreur lors du chargement des users.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredUsers = useMemo(() => {
//     const input = query.trim().toLowerCase();
//     if (!input) return users;
//     return users.filter((row) => {
//       const emailValue = String(row.email ?? '').toLowerCase();
//       const phoneValue = String(row.phoneNumber ?? '').toLowerCase();
//       return emailValue.includes(input) || phoneValue.includes(input);
//     });
//   }, [query, users]);

//   const openEdit = (row: Record<string, unknown>) => {
//     setSelectedUser(row);
//     setEmail(String(row.email ?? ''));
//     setPhoneNumber(String(row.phoneNumber ?? ''));
//     setPassword('');
//   };

//   const saveEdit = async () => {
//     if (!selectedUser?.id) return;
//     try {
//       await updateDoc(doc(db, 'users', String(selectedUser.id)), {
//         email,
//         phoneNumber,
//         updatedAt: new Date().toISOString(),
//       });
//       await loadUsers();
//       setSelectedUser(null);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Mise a jour user impossible.');
//     }
//   };

//   return (
//     <>
//       <title>{`Users - ${CONFIG.appName}`}</title>
//       <DashboardContent>
//         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h4">Gestion des utilisateurs</Typography>
//           <Button variant="contained" onClick={loadUsers} disabled={loading}>
//             {loading ? 'Chargement...' : 'Charger les users'}
//           </Button>
//         </Stack>

//         <Card sx={{ mb: 3 }}>
//           <CardContent>
//             <TextField
//               fullWidth
//               label="Recherche par email ou telephone"
//               value={query}
//               onChange={(event) => setQuery(event.target.value)}
//             />
//           </CardContent>
//         </Card>

//         {error && <Alert severity="error">{error}</Alert>}

//         <Card>
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>UID</TableCell>
//                   <TableCell>Nom</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Telephone</TableCell>
//                   <TableCell>Role</TableCell>
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredUsers.map((row) => (
//                   <TableRow key={String(row.id)}>
//                     <TableCell>{String(row.id)}</TableCell>
//                     <TableCell>{`${String(row.firstName ?? '')} ${String(row.lastName ?? '')}`}</TableCell>
//                     <TableCell>{String(row.email ?? '-')}</TableCell>
//                     <TableCell>{String(row.phoneNumber ?? '-')}</TableCell>
//                     <TableCell>{String(row.role ?? '-')}</TableCell>
//                     <TableCell align="right">
//                       <Button size="small" onClick={() => openEdit(row)}>
//                         Modifier
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Card>

//         <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} fullWidth maxWidth="sm">
//           <DialogTitle>Modifier un utilisateur</DialogTitle>
//           <DialogContent>
//             <Box mt={1} display="grid" gap={2}>
//               <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
//               <TextField
//                 label="Telephone"
//                 value={phoneNumber}
//                 onChange={(event) => setPhoneNumber(event.target.value)}
//               />
//               <TextField
//                 label="Nouveau mot de passe (Auth)"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 helperText="La mise a jour du mot de passe/email Auth d'un autre user doit etre faite via Cloud Function admin securisee."
//               />
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setSelectedUser(null)}>Annuler</Button>
//             <Button variant="contained" onClick={saveEdit}>
//               Enregistrer
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </DashboardContent>
//     </>
//   );
// }

import { useMemo, useState, useEffect } from 'react';
import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { db } from 'src/lib/firebase';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Page() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);

  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  // 🔥 AUTO LOAD USERS
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setError('');
      const snapshot = await getDocs(collection(db, 'users'));
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      setUsers(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement users');
    }
  };

  const filteredUsers = useMemo(() => {
    const input = query.trim().toLowerCase();
    if (!input) return users;

    return users.filter((row) => {
      const emailValue = String(row.email ?? '').toLowerCase();
      const phoneValue = String(row.phone ?? '').toLowerCase();
      return emailValue.includes(input) || phoneValue.includes(input);
    });
  }, [query, users]);

  const openEdit = (row: Record<string, unknown>) => {
    setSelectedUser(row);
    setEmail(String(row.email ?? ''));
    setPhoneNumber(String(row.phone ?? ''));
    setPassword('');
  };

  const saveEdit = async () => {
    if (!selectedUser?.id) return;

    try {
      await updateDoc(doc(db, 'users', String(selectedUser.id)), {
        email,
        phone,
        updatedAt: new Date().toISOString(),
      });

      await loadUsers();
      setSelectedUser(null);
    } catch (e) {
      setError('Erreur mise à jour user');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'doctor':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <title>{`Users - ${CONFIG.appName}`}</title>

      <DashboardContent>
        {/* HEADER */}
        <Stack mb={3}>
          <Typography variant="h4" fontWeight="bold">
            👥 Gestion des utilisateurs
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Liste complète des utilisateurs enregistrés
          </Typography>
        </Stack>

        {/* SEARCH */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              label="Rechercher par email ou téléphone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </CardContent>
        </Card>

        {error && <Alert severity="error">{error}</Alert>}

        {/* TABLE */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUsers.map((row) => (
                  <TableRow
                    key={String(row.id)}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: '#fafafa' },
                    }}
                  >
                    {/* USER */}
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          {String(row.firstName ?? 'U')[0]}
                        </Avatar>

                        <Box>
                          <Typography fontWeight="bold">
                            {`${String(row.firstName ?? '')} ${String(row.lastName ?? '')}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {String(row.id)}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{String(row.email ?? '-')}</TableCell>
                    <TableCell>{String(row.phone ?? '-')}</TableCell>

                    <TableCell>
                      <Chip
                        label={String(row.role ?? 'user')}
                        color={getRoleColor(String(row.role ?? 'user'))}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openEdit(row)}
                      >
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* EDIT DIALOG */}
        <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} fullWidth>
          <DialogTitle>Modifier utilisateur</DialogTitle>

          <DialogContent>
            <Box display="grid" gap={2} mt={1}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Téléphone"
                value={phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <TextField
                label="Mot de passe (info)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Modification via Firebase Auth uniquement"
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setSelectedUser(null)}>Annuler</Button>
            <Button variant="contained" onClick={saveEdit}>
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardContent>
    </>
  );
}