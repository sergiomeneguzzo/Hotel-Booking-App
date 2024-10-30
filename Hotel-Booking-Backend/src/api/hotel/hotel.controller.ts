import { Request, Response, NextFunction } from 'express';
import { File as MulterFile } from 'multer';
import HotelService from './hotel.service';
import { HotelDTO } from './hotel.dto';
import { validate } from 'class-validator';
import logService from '../services/logs/log.service';

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
  hotelDTO.photos = req.files?.map((file: any) => file.filename) || [];
  hotelDTO.pricePerNight = Number(req.body.pricePerNight);
  hotelDTO.hotelTypeId = req.body.hotelType;

  const errors = await validate(hotelDTO);
  if (errors.length > 0) {
    logService.add('Hotel Validation Error', false);
    return res.status(400).json({ message: 'Errore di validazione', errors });
  }

  if (hotelDTO.photos.length === 0) {
    logService.add('No Photos Provided', false);
    return res.status(400).json({ message: 'Almeno una foto è obbligatoria' });
  }

  try {
    const hotel = await HotelService.createHotel(hotelDTO);
    logService.add('Hotel Created', true);
    return res
      .status(201)
      .json({ message: 'Hotel creato con successo', hotel });
  } catch (error) {
    logService.add('Hotel Creation Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
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
