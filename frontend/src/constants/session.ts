import type { ProductForm } from "../types";

export const tokenKey = "shop_token";
export const userKey = "shop_user";

export const emptyProductForm: ProductForm = {
  name: "",
  description: "",
  price: ""
};
