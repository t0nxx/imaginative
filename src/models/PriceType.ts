import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';
import LocalizedPriceType from './PriceType.Localized';

interface PriceTypeAttributes {
  id: string;
  code: string;
}

type PriceTypeCreationAttributes = Optional<PriceTypeAttributes, 'id'>;

export default class PriceType
  extends Model<PriceTypeAttributes, PriceTypeCreationAttributes>
  implements PriceTypeAttributes
{
  public id!: string;
  public code!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly localizedPriceTypes?: LocalizedPriceType[];

  public static associations: {
    products: Association<PriceType, LocalizedPriceType>;
  };
}

PriceType.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: new DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    tableName: 'price_types',
    sequelize,
  },
);

PriceType.hasMany(LocalizedPriceType, {
  sourceKey: 'id',
  foreignKey: 'refId',
  as: 'localized_price_types',
});
