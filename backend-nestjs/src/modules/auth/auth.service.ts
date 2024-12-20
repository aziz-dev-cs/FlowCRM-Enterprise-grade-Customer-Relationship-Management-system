import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private workspacesService: WorkspacesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, workspaceName } = registerDto;
    
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });
    
    const workspace = await this.workspacesService.create({
      name: workspaceName || `${firstName}'s Workspace`,
      ownerId: user.id,
    });
    
    const tokens = await this.generateTokens(user.id, workspace.id);
    return { user, workspace, ...tokens };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const workspaceMember = await this.workspacesService.findMemberByUser(user.id);
    if (!workspaceMember) {
      throw new UnauthorizedException('No workspace found');
    }
    
    const tokens = await this.generateTokens(user.id, workspaceMember.workspaceId);
    return { user, workspace: workspaceMember.workspace, ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      const tokens = await this.generateTokens(user.id, payload.workspaceId);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(userId: string, workspaceId: string) {
    const payload = { sub: userId, workspaceId };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    
    return { accessToken, refreshToken };
  }

  async validateOAuthLogin(profile: any): Promise<User> {
    const { email, firstName, lastName, googleId } = profile;
    
    let user = await this.usersService.findByEmail(email);
    
    if (!user) {
      user = await this.usersService.create({
        email,
        firstName,
        lastName,
        googleId,
      });
    }
    
    return user;
  }
}