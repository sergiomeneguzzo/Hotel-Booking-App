import { Request, Response, NextFunction } from 'express';
import BookingService from './booking.service';
import { BookingDTO } from './booking.dto';
import { validate } from 'class-validator';
import logService from '../services/logs/log.service';
import { IBooking } from './booking.entity';

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { hotelId, checkInDate, checkOutDate, guests } = req.body;
  const userId = req.user?.id;

  if (!hotelId || !checkInDate || !checkOutDate || !guests) {
    logService.add('Booking Creation Error', false);
    return res.status(400).json({ message: 'Dati mancanti o incompleti.' });
  }

  const isAvailable = await BookingService.isRoomAvailable(
    hotelId,
    new Date(checkInDate),
    new Date(checkOutDate),
  );
  if (!isAvailable) {
    return res.status(400).json({
      message: 'La stanza non è disponibile per le date selezionate.',
    });
  }

  const bookingDTO = new BookingDTO();
  bookingDTO.userId = userId!;
  bookingDTO.hotel = hotelId;
  bookingDTO.checkInDate = new Date(checkInDate);
  bookingDTO.checkOutDate = new Date(checkOutDate);
  bookingDTO.guests = guests;
  bookingDTO.status = 'confirmed';

  const errors = await validate(bookingDTO);
  if (errors.length > 0) {
    logService.add('Booking Validation Error', false);
    return res.status(400).json({ message: 'Errore di validazione', errors });
  }

  try {
    const booking = await BookingService.createBooking(bookingDTO);
    logService.add('Booking Created', true);
    return res
      .status(201)
      .json({ message: 'Prenotazione creata con successo', booking });
  } catch (error) {
    logService.add('Booking Creation Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { bookingId } = req.params;

  try {
    const booking = await BookingService.getBookingById(bookingId);
    if (!booking) {
      logService.add('Booking Retrieval Error', false);
      return res.status(404).json({ message: 'Prenotazione non trovata.' });
    }
    return res.status(200).json(booking);
  } catch (error) {
    logService.add('Booking Retrieval Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { bookingId } = req.params;
  const updateData: Partial<IBooking> = req.body;

  try {
    const updatedBooking = await BookingService.updateBooking(
      bookingId,
      updateData,
    );
    if (!updatedBooking) {
      logService.add('Booking Update Error', false);
      return res.status(404).json({ message: 'Prenotazione non trovata.' });
    }
    logService.add('Booking Updated', true);
    return res.status(200).json({
      message: 'Prenotazione aggiornata con successo',
      updatedBooking,
    });
  } catch (error) {
    logService.add('Booking Update Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { bookingId } = req.params;

  try {
    const success = await BookingService.deleteBooking(bookingId);
    if (!success) {
      logService.add('Booking Deletion Error', false);
      return res.status(404).json({ message: 'Prenotazione non trovata.' });
    }
    logService.add('Booking Deleted', true);
    return res
      .status(200)
      .json({ message: 'Prenotazione eliminata con successo' });
  } catch (error) {
    logService.add('Booking Deletion Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const getBookingsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const userId = req.user?.id;

  if (!userId) {
    logService.add('User ID Missing for Booking Retrieval', false);
    return res.status(400).json({ message: 'ID utente mancante.' });
  }

  try {
    const bookings = await BookingService.getBookingsByUser(userId);
    console.log('Bookings with populated hotel:', bookings);
    return res.status(200).json(bookings);
  } catch (error) {
    logService.add('Booking Retrieval Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const bookings = await BookingService.getAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    logService.add('All Bookings Retrieval Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { bookingId } = req.params;

  try {
    const canceledBooking = await BookingService.cancelBooking(bookingId);
    if (!canceledBooking) {
      logService.add('Booking Cancellation Error', false);
      return res.status(404).json({ message: 'Prenotazione non trovata.' });
    }
    logService.add('Booking Canceled', true);
    return res.status(200).json({
      message: 'Prenotazione annullata con successo',
      canceledBooking,
    });
  } catch (error) {
    logService.add('Booking Cancellation Error', false);
    return res.status(500).json({
      message: `Errore del server: ${
        error instanceof Error ? error.message : 'Errore sconosciuto'
      }`,
    });
  }
};

export const getUnavailableDates = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { hotelId } = req.params;

  try {
    const bookings = await BookingService.getBookingsByHotel(hotelId);
    const unavailableDates = bookings.map((booking) => ({
      start: booking.checkInDate,
      end: booking.checkOutDate,
    }));
    return res.status(200).json(unavailableDates);
  } catch (error) {
    logService.add('Unavailable Dates Retrieval Error', false);
    return res.status(500).json({
      message: `Server error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    });
  }
};
