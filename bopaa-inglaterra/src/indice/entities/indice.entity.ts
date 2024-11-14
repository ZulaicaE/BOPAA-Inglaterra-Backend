import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Bolsa } from 'src/bolsa/entities/bolsa.entity';
@Entity('indices')
export class Indice {
  @PrimaryGeneratedColumn({
    type: 'int',
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
    name: 'indiceBursatil',
    type: 'decimal',
    precision: 7,
    scale: 2,
  })
  public indiceBursatil: number;

  @ManyToOne(() => Bolsa)
  @JoinColumn({
    name: 'idBolsa',
    referencedColumnName: 'id'
  })
  bolsa: Bolsa;

  constructor() { };
}