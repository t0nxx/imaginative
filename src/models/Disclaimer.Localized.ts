import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface LocalizedDisclaimerAttributes {
  id: string;
  name: string;
  refId: string;
  language: string;
}

type LocalizedDisclaimerCreationAttributes = Optional<
  LocalizedDisclaimerAttributes,
  'id'
>;

export default class LocalizedDisclaimer
  extends Model<
    LocalizedDisclaimerAttributes,
    LocalizedDisclaimerCreationAttributes
  >
  implements LocalizedDisclaimerAttributes
{
  public id!: string;
  public name!: string;
  public refId!: string;
  public language!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LocalizedDisclaimer.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(150),
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
    tableName: 'localized_disclaimers',
    sequelize,
  },
);
