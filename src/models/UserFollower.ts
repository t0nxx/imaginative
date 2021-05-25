import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface UserFollowerAttributes {
  id: string;
  userId: string;
  followerId: string;
}

type UserFollowerCreationAttributes = Optional<UserFollowerAttributes, 'id'>;

export default class UserFollower
  extends Model<UserFollowerAttributes, UserFollowerCreationAttributes>
  implements UserFollowerAttributes
{
  public id!: string;
  public userId!: string;
  public followerId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserFollower.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    followerId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'user_followers',
    sequelize,
  },
);
