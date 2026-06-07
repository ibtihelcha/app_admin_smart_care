

import { useMemo, useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import {
  Pie,
  Line,
  Cell,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  PieChart,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { Box, Card, Grid, Typography } from '@mui/material';

import { db } from 'src/lib/firebase';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// --------------------------------------------------

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

// SAFE DATE FIX 🔥
const safeDate = (value: any) => {
  try {
    if (!value) return null;

    // Firestore Timestamp
    if (value?.toDate) return value.toDate();

    const d = new Date(value);

    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);
  const [reclamations, setReclamations] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const recSnap = await getDocs(collection(db, 'reclamations'));

      setUsers(usersSnap.docs.map((d) => d.data()));
      setReclamations(recSnap.docs.map((d) => d.data()));
    };

    load();
  }, []);

  // 📊 USERS PER DAY
  const usersPerDay = useMemo(() => {
    const map: Record<string, number> = {};

    users.forEach((u) => {
      const dateObj = safeDate(u.createdAt);
      if (!dateObj) return;

      const date = dateObj.toISOString().split('T')[0];

      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map)
      .sort()
      .map((date) => ({
        date,
        users: map[date],
      }));
  }, [users]);

  // 🥧 RECLAMATIONS STATUS
  const pieData = useMemo(() => {
    const map: Record<string, number> = {};

    reclamations.forEach((r) => {
      const status = r.status || 'pending';
      map[status] = (map[status] || 0) + 1;
    });

    return Object.keys(map).map((k) => ({
      name: k,
      value: map[k],
    }));
  }, [reclamations]);

  // STATS
  const totalUsers = users.length;
  const totalRec = reclamations.length;
  const pending = reclamations.filter((r) => r.status === 'pending').length;

  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>

      <DashboardContent>

        {/* HEADER */}
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold">
            📊 SmartCare Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analytics utilisateurs & réclamations
          </Typography>
        </Box>

        {/* STATS */}
        <Grid container spacing={3} mb={3}>
<Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography>👥 Utilisateurs</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </Card>
          </Grid>

<Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography>📩 Réclamations</Typography>
              <Typography variant="h4">{totalRec}</Typography>
            </Card>
          </Grid>

<Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography>⏳ En attente</Typography>
              <Typography variant="h4">{pending}</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* CHARTS */}
        <Grid container spacing={3}>

          {/* LINE CHART */}
<Grid size={{ xs: 12, md: 8 }}>   
           <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" mb={2}>
                📈 Utilisateurs par jour
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usersPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#6366f1"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* PIE CHART */}
<Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" mb={2}>
                🥧 Statut réclamations
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

      </DashboardContent>
    </>
  );
}