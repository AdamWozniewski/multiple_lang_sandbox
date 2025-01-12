import { hashPassword } from '../../src/services/hash.js';
import * as bcrypt from 'bcrypt';

// Mockowanie całego modułu bcrypt
vi.mock('bcrypt', () => ({
  genSaltSync: vi.fn(() => 'mockSalt'),
  hashSync: vi.fn(() => 'mockHashedPassword'),
}));

describe('hashPassword', () => {
  it('should hash the password correctly', () => {
    // Wywołanie funkcji do przetestowania
    const hashedPassword = hashPassword('password123');

    // Asercje dla mocków
    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10); // SALT_ROUNDS
    expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 'mockSalt');

    // Asercja dla wyniku
    expect(hashedPassword).toBe('mockHashedPassword');
  });
});