import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import AmenityService from './amenities.service';
import { AmenityDTO } from './amenities.dto';

export const createAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const amenityDTO = new AmenityDTO();
  amenityDTO.name = req.body.name;
  amenityDTO.description = req.body.description;

  const errors = await validate(amenityDTO);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Errore di validazione', errors });
  }

  try {
    const amenity = await AmenityService.createAmenity(amenityDTO);
    return res
      .status(201)
      .json({ message: 'Amenity creata con successo', amenity });
  } catch (error) {
    return res.status(500).json({ message: 'Errore del server', error });
  }
};

export const getAllAmenities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const amenities = await AmenityService.getAllAmenities();
    return res.status(200).json(amenities);
  } catch (error) {
    return res.status(500).json({ message: 'Errore del server', error });
  }
};

export const getAmenityById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const amenity = await AmenityService.getAmenityById(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity non trovata' });
    }
    return res.status(200).json(amenity);
  } catch (error) {
    return res.status(500).json({ message: 'Errore del server', error });
  }
};

export const updateAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const amenityData: Partial<AmenityDTO> = req.body;

  try {
    const updatedAmenity = await AmenityService.updateAmenity(id, amenityData);
    if (!updatedAmenity) {
      return res.status(404).json({ message: 'Amenity non trovata' });
    }
    return res
      .status(200)
      .json({ message: 'Amenity aggiornata con successo', updatedAmenity });
  } catch (error) {
    return res.status(500).json({ message: 'Errore del server', error });
  }
};

export const deleteAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const deletedAmenity = await AmenityService.deleteAmenity(id);
    if (!deletedAmenity) {
      return res.status(404).json({ message: 'Amenity non trovata' });
    }
    return res.status(200).json({ message: 'Amenity eliminata con successo' });
  } catch (error) {
    return res.status(500).json({ message: 'Errore del server', error });
  }
};
