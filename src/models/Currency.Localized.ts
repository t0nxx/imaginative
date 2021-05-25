import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface LocalizedCurrencyAttributes {
  id: string;
  name: string;
  standardCode: string;
  refId: string;
  language: string;
}

type LocalizedCurrencyCreationAttributes = Optional<
  LocalizedCurrencyAttributes,
  'id'
>;

export default class LocalizedCurrency
  extends Model<
    LocalizedCurrencyAttributes,
    LocalizedCurrencyCreationAttributes
  >
  implements LocalizedCurrencyAttributes
{
  public id!: string;
  public name!: string;
  public standardCode!: string;
  public refId!: string;
  public language!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LocalizedCurrency.init(
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
    standardCode: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    refId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    language: {
      type: new DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    tableName: 'localized_currencies',
    sequelize,
  },
);
