import { IsEthereumAddress, IsNotEmpty, Min } from 'class-validator';

export class LoginDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  signature: string;
}
