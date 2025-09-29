import express from "express";
import {
  getTenantById,
  createTenant,
  updateTenantById,
  getCurrentResidencesById,
  addFavoritePropertyById,
  removeFavoritePropertyById,
} from "../controllers/tenantControllers";

const router = express.Router();

// Buscar tenant pelo ID
router.get("/by-id/:id", getTenantById);

// Atualizar tenant pelo ID
router.put("/by-id/:id", updateTenantById);

// Criar novo tenant
router.post("/", createTenant);

// Buscar residências atuais do tenant pelo ID
router.get("/by-id/:id/current-residences", getCurrentResidencesById);

// Adicionar favorito
router.post("/by-id/:id/favorites/:propertyId", addFavoritePropertyById);

// Remover favorito
router.delete("/by-id/:id/favorites/:propertyId", removeFavoritePropertyById);

export default router;
