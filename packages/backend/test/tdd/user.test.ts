import mongoose from 'mongoose';
import '../setup';

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should hash password before saving', async () => {
        const user = new User({
            email: 'test@example.com',
            password: '1234',
            firstName: 'John',
            lastName: 'Doe'
        });
        await user.save();

        const savedUser = await User.findOne({ email: 'test@example.com' });
        expect(savedUser.password).not.toBe('1234');
    });
});