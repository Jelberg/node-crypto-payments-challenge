import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    involvesWatchonly: boolean

    @Column({ nullable: true })
    account: string

    @Column({ nullable: true })
    label: string

    @Column()
    address: string

    @Column()
    category: string

    @Column({ type: 'real' })
    amount: number

    @Column()
    confirmations: number

    @Column()
    blockhash: string

    @Column()
    blockindex: number

    @Column({ type: 'bigint' })
    blocktime: number

    @Column()
    txid: string

    @Column()
    vout: number

    @Column('jsonb', { nullable: true })
    walletconflicts: any[]

    @Column({ type: 'bigint' })
    time: number

    @Column({ type: 'bigint' })
    timereceived: number

    @Column({ nullable: true })
    replaceable: string
}
