import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Language {
  ENGLISH = 'en',
  FRENCH = 'fr',
}

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'date' })
  publicationDate: string;

  @Column()
  numberOfPages: number;

  @Column({ type: 'enum', enum: Language })
  language: Language;
}
