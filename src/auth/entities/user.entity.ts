// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   Index,
// } from 'typeorm';

// @Entity({ name: 'users' })
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ nullable: false })
//   name: string;

//   @Index({ unique: true })
//   @Column({ nullable: false })
//   email: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;
// }