import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class GetNonceDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;
}
