import { User } from 'discord.js';
import { Packages } from '../schemas/package.schema.js';

export type iWorkflowPackageStatus = 'trial' | 'buy_new' | 'upgrade'

export const NewPackageUser = async (user: User) => {
    await Packages.updateOne({
        user: user.id
    }, {
        $set: {
            available_packages: 0,
            waiting_status: 'trial'
        }
    }, {
        upsert: true
    })
}

export const SetUserPackageWaitingStatus = async (user: User, package_status: Exclude<iWorkflowPackageStatus, 'trial'>) => {
    await Packages.updateOne({
        user: user.id
    }, {
        $set: {
            waiting_status: package_status
        }
    })
}

export const SetAvailablePackages = async (user: User, amount: number) => {
    await Packages.updateOne({
        user: user.id
    }, {
        $set: {
            available_packages: amount
        }
    })
}

export const GetPackageDetails = async (user: User) => {
    const pack = await Packages.findOne({ user: user.id })
    if (!pack) { return false }
    return {
        available_packages: pack.available_packages,
        waiting_status: pack.waiting_status
    }
}
