import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deactivateAccount(userId: string): Promise<{
        message: string;
    }>;
    findById(userId: string): Promise<{
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        phone: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
