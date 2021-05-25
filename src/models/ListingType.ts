import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';
import LocalizedListingType from './ListingType.Localized';

interface ListingTypeAttributes {
  id: string;
  code: string;
  category: string;
}

type ListingTypeCreationAttributes = Optional<ListingTypeAttributes, 'id'>;

export default class ListingType
  extends Model<ListingTypeAttributes, ListingTypeCreationAttributes>
  implements ListingTypeAttributes
{
  public id!: string;
  public code!: string;
  public category!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly localizedListingTypes?: LocalizedListingType[];

  public static associations: {
    products: Association<ListingType, LocalizedListingType>;
  };
}

ListingType.init(
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
    category: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'listing_types',
    sequelize,
  },
);

ListingType.hasMany(LocalizedListingType, {
  sourceKey: 'id',
  foreignKey: 'refId',
  as: 'localized_listing_types',
});
