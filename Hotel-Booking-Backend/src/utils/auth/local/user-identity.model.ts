import { UserIdentityModel } from './user-identity.entity';
import mongoose, { Schema } from "mongoose";

const userIdentitySchema = new mongoose.Schema<UserIdentityModel>({
    provider: {type: String, default: 'local'},
    credentials: {
        type: {
            username: String,
            hashedPassword: String
        }
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

userIdentitySchema.pre('findOne', function(next) {
    this.populate('user');
    next();
})

export const UserIdentityModel = mongoose.model<UserIdentityModel>('UserIdentity', userIdentitySchema);