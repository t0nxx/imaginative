import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';
import LocalizedCurrency from './Currency.Localized';

interface CurrencyAttributes {
  id: string;
  code: string;
  symbol: string;
}

type CurrencyCreationAttributes = Optional<CurrencyAttributes, 'id'>;

export default class Currency
  extends Model<CurrencyAttributes, CurrencyCreationAttributes>
  implements CurrencyAttributes
{
  public id!: string;
  public code!: string;
  public symbol!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly localizedCurrencies?: LocalizedCurrency[];

  public static associations: {
    products: Association<Currency, LocalizedCurrency>;
  };
}

Currency.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: new DataTypes.STRING(10),
      allowNull: false,
    },
    symbol: {
      type: new DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: 'currencies',
    sequelize,
  },
);

Currency.hasMany(LocalizedCurrency, {
  sourceKey: 'id',
  foreignKey: 'refId',
  as: 'localized_currencies',
});
