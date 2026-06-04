import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { User } from '../users/user.entity';
import { CustomerProfile } from '../users/customer-profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CustomerProfile)
    private readonly profileRepo: Repository<CustomerProfile>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private signToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: this.configService.get<string>('JWT_SECRET', 'secret') },
    );
  }

  private sanitizeUser(user: User) {
    const { passwordHash: _pw, ...rest } = user as any;
    return rest;
  }

  async register(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const id = randomUUID();
    const user = this.userRepo.create({
      id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      provider: 'email',
      isGuest: false,
    });
    const saved = await this.userRepo.save(user);

    // Create customer profile
    const profile = this.profileRepo.create({ userId: saved.id, loyaltyPoints: 0 });
    await this.profileRepo.save(profile);

    return { user: this.sanitizeUser(saved), token: this.signToken(saved) };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: dto.email })
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash ?? '');
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return { user: this.sanitizeUser(user), token: this.signToken(user) };
  }

  async social(dto: {
    provider: string;
    providerId: string;
    firstName: string;
    lastName: string;
    email: string;
  }) {
    let user = await this.userRepo.findOne({
      where: { provider: dto.provider, providerId: dto.providerId },
    });

    if (!user && dto.email) {
      user = await this.userRepo.findOne({ where: { email: dto.email } });
    }

    if (!user) {
      user = this.userRepo.create({
        id: randomUUID(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        provider: dto.provider,
        providerId: dto.providerId,
        isGuest: false,
      });
      const saved = await this.userRepo.save(user);
      const profile = this.profileRepo.create({ userId: saved.id, loyaltyPoints: 0 });
      await this.profileRepo.save(profile);
      return { user: this.sanitizeUser(saved), token: this.signToken(saved) };
    } else {
      user.provider = dto.provider;
      user.providerId = dto.providerId;
    }

    const saved = await this.userRepo.save(user);
    return { user: this.sanitizeUser(saved), token: this.signToken(saved) };
  }

  async guest() {
    const guestId = `guest_${Date.now()}`;
    const user = this.userRepo.create({
      id: randomUUID(),
      firstName: 'Guest',
      lastName: 'User',
      email: `${guestId}@guest.worldoftoys.com`,
      provider: 'guest',
      isGuest: true,
    });
    const saved = await this.userRepo.save(user);
    return { user: this.sanitizeUser(saved), token: this.signToken(saved) };
  }
}
