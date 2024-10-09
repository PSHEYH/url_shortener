import { Schema, model, Document } from 'mongoose';

interface IUrl extends Document {
  longUrl: string;
  shortUrl: string;
  password?: string;
  date: Date;
}

const urlSchema = new Schema<IUrl>({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  password: { type: String },
  date: { type: Date, default: Date.now },
});

const Url = model<IUrl>('Uri', urlSchema);

export default Url;
