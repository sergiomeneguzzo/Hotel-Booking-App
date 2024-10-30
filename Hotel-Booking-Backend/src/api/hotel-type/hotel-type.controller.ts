import { NextFunction, Request, Response } from 'express';
import HotelTypeService from './hotel-type.service';
import { HotelTypeDTO } from './hotel-type.dto';
import { validate } from 'class-validator';
import logService from '../services/logs/log.service';

export const createHotelType = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const hotelTypeDTO = new HotelTypeDTO();
  hotelTypeDTO.name = req.body.name;
  hotelTypeDTO.description = req.body.description;

  const errors = await validate(hotelTypeDTO);
  if (errors.length > 0) {
    logService.add('HotelType Validation Error', false);
    return res.status(400).json({ message: 'Errore di validazione', errors });
  }

  try {
    const hotelType = await HotelTypeService.createHotelType(hotelTypeDTO);
    logService.add('HotelType Created', true);
    return res
      .status(201)
      .json({ message: 'Tipo di hotel creato con successo', hotelType });
  } catch (error) {
    logService.add('HotelType Creation Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const getAllHotelTypes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const hotelTypes = await HotelTypeService.getAllHotelTypes();
    return res.status(200).json(hotelTypes);
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const getHotelTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  try {
    const hotelType = await HotelTypeService.getHotelTypeById(id);
    if (!hotelType) {
      return res.status(404).json({ message: 'Tipo di hotel non trovato' });
    }
    return res.status(200).json(hotelType);
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const updateHotelType = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  const hotelTypeData: Partial<HotelTypeDTO> = req.body;

  try {
    const updatedHotelType = await HotelTypeService.updateHotelType(
      id,
      hotelTypeData,
    );
    if (!updatedHotelType) {
      return res.status(404).json({ message: 'Tipo di hotel non trovato' });
    }
    return res.status(200).json({
      message: 'Tipo di hotel aggiornato con successo',
      updatedHotelType,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const deleteHotelType = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  try {
    const deletedHotelType = await HotelTypeService.deleteHotelType(id);
    if (!deletedHotelType) {
      return res.status(404).json({ message: 'Tipo di hotel non trovato' });
    }
    return res
      .status(200)
      .json({ message: 'Tipo di hotel eliminato con successo' });
  } catch (error) {
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};
