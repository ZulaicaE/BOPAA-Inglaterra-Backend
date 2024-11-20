import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Indice } from 'src/indice/entities/indice.entity';

@Entity('bolsas')
export class Bolsa {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id: number;

  @Column({
    name: 'codigoBolsa',
    length: 100,
    unique: true,
  })
  public codigoBolsa: string;

  @OneToMany(() => Indice, indice => indice.bolsa)
  public indices: Indice[];

  constructor(codigoBolsa: string) {
    this.codigoBolsa = codigoBolsa;
  }
}