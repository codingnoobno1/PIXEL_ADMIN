"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserProfile from "@/components/UserProfile";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to top, #000000, #3b82f6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={6} sx={{ width: 450, p: 4, borderRadius: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Dashboard
            </Typography>
            <UserProfile />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => router.push('/dashboard/admin_project_coordinator')}
              >
                Admin Project Coordinator
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/dashboard/project_mentor')}
              >
                Project Mentor
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/dashboard/quiz_controller')}
              >
                Quiz Controller
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return null;
}
