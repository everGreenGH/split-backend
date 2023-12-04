import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "src/common/database/entities/wallet.entity";
import { Repository } from "typeorm";

@Injectable()
export class WalletService {
    constructor(@InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>) {}

    public async findWalletByAddr(walletAddr: string): Promise<Wallet> {
        return await this.walletRepository.findOne({ where: { address: walletAddr.toLowerCase() } });
    }

    public async findOrCreateWallet(walletAddr: string): Promise<Wallet> {
        const wallet = await this.walletRepository.findOne({ where: { address: walletAddr.toLowerCase() } });

        if (!wallet) {
            const wallet = await this.walletRepository.save({
                address: walletAddr.toLowerCase(),
            });
            return wallet;
        }
        return wallet;
    }
}
