import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface LocalizedPriceTypeAttributes {
  id: string;
  name: string;
  format: string;
  refId: string;
  language: string;
}

type LocalizedPriceTypeCreationAttributes = Optional<
  LocalizedPriceTypeAttributes,
  'id'
>;

export default class LocalizedPriceType
  extends Model<
    LocalizedPriceTypeAttributes,
    LocalizedPriceTypeCreationAttributes
  >
  implements LocalizedPriceTypeAttributes
{
  public id!: string;
  public name!: string;
  public format!: string;
  public refId!: string;
  public language!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LocalizedPriceType.init(
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
    format: {
      type: new DataTypes.STRING(128),
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
    tableName: 'localized_price_types',
    sequelize,
  },
);
