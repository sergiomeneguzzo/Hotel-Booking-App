import { Request, Response, NextFunction } from 'express';
import { File as MulterFile } from 'multer';
import HotelService from './hotel.service';
import { HotelDTO } from './hotel.dto';
import { validate } from 'class-validator';
import logService from '../services/logs/log.service';
import cloudinary from '../../utils/cloudinary-config';

declare global {
  namespace Express {
    interface Request {
      files?: MulterFile[];
    }
  }
}

export const createHotel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const hotelDTO = new HotelDTO();
  hotelDTO.name = req.body.name;
  hotelDTO.description = req.body.description;
  hotelDTO.location = req.body.location;
  hotelDTO.maxGuests = Number(req.body.maxGuests);
  hotelDTO.amenities = JSON.parse(req.body.amenities);
  hotelDTO.pricePerNight = Number(req.body.pricePerNight);
  hotelDTO.hotelTypeId = req.body.hotelType;

  try {
    hotelDTO.photos = req.body.photos;

    if (Array.isArray(req.body.photos)) {
      req.body.photos.forEach((photo, index) => {
        console.log(`Element ${index}:`, photo);
        console.log(`Type of element ${index}:`, typeof photo);
      });
    }

    console.log('hotelDTO.photos:', hotelDTO.photos);

    if (!hotelDTO.photos || hotelDTO.photos.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one photo is required' });
    }

    const hotel = await HotelService.createHotel(hotelDTO);
    return res
      .status(201)
      .json({ message: 'Hotel created successfully', hotel });
  } catch (error) {
    return res.status(500).json({
      message: `Server error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    });
  }
};

export const getAllHotels = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const hotels = await HotelService.getAllHotels();
    return res.status(200).json(hotels);
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const getHotelById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  try {
    const hotel = await HotelService.getHotelById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel non trovato' });
    }
    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const updateHotel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  const hotelData: Partial<HotelDTO> = req.body;

  try {
    const updatedHotel = await HotelService.updateHotel(id, hotelData);
    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel non trovato' });
    }
    return res
      .status(200)
      .json({ message: 'Hotel aggiornato con successo', updatedHotel });
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const deleteHotel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  try {
    const deletedHotel = await HotelService.deleteHotel(id);
    if (!deletedHotel) {
      return res.status(404).json({ message: 'Hotel non trovato' });
    }
    return res.status(200).json({ message: 'Hotel eliminato con successo' });
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};
