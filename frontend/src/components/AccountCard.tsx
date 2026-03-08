import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import type { User } from "../types";

type AccountCardProps = {
  user: User | null;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export default function AccountCard({ user, onLogout, onDeleteAccount }: AccountCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between">
          <Typography>
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onLogout} type="button">
              Logout
            </Button>
            <Button color="error" variant="contained" onClick={onDeleteAccount} type="button">
              Delete Account
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
