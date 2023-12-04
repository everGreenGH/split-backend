import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Referral } from "src/common/database/entities/referral.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReferralRepository {
    constructor(@InjectRepository(Referral) private readonly _referralRepository: Repository<Referral>) {}

    async getExistingReferral(userAddress: string, referralProviderAddress: string): Promise<Referral> {
        return await this._referralRepository
            .createQueryBuilder("referral")
            .leftJoinAndSelect("referral.referralProvider", "referralProvider")
            .leftJoinAndSelect("referral.user", "user")
            .where("user.address = :userAddress", { userAddress })
            .andWhere("referralProvider.address = :referralProviderAddress", { referralProviderAddress })
            .getOne();
    }

    async createReferral(referral: Partial<Referral>): Promise<Referral> {
        const referralEntity = this._referralRepository.create(referral);
        const newReferral = await this._referralRepository.save(referralEntity);
        return newReferral;
    }
}
