import * as twilio from 'twilio';

export const client = new twilio.Twilio(
    process.env.SID as string, process.env.TWILIO_TOKEN as string,
);
