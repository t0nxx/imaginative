import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface ListingFollowerAttributes {
  id: string;
  userId: string;
  listingId: string;
}

type ListingFollowerCreationAttributes = Optional<
  ListingFollowerAttributes,
  'id'
>;

export default class ListingFollower
  extends Model<ListingFollowerAttributes, ListingFollowerCreationAttributes>
  implements ListingFollowerAttributes
{
  public id!: string;
  public userId!: string;
  public listingId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ListingFollower.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    listingId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'listing_followers',
    sequelize,
  },
);
