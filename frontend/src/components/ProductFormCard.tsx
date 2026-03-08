import type { FormEvent } from "react";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import type { ProductForm } from "../types";

type ProductFormCardProps = {
  form: ProductForm;
  editing: boolean;
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (next: ProductForm) => void;
  onCancelEdit: () => void;
};

export default function ProductFormCard({
  form,
  editing,
  loading,
  onSubmit,
  onChange,
  onCancelEdit
}: ProductFormCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {editing ? "Edit Product" : "Add Product"}
        </Typography>
        <Stack component="form" onSubmit={onSubmit} spacing={1.5}>
          <TextField
            label="Product name"
            value={form.name}
            onChange={(event) => onChange({ ...form, name: event.target.value })}
            required
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(event) => onChange({ ...form, description: event.target.value })}
            multiline
            minRows={3}
          />
          <TextField
            label="Price"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={form.price}
            onChange={(event) => onChange({ ...form, price: event.target.value })}
            required
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" disabled={loading} type="submit">
              {editing ? "Update Product" : "Add Product"}
            </Button>
            {editing ? (
              <Button variant="outlined" onClick={onCancelEdit} type="button">
                Cancel
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
