export type Message = {
  role: 'user' | 'model';
  text: string;
  images?: string[];
};
