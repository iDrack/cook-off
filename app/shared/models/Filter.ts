import type { Category } from "./Category";

export interface Filter {
  category: Category | undefined;
  onlyFavorite: boolean;
  onlyDraft: boolean;
}
