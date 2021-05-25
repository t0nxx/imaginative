import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';
import LocalizedHiringType from './HiringType.Localized';

interface HiringTypeAttributes {
  id: string;
  code: string;
}

type HiringTypeCreationAttributes = Optional<HiringTypeAttributes, 'id'>;

export default class HiringType
  extends Model<HiringTypeAttributes, HiringTypeCreationAttributes>
  implements HiringTypeAttributes
{
  public id!: string;
  public code!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly localizedHiringTypes?: LocalizedHiringType[];

  public static associations: {
    products: Association<HiringType, LocalizedHiringType>;
  };
}

HiringType.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'hiring_types',
    sequelize,
  },
);

HiringType.hasMany(LocalizedHiringType, {
  sourceKey: 'id',
  foreignKey: 'refId',
  as: 'localized_hiring_types',
});
