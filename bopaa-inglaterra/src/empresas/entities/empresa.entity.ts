import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Bolsa } from 'src/bolsa/entities/bolsa.entity';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id: number;

  @Column({
    name: 'codigoEmpresa',
    length: 100,
  })
  public codigoEmpresa: string;

  @Column({
    name: 'nombreEmpresa',
    length: 100,
  })
  public nombreEmpresa: string;

  @Column({
    name: 'acciones',
    type: 'bigint',
  })
  public acciones: number;

  @ManyToOne(() => Bolsa)
  @JoinColumn({
    name: 'idBolsa',
    referencedColumnName: 'id'
  })
  public bolsa: Bolsa;

  constructor(codigoEmpresa: string, nombreEmpresa: string) {
    this.codigoEmpresa = codigoEmpresa;
    this.nombreEmpresa = nombreEmpresa;
  }
}