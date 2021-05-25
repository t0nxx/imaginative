import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface PasswordRecoveryTokenAttributes {
  id: string;
  userId: string;
  token: string;
}

type PasswordRecoveryTokenCreationAttributes = Optional<
  PasswordRecoveryTokenAttributes,
  'id'
>;

export default class PasswordRecoveryToken
  extends Model<
    PasswordRecoveryTokenAttributes,
    PasswordRecoveryTokenCreationAttributes
  >
  implements PasswordRecoveryTokenAttributes
{
  public id!: string;
  public userId!: string;
  public token!: string;
}

PasswordRecoveryToken.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    token: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    tableName: 'password_recovery_tokens',
    sequelize,
  },
);
