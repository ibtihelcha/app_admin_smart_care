// import { useState, useEffect } from 'react';

// import Card from '@mui/material/Card';
// import Alert from '@mui/material/Alert';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import CardContent from '@mui/material/CardContent';

// import { useAuth } from 'src/auth';
// import { CONFIG } from 'src/config-global';
// import { DashboardContent } from 'src/layouts/dashboard';

// export default function ProfilePage() {
//   const { profile, user, updateAdminProfile, updateOwnCredentials } = useAuth();
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setphone] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     setFirstName(String(profile?.firstName ?? ''));
//     setLastName(String(profile?.lastName ?? ''));
//     setphone(String(profile?.phone ?? ''));
//     setEmail(String(user?.email ?? profile?.email ?? ''));
//   }, [profile, user]);

//   const saveProfile = async () => {
//     try {
//       setMessage('');
//       setError('');
//       await updateAdminProfile({
//         firstName,
//         lastName,
//         phone,
//         email,
//         updatedAt: new Date().toISOString(),
//       });
//       await updateOwnCredentials(email, password || undefined);
//       setMessage('Profil admin mis a jour avec succes.');
//       setPassword('');
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : 'Impossible de mettre a jour le profil. Verifiez la session recente pour changer le mot de passe.'
//       );
//     }
//   };

//   return (
//     <>
//       <title>{`Profile - ${CONFIG.appName}`}</title>
//       <DashboardContent>
//         <Typography variant="h4" mb={3}>
//           Profil administrateur
//         </Typography>
//         <Card>
//           <CardContent>
//             <Stack spacing={2}>
//               {message && <Alert severity="success">{message}</Alert>}
//               {error && <Alert severity="error">{error}</Alert>}
//               <TextField label="Prenom" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
//               <TextField label="Nom" value={lastName} onChange={(event) => setLastName(event.target.value)} />
//               <TextField
//                 label="Telephone"
//                 value={phone}
//                 onChange={(event) => setphone(event.target.value)}
//               />
//               <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
//               <TextField
//                 label="Nouveau mot de passe"
//                 type="password"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//               />
//               <Button variant="contained" onClick={saveProfile}>
//                 Enregistrer
//               </Button>
//             </Stack>
//           </CardContent>
//         </Card>
//       </DashboardContent>
//     </>
//   );
// }



import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAuth } from 'src/auth';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  const { profile, user, updateAdminProfile, updateOwnCredentials } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setphone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(String(profile?.firstName ?? ''));
    setLastName(String(profile?.lastName ?? ''));
    setphone(String(profile?.phone ?? ''));
    setEmail(String(user?.email ?? profile?.email ?? ''));
  }, [profile, user]);

  const saveProfile = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      await updateAdminProfile({
        firstName,
        lastName,
        phone,
        email,
        updatedAt: new Date().toISOString(),
      });

      await updateOwnCredentials(email, password || undefined);

      setMessage('Profil mis à jour avec succès.');
      setPassword('');
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Erreur mise à jour profil'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>{`Profile - ${CONFIG.appName}`}</title>

      <DashboardContent>
        {/* HEADER PREMIUM */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            👨‍💼 Profil Administrateur
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Gestion sécurisée du compte admin
          </Typography>
        </Paper>

        {/* ALERTS */}
        <Stack spacing={2} mb={2}>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>

        {/* MAIN CARD */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight="bold">
              Informations personnelles
            </Typography>

            <Grid container spacing={2}>
<Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                  fullWidth
                  label="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>

<Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                  fullWidth
                  label="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>

<Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                  fullWidth
                  label="Téléphone"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                />
              </Grid>

<Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* SECURITY SECTION */}
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Sécurité
              </Typography>

              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            {/* ACTION BUTTON */}
            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                size="large"
                onClick={saveProfile}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </DashboardContent>
    </>
  );
}