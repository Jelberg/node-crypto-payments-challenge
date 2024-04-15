import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class File extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    filename: string
}
