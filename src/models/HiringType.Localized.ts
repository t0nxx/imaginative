import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface LocalizedHiringTypeAttributes {
  id: string;
  name: string;
  refId: string;
  language: string;
}

type LocalizedHiringTypeCreationAttributes = Optional<
  LocalizedHiringTypeAttributes,
  'id'
>;

export default class LocalizedHiringType
  extends Model<
    LocalizedHiringTypeAttributes,
    LocalizedHiringTypeCreationAttributes
  >
  implements LocalizedHiringTypeAttributes
{
  public id!: string;
  public name!: string;
  public refId!: string;
  public language!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LocalizedHiringType.init(
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
    tableName: 'localized_hiring_types',
    sequelize,
  },
);
