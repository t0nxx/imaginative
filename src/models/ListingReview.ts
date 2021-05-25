import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface ListingReviewAttributes {
  id: string;
  userId: string;
  listingId: string;
  title: string;
  goodAboutListing: string;
  notGoodAboutListing: string;
  reviewText: string;
  starRating: number;
}

type ListingReviewCreationAttributes = Optional<ListingReviewAttributes, 'id'>;

export default class ListingReview
  extends Model<ListingReviewAttributes, ListingReviewCreationAttributes>
  implements ListingReviewAttributes
{
  public id!: string;
  public userId!: string;
  public listingId!: string;
  public title!: string;
  public goodAboutListing!: string;
  public notGoodAboutListing!: string;
  public reviewText!: string;
  public starRating!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ListingReview.init(
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
    title: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    goodAboutListing: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    notGoodAboutListing: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    reviewText: {
      type: new DataTypes.STRING(500),
      allowNull: false,
    },
    starRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'listing_reviews',
    sequelize,
  },
);
