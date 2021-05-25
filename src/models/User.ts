import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';
import Listing from './Listing';
import PasswordRecoveryToken from './PasswordRecoveryToken';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  featuredProductName?: string;
  featuredProductId?: string;
  hash: string | null;
  googleId: string | null;
  facebookId: string | null;
  notificationsEnabled: boolean;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'hash' | 'googleId' | 'facebookId'
>;

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public photoUrl?: string;
  public featuredProductName?: string;
  public featuredProductId?: string;

  public hash!: string | null;
  public googleId!: string | null;
  public facebookId!: string | null;
  public notificationsEnabled!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly listings?: Listing[];

  public static associations: {
    listings: Association<User, Listing>;
    passwordRecoveryToken: Association<User, PasswordRecoveryToken>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    photoUrl: {
      type: new DataTypes.STRING(300),
      allowNull: true,
    },
    featuredProductName: {
      type: new DataTypes.STRING(200),
      allowNull: true,
    },
    featuredProductId: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },
    hash: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    googleId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facebookId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
  },
);

User.hasMany(Listing, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'listings',
});

User.hasOne(PasswordRecoveryToken, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'password_recovery_tokens',
});
