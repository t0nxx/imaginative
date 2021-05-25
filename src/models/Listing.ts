import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface ListingAttributes {
  id: string;
  ownerId: string;
  pageType: string;
  listingTypeId: string;
  privacy: string;
  media: any;
  name: string;
  brandName: string;
  description: string;
  credentials: string;
  uses: string;
  stockAvailability: string;
  advantages: string;
  url: string;
  price: number;
  priceTypeId: string;
  otherPriceType?: string;
  currencyId?: string;
  hiringTypeId?: string;
  otherHiring?: string;
  offerPrice: number;
  offerDescription: string;
  socialLinks: any;
  viewsCount: number;
  status: number;
  isEdited: boolean;

  overallRating: number;
  totalRatingCount: number;
}

type ListingCreationAttributes = Optional<ListingAttributes, 'id'>;

export default class Listing
  extends Model<ListingAttributes, ListingCreationAttributes>
  implements ListingAttributes
{
  public id!: string;
  public ownerId!: string;
  public pageType!: string;
  public listingTypeId!: string;
  public privacy!: string;
  public media!: any;
  public name!: string;
  public brandName!: string;
  public description!: string;
  public credentials!: string;
  public stockAvailability!: string;
  public advantages!: string;
  public uses!: string;
  public url!: string;
  public priceTypeId!: string;
  public otherPriceType?: string;
  public price!: number;
  public currencyId?: string;
  public hiringTypeId?: string;
  public otherHiring?: string;
  public offerPrice!: number;
  public offerDescription!: string;
  public socialLinks!: any;
  public viewsCount!: number;
  public status!: number;
  public isEdited!: boolean;
  public overallRating!: number;
  public totalRatingCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Listing.init(
  {
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    pageType: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    listingTypeId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    privacy: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    media: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(200),
      allowNull: false,
    },
    brandName: {
      type: new DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(3000),
      allowNull: false,
    },
    stockAvailability: {
      type: new DataTypes.STRING(70),
      allowNull: false,
    },
    advantages: {
      type: new DataTypes.STRING(2000),
      allowNull: false,
    },
    uses: {
      type: new DataTypes.STRING(1500),
      allowNull: false,
    },
    credentials: {
      type: new DataTypes.STRING(3000),
      allowNull: false,
    },
    url: {
      type: new DataTypes.STRING(400),
      allowNull: false,
    },
    priceTypeId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    otherPriceType: {
      type: new DataTypes.STRING(150),
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    currencyId: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },
    hiringTypeId: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },
    otherHiring: {
      type: new DataTypes.STRING(150),
      allowNull: true,
    },
    offerPrice: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    offerDescription: {
      type: new DataTypes.STRING(3000),
      allowNull: false,
    },
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    viewsCount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    status: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    overallRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalRatingCount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'listings',
    sequelize,
  },
);
