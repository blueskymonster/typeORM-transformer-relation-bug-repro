import { 
  Column, 
  createConnection, 
  Entity, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  PrimaryColumn,
  getRepository,
  ConnectionOptions,
} from "typeorm";

// This is a contrived and silly example of a primary 
// column transformer but it's enough to show the issue.
const WrappedIntTransformer = {
  from: (value: number) => `"${value}"`,
  to: (value: string | undefined | null) => value ? parseInt(value.slice(1, value.length - 1)) : null,
}

@Entity()
export class User {
  @PrimaryColumn({ type: "int", transformer: WrappedIntTransformer, nullable: false })
  id: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Promise<Photo[]>;
}

@Entity()
export class Photo {
  @PrimaryColumn({ type: "int", transformer: WrappedIntTransformer, nullable: false })
  id: string;

  @Column({ type: "text" })
  url: string;

  @Column({ type: "int", transformer: WrappedIntTransformer, nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.photos)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: Promise<User>;
}

const connectionArgs: ConnectionOptions = {
  type: "sqlite",
  database: ":memory:",
  entities: [User, Photo],
  synchronize: true,
  logging: true,
};

createConnection(connectionArgs).then(
  async (connection) => {
     const userRepository = getRepository(User);
     const photoRepository = getRepository(Photo);
     const user = userRepository.create({id: `"1"`});
     await userRepository.save(user);
     const photo = photoRepository.create({id: `"42"`, url: "example.com/photo1", userId: user.id})
     await photoRepository.save(photo);
     await user.photos;
  }
)
