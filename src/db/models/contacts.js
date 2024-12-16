// src/db/models/student.js

import { model, Schema } from 'mongoose';
import { mongoose } from 'mongoose';
const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      default: 'personal',
      enum: ['work', 'home', 'personal'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    photo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

export const MyContacts = model('Contact', contactsSchema);
