import type { FormEvent } from "react";
import { Button, Card, CardContent, Stack, TextField } from "@mui/material";
import type { AuthMode } from "../types";

type AuthCardProps = {
  mode: AuthMode;
  loading: boolean;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AuthCard({ mode, loading, onModeChange, onSubmit }: AuthCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant={mode === "register" ? "contained" : "outlined"}
            onClick={() => onModeChange("register")}
            type="button"
          >
            Register
          </Button>
          <Button
            variant={mode === "login" ? "contained" : "outlined"}
            onClick={() => onModeChange("login")}
            type="button"
          >
            Login
          </Button>
        </Stack>

        <Stack component="form" onSubmit={onSubmit} spacing={1.5}>
          {mode === "register" ? <TextField name="name" label="Name" required fullWidth /> : null}
          <TextField name="email" type="email" label="Email" required fullWidth />
          <TextField name="password" type="password" label="Password" required fullWidth />
          <Button variant="contained" disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "register" ? "Create Account" : "Login"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
