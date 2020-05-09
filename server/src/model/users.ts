import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre("save", function (next) {
    const user: any = this;
    if (this.isModified("password")) {
        hashPassword(user.password, (error, hash) => {
            if (error) {
                console.error(error);
                return next(error);
            }

            user.password = hash;
            return next();
        })
    } else {
        return next();
    }
})

userSchema.methods.comparePassword = (user, password, next) => {
    bcrypt.compare(password, user.password, (error, isMatch) => {
        console.error(error);
        return next(error, isMatch);
    });
}

const hashPassword = (plainText, callback: (error: Error, hash: String) => void) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error(err);
            callback(err, null);
            return;
        }

        bcrypt.hash(plainText, salt, (error, hash) => {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, hash);
        });
    });
}
