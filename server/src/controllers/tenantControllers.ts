import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

// GET /tenants/by-id/:id
export const getTenantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        favorites: true,
      },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving tenant: ${error.message}` });
  }
};

// POST /tenants
export const createTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;

    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(tenant);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating tenant: ${error.message}` });
  }
};

// PUT /tenants/by-id/:id
export const updateTenantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name, email, phoneNumber } = req.body;

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(updatedTenant);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating tenant: ${error.message}` });
  }
};

// GET /tenants/by-id/:id/current-residences
export const getCurrentResidencesById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const properties = await prisma.property.findMany({
      where: {
        tenants: {
          some: { id },
        },
      },
      include: {
        location: true,
      },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.locationId}`;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );

    res.json(residencesWithFormattedLocation);
  } catch (err: any) {
    res.status(500).json({ message: `Error retrieving residences: ${err.message}` });
  }
};

// POST /tenants/by-id/:id/favorites/:propertyId
export const addFavoritePropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const propertyId = Number(req.params.propertyId);

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { favorites: true },
    });

    if (!tenant) {
      res.status(404).json({ message: "Tenant not found" });
      return;
    }

    const existingFavorites = tenant.favorites || [];

    if (!existingFavorites.some((fav: any) => fav.id === propertyId)) {
      const updatedTenant = await prisma.tenant.update({
        where: { id },
        data: {
          favorites: {
            connect: { id: propertyId },
          },
        },
        include: { favorites: true },
      });
      res.json(updatedTenant);
    } else {
      res.status(409).json({ message: "Property already added as favorite" });
    }
  } catch (error: any) {
    res.status(500).json({ message: `Error adding favorite property: ${error.message}` });
  }
};

// DELETE /tenants/by-id/:id/favorites/:propertyId
export const removeFavoritePropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const propertyId = Number(req.params.propertyId);

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        favorites: {
          disconnect: { id: propertyId },
        },
      },
      include: { favorites: true },
    });

    res.json(updatedTenant);
  } catch (err: any) {
    res.status(500).json({ message: `Error removing favorite property: ${err.message}` });
  }
};
