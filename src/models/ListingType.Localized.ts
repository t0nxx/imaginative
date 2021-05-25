import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface LocalizedListingTypeAttributes {
  id: string;
  name: string;
  refId: string;
  language: string;
}

type LocalizedListingTypeCreationAttributes = Optional<
  LocalizedListingTypeAttributes,
  'id'
>;

export default class LocalizedListingType
  extends Model<
    LocalizedListingTypeAttributes,
    LocalizedListingTypeCreationAttributes
  >
  implements LocalizedListingTypeAttributes
{
  public id!: string;
  public name!: string;
  public refId!: string;
  public language!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LocalizedListingType.init(
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
    tableName: 'localized_listing_types',
    sequelize,
  },
);
