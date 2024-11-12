import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from './empresa.entity';

@Entity('cotizaciones')
export class Cotizacion {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    public id: number;

    @Column({
        name: 'fecha',
        type: 'varchar',
        precision: 10,
    })
    public fecha: string;

    @Column({
        name: 'hora',
        type: 'varchar',
        precision: 5,
    })
    public hora: string;

    @Column({
        name: 'date',
    })
    public dateUTC: string;

    @Column({
        name: 'cotizacion',
        type: 'decimal',
        precision: 7,
        scale: 2,
    })
    public cotizacion: number;

    @ManyToOne(() => Empresa)
    @JoinColumn({
        name: 'idEmpresa',
        referencedColumnName: 'id'
    })
    empresa: Empresa;

    constructor(){};
}