import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    constructor(codigoEmpresa: string, nombreEmpresa:string) {
        this.codigoEmpresa = codigoEmpresa;
        this.nombreEmpresa = nombreEmpresa;
    }

    public getId(): number {
        return this.id;
      }
    
      public getCodigoEmpresa(): string {
        return this.codigoEmpresa;
      }
    
      public setCodempresa(codigoEmpresa: string) {
        this.codigoEmpresa = codigoEmpresa;
      }
    
      public getNombreEmpresa(): string {
        return this.nombreEmpresa;
      }
    
      public setNombreEmpresa(nombreEmpresa: string) {
        this.nombreEmpresa = nombreEmpresa;
      }
}