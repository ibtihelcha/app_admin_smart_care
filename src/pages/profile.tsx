import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAuth } from 'src/auth';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

export default function ProfilePage() {
  const { profile, user, updateAdminProfile, updateOwnCredentials } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFirstName(String(profile?.firstName ?? ''));
    setLastName(String(profile?.lastName ?? ''));
    setPhoneNumber(String(profile?.phoneNumber ?? ''));
    setEmail(String(user?.email ?? profile?.email ?? ''));
  }, [profile, user]);

  const saveProfile = async () => {
    try {
      setMessage('');
      setError('');
      await updateAdminProfile({
        firstName,
        lastName,
        phoneNumber,
        email,
        updatedAt: new Date().toISOString(),
      });
      await updateOwnCredentials(email, password || undefined);
      setMessage('Profil admin mis a jour avec succes.');
      setPassword('');
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Impossible de mettre a jour le profil. Verifiez la session recente pour changer le mot de passe.'
      );
    }
  };

  return (
    <>
      <title>{`Profile - ${CONFIG.appName}`}</title>
      <DashboardContent>
        <Typography variant="h4" mb={3}>
          Profil administrateur
        </Typography>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {message && <Alert severity="success">{message}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <TextField label="Prenom" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              <TextField label="Nom" value={lastName} onChange={(event) => setLastName(event.target.value)} />
              <TextField
                label="Telephone"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
              <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <TextField
                label="Nouveau mot de passe"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button variant="contained" onClick={saveProfile}>
                Enregistrer
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </DashboardContent>
    </>
  );
}
