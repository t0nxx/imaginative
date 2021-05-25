import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../shared/core/Database';

interface StoryAttributes {
  id: string;
  ownerId: string;
  listingId?: string | null;
  privacy: string;
  media: any;
  headerLine: string;
  disclaimerId: string;
  intro?: string;
  body?: string;
  tagline?: string;
  conclusion?: string;
  imaginativeYear: number;
  status: number;
}

type StoryCreationAttributes = Optional<StoryAttributes, 'id'>;

export default class Story
  extends Model<StoryAttributes, StoryCreationAttributes>
  implements StoryAttributes
{
  public id!: string;
  public ownerId!: string;
  public listingId?: string | null;
  public privacy!: string;
  public media!: any;
  public headerLine!: string;
  public disclaimerId!: string;
  public intro?: string;
  public body?: string;
  public tagline?: string;
  public conclusion?: string;
  public imaginativeYear!: number;
  public status!: number; //0-draft|1- published,2-user_template|3-example_template

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Story.init(
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
    listingId: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },
    privacy: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    media: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    headerLine: {
      type: new DataTypes.STRING(200),
      allowNull: false,
    },
    disclaimerId: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    intro: {
      type: new DataTypes.STRING(3000),
      allowNull: true,
    },
    body: {
      type: new DataTypes.STRING(3000),
      allowNull: true,
    },
    tagline: {
      type: new DataTypes.STRING(200),
      allowNull: true,
    },
    conclusion: {
      type: new DataTypes.STRING(3000),
      allowNull: true,
    },
    imaginativeYear: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    status: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: 'stories',
    sequelize,
  },
);
