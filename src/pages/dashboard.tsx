import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { db } from 'src/lib/firebase';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Page() {
  const [usersCount, setUsersCount] = useState(0);
  const [reclamationsCount, setReclamationsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const recSnap = await getDocs(collection(db, 'reclamations'));
      setUsersCount(usersSnap.size);
      setReclamationsCount(recSnap.size);
      setPendingCount(recSnap.docs.filter((d) => d.data().status === 'pending').length);
    };
    load();
  }, []);

  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>
      <DashboardContent>
        <Typography variant="h4" mb={3}>
          SmartCare Admin Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Total utilisateurs</Typography>
                <Typography variant="h4">{usersCount}</Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Total reclamations</Typography>
                <Typography variant="h4">{reclamationsCount}</Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Reclamations en attente</Typography>
                <Typography variant="h4">{pendingCount}</Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
