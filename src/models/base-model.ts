import { Document, Schema, model } from 'mongoose';

interface IBaseDocument extends Document {
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}


const BaseSchema = new Schema<IBaseDocument>({
  deleted_at: {
    type: Date,
    default: null,
  },
}, { 
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
  }
});

const BaseModel = model<IBaseDocument>('Base', BaseSchema);

export default BaseModel;