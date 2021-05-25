import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';
import LocalizedDisclaimer from './Disclaimer.Localized';

interface DisclaimerAttributes {
  id: string;
  code: string;
}

type DisclaimerCreationAttributes = Optional<DisclaimerAttributes, 'id'>;

export default class Disclaimer
  extends Model<DisclaimerAttributes, DisclaimerCreationAttributes>
  implements DisclaimerAttributes
{
  public id!: string;
  public code!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly localizedDisclaimers?: LocalizedDisclaimer[];

  public static associations: {
    products: Association<Disclaimer, LocalizedDisclaimer>;
  };
}

Disclaimer.init(
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
    tableName: 'disclaimers',
    sequelize,
  },
);

Disclaimer.hasMany(LocalizedDisclaimer, {
  sourceKey: 'id',
  foreignKey: 'refId',
  as: 'localized_disclaimers',
});
