import { SafeUser } from 'src/platform/users/entities/user.entity';
import { TokenInfo } from './token.entity';

export type RegisterResponse = SafeUser & TokenInfo;
