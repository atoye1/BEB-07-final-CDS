import { IsEthereumAddress } from 'class-validator';

export class getAddressDto {
  @IsEthereumAddress()
  readonly address: string;
}
