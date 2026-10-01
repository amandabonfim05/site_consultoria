export {};

declare global {
  namespace Express {
    interface Request {
      consultorId?: string;
    }
  }
}
