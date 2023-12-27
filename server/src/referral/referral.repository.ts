import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Referral } from "src/common/database/entities/referral.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReferralRepository {
    constructor(@InjectRepository(Referral) private readonly _referralRepository: Repository<Referral>) {}

    async getExistingReferral(
        userAddress: string,
        referralProviderAddress: string,
        productId: number,
    ): Promise<Referral> {
        return await this._referralRepository
            .createQueryBuilder("referral")
            .leftJoinAndSelect("referral.referralProvider", "provider")
            .leftJoinAndSelect("referral.user", "user")
            .leftJoinAndSelect("referral.product", "product")
            .where("provider.address = :referralProviderAddress", { referralProviderAddress })
            .andWhere("user.address = :userAddress", { userAddress })
            .andWhere("product.id = :productId", { productId })
            .getOne();
    }

    async createReferral(referral: Partial<Referral>): Promise<Referral> {
        const referralEntity = this._referralRepository.create(referral);
        const newReferral = await this._referralRepository.save(referralEntity);
        return newReferral;
    }

    async getNotUpdatedReferrals(): Promise<Referral[]> {
        return await this._referralRepository
            .createQueryBuilder("referral")
            .leftJoinAndSelect("referral.referralProvider", "provider")
            .leftJoinAndSelect("referral.user", "user")
            .leftJoinAndSelect("referral.product", "product")
            .where("referral.isUpdated = false")
            .getMany();
    }

    async getReferralProviderCount(referralProviderAddress: string): Promise<number> {
        return await this._referralRepository
            .createQueryBuilder("referral")
            .leftJoinAndSelect("referral.referralProvider", "provider")
            .where("provider.address = :referralProviderAddress", { referralProviderAddress })
            .getCount();
    }

    async getUserCount(userAddress: string): Promise<number> {
        return await this._referralRepository
            .createQueryBuilder("referral")
            .leftJoinAndSelect("referral.user", "user")
            .where("user.address = :userAddress", { userAddress })
            .getCount();
    }

    async saveReferrals(referrals: Partial<Referral>[]) {
        return await this._referralRepository.save(referrals);
    }
}
