import {
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import type { Product } from "../types";

type ProductsTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Your Products
        </Typography>
      {products.length === 0 ? (
          <Typography>No products added yet.</Typography>
      ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description || "-"}</TableCell>
                    <TableCell>{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => onEdit(product)} type="button">
                          Edit
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => onDelete(product.id)}
                          type="button"
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
            ))}
              </TableBody>
            </Table>
          </TableContainer>
      )}
      </CardContent>
    </Card>
  );
}
